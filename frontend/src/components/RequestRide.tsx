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
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/ride/estimate`,
        {
          customer_id: customerId,
          origin,
          destination,
        }
      );

      // Adicione os endereços textuais ao routeResponse
      const routeResponseWithAddresses = {
        ...response.data.routeResponse,
        origin: {
          ...response.data.routeResponse.origin,
          address: origin, // Adiciona o endereço textual de origem
        },
        destination: {
          ...response.data.routeResponse.destination,
          address: destination, // Adiciona o endereço textual de destino
        },
      };

      localStorage.setItem(
        'rideData',
        JSON.stringify({
          drivers: response.data.options,
          route: routeResponseWithAddresses, // Use a versão atualizada
          customer_id: customerId,
        })
      );

      navigate('/options', {
        state: {
          drivers: response.data.options,
          route: routeResponseWithAddresses, // Use a versão atualizada
          customer_id: customerId,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error_description);
      } else {
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
