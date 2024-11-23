import { ConfirmRideResponseDTOType } from '../dtos/ConfirmRideResponseDTO';
import { CreateRideRequestDTOType } from '../dtos/CreateRideRequestDTO';
import { EstimateRideRequestDTOType } from '../dtos/EstimateRideRequestDTO';
import { EstimateRideResponseDTOType } from '../dtos/EstimateRideResponseDTO';
import { RideHistoryResponseDTOType } from '../dtos/RideHistoryResponseDTO';
import { IRideQuery } from './IRideQuery';

export interface IRideService {
  estimateRide(
    data: EstimateRideRequestDTOType
  ): Promise<EstimateRideResponseDTOType>;
  confirmRide(
    data: CreateRideRequestDTOType
  ): Promise<ConfirmRideResponseDTOType>;
  getRideHistory(data: IRideQuery): Promise<RideHistoryResponseDTOType>;
}
