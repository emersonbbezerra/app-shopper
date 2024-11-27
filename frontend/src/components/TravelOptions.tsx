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

const libraries: string[] = ['marker', 'geometry'];

const TravelOptions: React.FC = () => {
  const location = useLocation();
  const storedData = JSON.parse(localStorage.getItem('rideData') || '{}');
  const drivers: Driver[] = location.state?.drivers || storedData.drivers || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route: any = location.state?.route || storedData.route || {};
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const mapContainerStyle = {
    height: '400px',
    width: '100%',
  };

  const handleConfirmRide = async (driverId: number) => {
    setError('');
    try {
      const customerId = location.state?.customer_id || storedData.customer_id;
      const selectedDriver = drivers.find((driver) => driver.id === driverId);

      if (!customerId) {
        throw new Error('ID do usuário não encontrado');
      }

      if (!selectedDriver) {
        throw new Error('Motorista inválido');
      }

      if (!route.origin || !route.origin.address) {
        throw new Error('Endereço de origem não encontrado');
      }

      if (!route.destination || !route.destination.address) {
        throw new Error('Endereço de destino não encontrado');
      }

      if (!route.distance) {
        throw new Error('Distância não encontrada');
      }

      if (!route.duration) {
        throw new Error('Duração não encontrada');
      }

      const requestData = {
        customer_id: customerId,
        origin: route.origin.address,
        destination: route.destination.address,
        distance: Number(route.distance),
        duration: route.duration,
        driver: {
          id: driverId,
          name: selectedDriver.name,
        },
        value: Number(selectedDriver.value),
      };

      console.log('Request Data:', requestData);

      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/ride/confirm`,
        requestData
      );
      navigate('/history');
    } catch (error) {
      let errorMessage = 'Erro desconhecido ao confirmar corrida';

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data.error_description ||
            'Erro ao processar a solicitação';
          console.error('Erro do servidor:', error.response.data);
        } else if (error.request) {
          errorMessage = 'Não foi possível conectar ao servidor';
          console.error('Erro de requisição:', error.request);
        } else {
          errorMessage = error.message;
          console.error('Erro de configuração:', error.message);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      console.error('Erro completo:', error);
    }
  };

  const onLoad = async (map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({
      lat: route.origin?.latitude,
      lng: route.origin?.longitude,
    });
    bounds.extend({
      lat: route.destination?.latitude,
      lng: route.destination?.longitude,
    });

    map.fitBounds(bounds);

    map.setOptions({
      styles: [
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
      ],
    });

    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    new AdvancedMarkerElement({
      map: map,
      position: { lat: route.origin?.latitude, lng: route.origin?.longitude },
      title: 'Origem',
    });

    new AdvancedMarkerElement({
      map: map,
      position: {
        lat: route.destination?.latitude,
        lng: route.destination?.longitude,
      },
      title: 'Destino',
    });

    if (route.polyline) {
      const decodedPath = google.maps.geometry.encoding.decodePath(
        route.polyline
      );

      const borderLine = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#0A11D8',
        strokeOpacity: 1,
        strokeWeight: 7,
        zIndex: 1,
      });

      const innerLine = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#0F53FF',
        strokeOpacity: 1,
        strokeWeight: 4,
        zIndex: 1,
      });

      const arrowIcon = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 4,
        strokeColor: '#0A11D8',
        strokeWeight: 2,
        fillColor: '#0F53FF',
        fillOpacity: 1,
      };

      const lineWithIcons = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: 'transparent',
        zIndex: 1,
        icons: [
          {
            icon: arrowIcon,
            offset: '50%',
            repeat: '200px',
          },
        ],
      });

      borderLine.setMap(map);
      innerLine.setMap(map);
      lineWithIcons.setMap(map);
    }
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <div>
        <Typography variant="h5" gutterBottom={true}>
          Opções de Motoristas
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY!}
          libraries={libraries as ['marker', 'geometry']}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            onLoad={onLoad}
            options={{ mapId: 'DEMO_MAP_ID' }}
          >
            {/* Os marcadores e a linha do trajeto são adicionados no onLoad */}
          </GoogleMap>
        </LoadScript>
        <Container style={{ marginTop: '20px' }}>
          {drivers.map((driver) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={driver.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{driver.name}</Typography>
                  <Typography color="textSecondary">
                    {driver.description}
                  </Typography>
                  <Typography> Veículo: {driver.vehicle}</Typography>
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
        </Container>
      </div>
    </Container>
  );
};
export default TravelOptions;
