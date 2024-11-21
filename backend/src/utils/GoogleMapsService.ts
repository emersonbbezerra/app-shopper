import axios from 'axios';

export class GoogleMapsService {
  private apiKey: string;
  private apiUri: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    this.apiUri = process.env.GOOGLE_MAPS_API_URI || '';
  }

  async calculateRoute(origin: string, destination: string) {
    try {
      const response = await axios.get(this.apiUri, {
        params: {
          origin,
          destination,
          key: this.apiKey,
        },
      });

      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        origin: leg.start_address,
        destination: leg.end_address,
        distance: leg.distance.value,
        duration: leg.duration.text,
      };
    } catch (error) {
      console.error('Error while fetching route:', error);
      throw new Error('Error fetching route from Google Maps API');
    }
  }
}
