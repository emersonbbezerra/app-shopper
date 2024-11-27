import { Client } from '@googlemaps/google-maps-services-js';
import { IGoogleMapsService } from '../interfaces/IGoogleMapsService';

export class GoogleMapsService implements IGoogleMapsService {
  private apiKey: string;
  private client: Client;

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    this.client = new Client({});
  }

  async calculateRoute(origin: string, destination: string) {
    try {
      const response = await this.client.directions({
        params: {
          origin,
          destination,
          key: this.apiKey,
        },
      });

      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        origin: {
          latitude: leg.start_location.lat,
          longitude: leg.start_location.lng,
        },
        destination: {
          latitude: leg.end_location.lat,
          longitude: leg.end_location.lng,
        },
        polyline: route.overview_polyline.points, // Nova linha
        distance: leg.distance.value,
        duration: leg.duration.text,
      };
    } catch (error) {
      console.error('Error while fetching route:', error);
      throw new Error('Erro ao calcular a rota');
    }
  }
}
