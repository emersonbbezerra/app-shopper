import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ride } from '../types/Ride';

const RideHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<string>('Todos');
  const [rides, setRides] = useState<Ride[]>([]);
  const [drivers, setDrivers] = useState<string[]>(['Todos']);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate('/');
  };

  const handleFetchRides = async () => {
    setError('');
    setLoading(true);
    setRides([]);

    try {
      // Validação básica do ID do cliente
      if (!customerId.trim()) {
        setError('Por favor, insira um ID de usuário válido');
        setLoading(false);
        return;
      }

      console.log('Fetching rides for customer ID:', customerId);

      // Buscar histórico de viagens
      const response = await axios.get<{
        message: string;
        data: {
          rides: Ride[];
        };
      }>(`${process.env.REACT_APP_BACKEND_URI}/ride/${customerId}`);

      console.log('API Response:', response.data);

      if (!response.data || !response.data.data || !response.data.data.rides) {
        throw new Error('Dados inválidos na resposta da API');
      }

      // Converte distância de metros para quilômetros
      const ridesWithDistanceInKm = response.data.data.rides.map(
        (ride: Ride) => ({
          ...ride,
          distance: ride.distance / 1000,
        })
      );

      console.log('Rides with distance in km:', ridesWithDistanceInKm);

      // Extrai nomes únicos de motoristas
      const uniqueDriverNames = [
        'Todos',
        ...Array.from(
          new Set(ridesWithDistanceInKm.map((ride: Ride) => ride.driver.name))
        ).map(String),
      ];

      console.log('Unique driver names:', uniqueDriverNames);

      // Filtra as viagens se um motorista específico for selecionado
      const filteredRides =
        selectedDriver === 'Todos'
          ? ridesWithDistanceInKm
          : ridesWithDistanceInKm.filter(
              (ride: Ride) => ride.driver.name === selectedDriver
            );

      console.log('Filtered rides:', filteredRides);

      setRides(filteredRides);
      setDrivers(uniqueDriverNames);

      // Se nenhuma viagem for encontrada após filtragem, define um erro
      if (filteredRides.length === 0) {
        setError(
          `Nenhuma viagem encontrada para o motorista ${selectedDriver}`
        );
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error:', error.response.data);
        setError(
          error.response.data.error_description ||
            'Erro ao buscar histórico de viagens'
        );
      } else {
        console.error('Error:', error);
        setError('Erro ao buscar histórico de viagens. Tente novamente.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const formatDuration = (duration: string) => {
    // Inicializa variáveis para horas e minutos
    let hours = 0;
    let minutes = 0;

    // Verifica se a duração contém horas
    const hourMatch = duration.match(/(\d+)\s*hour/);
    if (hourMatch) {
      hours = parseInt(hourMatch[1]);
    }

    // Verifica se a duração contém minutos
    const minMatch = duration.match(/(\d+)\s*min/);
    const minsMatch = duration.match(/(\d+)\s*mins/);
    if (minMatch) {
      minutes = parseInt(minMatch[1]);
    } else if (minsMatch) {
      minutes = parseInt(minsMatch[1]);
    }

    // Formata a saída
    const parts = [];
    if (hours > 0) {
      parts.push(`${hours} h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} min`);
    }

    return parts.join(' ') || duration; // Retorna a duração original se não houver horas ou minutos
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h4" gutterBottom={true}>
          Histórico de Viagens
        </Typography>
        <IconButton
          color="primary"
          onClick={handleNavigateToHome}
          aria-label="voltar para home"
          style={{ marginBottom: '10px' }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {error && (
        <Typography
          color="error"
          variant="body1"
          style={{ marginBottom: '15px' }}
        >
          {error}
        </Typography>
      )}

      <Grid container={true} spacing={2} style={{ marginBottom: '20px' }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="ID do Usuário"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            fullWidth={true}
            required={true}
            error={!customerId.trim()}
            helperText={!customerId.trim() ? 'ID do usuário é obrigatório' : ''}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth={true}>
            <InputLabel>Motorista</InputLabel>
            <Select
              value={selectedDriver}
              label="Motorista"
              onChange={(e) => setSelectedDriver(e.target.value)}
              disabled={!customerId.trim() || rides.length === 0}
            >
              {drivers.map((driverName) => (
                <MenuItem key={driverName} value={driverName}>
                  {driverName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchRides}
            disabled={!customerId.trim() || loading}
            fullWidth={true}
          >
            {loading ? 'Carregando...' : 'Buscar Viagens'}
          </Button>
        </Grid>
      </Grid>

      {rides.length > 0 && (
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          Resultado: {rides.length} viagem(s)
        </Typography>
      )}

      {rides.map((ride) => (
        <Card key={ride.id} variant="outlined" style={{ marginBottom: '15px' }}>
          <CardContent>
            <Grid container={true} spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Data e Hora
                </Typography>
                <Typography variant="body1">{formatDate(ride.date)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Motorista
                </Typography>
                <Typography variant="body1">{ride.driver.name}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Origem
                </Typography>
                <Typography variant="body1">{ride.origin}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Destino
                </Typography>
                <Typography variant="body1">{ride.destination}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Distância
                </Typography>
                <Typography variant="body1">
                  {ride.distance.toFixed(2)} km
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Tempo
                </Typography>
                <Typography variant="body1">
                  {formatDuration(ride.duration)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Valor
                </Typography>
                <Typography variant="body1" color="primary">
                  R$ {ride.value.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {!loading && rides.length === 0 && customerId && (
        <Typography
          variant="body1"
          color="textSecondary"
          style={{ marginTop: '20px', textAlign: 'center' }}
        >
          Nenhuma viagem encontrada para este usuário.
        </Typography>
      )}
    </Container>
  );
};

export default RideHistory;
