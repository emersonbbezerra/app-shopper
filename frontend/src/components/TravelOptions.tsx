import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Driver } from '../types/Driver';

const libraries: ['places', 'geometry', 'marker'] = [
  'places',
  'geometry',
  'marker',
];

const mapContainerStyle = { height: '400px', width: '100%' };
const mapStyles = [
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'on' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ zIndex: 1 }],
  },
];

// Definindo tipo para os dados da rota
type RouteData = {
  origin: { latitude: number; longitude: number; address: string };
  destination: { latitude: number; longitude: number; address: string };
  routes: Array<{
    legs: Array<{ distance: { value: number }; duration: { text: string } }>;
  }>;
  polyline?: string;
};

const TravelOptions: React.FC = () => {
  const location = useLocation();
  const storedData = JSON.parse(localStorage.getItem('rideData') || '{}');
  const drivers: Driver[] = location.state?.drivers || storedData.drivers || [];
  const route: RouteData = location.state?.route || storedData.route || {};
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleConfirmRide = async (driverId: number) => {
    setError('');
    try {
      const customerId = location.state?.customer_id || storedData.customer_id;
      const selectedDriver = drivers.find((driver) => driver.id === driverId);

      if (!customerId) throw new Error('ID do usuário não encontrado');
      if (!selectedDriver) throw new Error('Motorista inválido');
      if (!route.origin?.address)
        throw new Error('Endereço de origem não encontrado');
      if (!route.destination?.address)
        throw new Error('Endereço de destino não encontrado');

      const leg = route.routes[0]?.legs?.[0];
      if (!leg?.distance?.value) throw new Error('Distância não encontrada');
      if (!leg.duration?.text) throw new Error('Duração não encontrada');

      const requestData = {
        customer_id: customerId,
        origin: route.origin.address,
        destination: route.destination.address,
        distance: Number(leg.distance.value),
        duration: leg.duration.text,
        driver: {
          id: driverId,
          name: selectedDriver.name,
        },
        value: Number(selectedDriver.value),
      };

      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URI}/ride/confirm`,
        requestData
      );
      navigate('/history');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error_description ||
          'Erro de conexão com o servidor'
        : (error as Error).message || 'Erro desconhecido ao confirmar corrida';
      setError(errorMessage);
      console.error('Erro completo:', error);
    }
  };

  const addMarkersToMap = (map: google.maps.Map) => {
    new google.maps.marker.AdvancedMarkerElement({
      map: map, // Adiciona o marcador de origem ao mapa
      position: { lat: route.origin.latitude, lng: route.origin.longitude },
      title: 'Origem',
    });

    new google.maps.marker.AdvancedMarkerElement({
      map: map, // Adiciona o marcador de destino ao mapa
      position: {
        lat: route.destination.latitude,
        lng: route.destination.longitude,
      },
      title: 'Destino',
    });
  };

  const addPolylineToMap = (map: google.maps.Map, polyline: string) => {
    if (!polyline) return; // Não faz nada se não houver uma polyline

    const decodedPath = google.maps.geometry.encoding.decodePath(polyline);

    const createPolyline = (options: google.maps.PolylineOptions) =>
      new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        ...options,
      }).setMap(map);

    createPolyline({
      strokeColor: '#0A11D8',
      strokeOpacity: 1,
      strokeWeight: 7,
      zIndex: 1,
    });

    createPolyline({
      strokeColor: '#0F53FF',
      strokeOpacity: 1,
      strokeWeight: 4,
      zIndex: 2,
    });

    createPolyline({
      strokeColor: 'transparent',
      zIndex: 3,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
            strokeColor: '#0A11D8',
            strokeWeight: 2,
            fillColor: '#0F53FF',
            fillOpacity: 1,
          },
          offset: '50%',
          repeat: '200px',
        },
      ],
    });
  };

  const onLoad = (map: google.maps.Map) => {
    if (!map) return;

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: route.origin.latitude, lng: route.origin.longitude });
    bounds.extend({
      lat: route.destination.latitude,
      lng: route.destination.longitude,
    });

    map.fitBounds(bounds);
    map.setOptions({ styles: mapStyles });

    addMarkersToMap(map); // Adiciona os marcadores diretamente
    if (route.polyline) {
      addPolylineToMap(map, route.polyline); // Adiciona a polyline se houver
    }
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom={true}>
        Opções de Motoristas
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY!}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          onLoad={onLoad}
          options={{ styles: mapStyles }}
        />
      </LoadScript>
      <Container style={{ marginTop: '20px' }}>
        <Grid container={true} spacing={2}>
          {drivers.map((driver) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={driver.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{driver.name}</Typography>
                  <Typography color="textSecondary">
                    {driver.description}
                  </Typography>
                  <Typography>Veículo: {driver.vehicle}</Typography>
                  <Typography>
                    Avaliação: {driver.review.rating}/5 -{' '}
                    {driver.review.comment}
                  </Typography>
                  <Typography>Valor: R$ {driver.value.toFixed(2)}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleConfirmRide(driver.id)}
                  >
                    Escolher
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );
};

export default TravelOptions;
