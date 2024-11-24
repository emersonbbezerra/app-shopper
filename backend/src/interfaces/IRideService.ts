import { ConfirmRideResponseDTOType } from '../dtos/ConfirmRideResponseDTO';
import { CreateRideRequestDTOType } from '../dtos/CreateRideRequestDTO';
import { EstimateRideRequestDTOType } from '../dtos/EstimateRideRequestDTO';
import { EstimateRideResponseDTOType } from '../dtos/EstimateRideResponseDTO';
import { RideHistoryResponseDTOType } from '../dtos/RideHistoryResponseDTO';

export interface IRideService {
  estimateRide(
    data: EstimateRideRequestDTOType
  ): Promise<EstimateRideResponseDTOType>;
  confirmRide(
    data: CreateRideRequestDTOType
  ): Promise<ConfirmRideResponseDTOType>;
  getRideHistory(
    customer_id: string,
    driverId: number
  ): Promise<RideHistoryResponseDTOType>;
}
