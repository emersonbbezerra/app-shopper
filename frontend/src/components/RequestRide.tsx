import { Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RequestRide: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleEstimate = async () => {
    setError('');
    const requestData = {
      customer_id: customerId, // Manter como string
      origin,
      destination,
    };
    console.log('Request Data:', requestData);
    console.log('Backend URL:', process.env.REACT_APP_BACKEND_URI);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/ride/estimate`,
        requestData
      );

      console.log('API Response:', response.data);

      if (
        !response.data ||
        !response.data.data ||
        !response.data.data.routeResponse ||
        !response.data.data.origin ||
        !response.data.data.destination
      ) {
        throw new Error('Dados inválidos na resposta da API');
      }

      // Verificar se 'origin' e 'destination' estão definidos
      const routeOrigin = response.data.data.origin;
      const routeDestination = response.data.data.destination;

      if (!routeOrigin || !routeDestination) {
        throw new Error(
          'Dados de origem ou destino estão faltando na resposta da API'
        );
      }

      // Adicione os endereços textuais ao routeResponse
      const routeResponseWithAddresses = {
        ...response.data.data.routeResponse,
        origin: {
          ...routeOrigin,
          address: origin, // Adiciona o endereço textual de origem
        },
        destination: {
          ...routeDestination,
          address: destination, // Adiciona o endereço textual de destino
        },
      };

      localStorage.setItem(
        'rideData',
        JSON.stringify({
          drivers: response.data.data.options,
          route: routeResponseWithAddresses, // Use a versão atualizada
          customer_id: customerId, // Manter como string
        })
      );

      navigate('/options', {
        state: {
          drivers: response.data.data.options,
          route: routeResponseWithAddresses, // Use a versão atualizada
          customer_id: customerId, // Manter como string
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error:', error.response.data);
        setError(error.response.data.error_description);
      } else {
        console.error('Error:', error);
        setError('Os dados fornecidos no corpo da requisição são inválidos');
      }
    }
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom={true}>
        Solicitação de Viagem
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="ID do Usuário"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        fullWidth={true}
        margin="normal"
      />
      <TextField
        label="Origem"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        fullWidth={true}
        margin="normal"
      />
      <TextField
        label="Destino"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        fullWidth={true}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleEstimate}>
        Estimar Viagem
      </Button>
    </Container>
  );
};

export default RequestRide;
