export interface IGoogleMapsService {
  calculateRoute(
    origin: string,
    destination: string
  ): Promise<{
    origin: string;
    destination: string;
    distance: number;
    duration: string;
  }>;
}
