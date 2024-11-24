import { EstimateRideResponseDTOType } from '../dtos/EstimateRideResponseDTO';

export interface IGoogleMapsService {
  calculateRoute(
    origin: string,
    destination: string
  ): Promise<Partial<EstimateRideResponseDTOType>>;
}
