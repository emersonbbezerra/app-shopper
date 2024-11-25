import { Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const RequestRide: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleEstimate = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/ride/estimate', {
        customer_id: customerId,
        origin,
        destination,
      });

      console.log(response.data);
    } catch (err: unknown) {
      setError(
        'Erro ao estimar a viagem. Verifique os dados e tente novamente.'
      );
      console.error(err);
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
