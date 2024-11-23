import { CreateRideRequestDTOType } from '../dtos/CreateRideRequestDTO';
import { IRide } from '../models/Ride';
import { IRideQuery } from './IRideQuery';

export interface IRideRepository {
  save(ride: CreateRideRequestDTOType): Promise<IRide>;
  findByCustomerAndDriver(data: IRideQuery): Promise<IRide[]>;
}
