import { CreateRideDTOType } from '../dtos/CreateRideDTO';
import { EstimateRideRequestDTOType } from '../dtos/EstimateRideRequestDTO';
import { IRide } from '../models/Ride';

export interface IRideService {
  estimateRide(data: EstimateRideRequestDTOType): Promise<{
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
    options: {
      id: number;
      name: string;
      description: string;
      vehicle: string;
      review: {
        rating: number;
        comment: string;
      };
      value: number;
    }[];
    routeResponse: object;
  }>;
  confirmRide(data: CreateRideDTOType): Promise<IRide>;
  getRideHistory(customerId: string, driverId?: string): Promise<IRide[]>;
}
