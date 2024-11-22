import { CreateRideDTOType } from '../dtos/CreateRideDTO';
import { EstimateRideRequestDTOType } from '../dtos/EstimateRideRequestDTO';
import { EstimateRideResponseDTOType } from '../dtos/EstimateRideResponseDTO';
import { IRide } from '../models/Ride';

export interface IRideService {
  estimateRide(
    data: EstimateRideRequestDTOType
  ): Promise<EstimateRideResponseDTOType>;
  confirmRide(data: CreateRideDTOType): Promise<IRide>;
  getRideHistory(customerId: string, driverId?: string): Promise<IRide[]>;
}
