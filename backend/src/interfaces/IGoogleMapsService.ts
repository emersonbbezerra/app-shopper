export interface IGoogleMapsService {
  calculateRoute(
    origin: string,
    destination: string
  ): Promise<{
    origin: {
      latitude: number;
      longitude: number;
    };
    destination: {
      latitude: number;
      longitude: number;
    };
    distance: number;
    duration: string;
  }>;
}
