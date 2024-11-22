import { CreateRideDTOType } from '../dtos/CreateRideDTO';
import { IRide } from '../models/Ride';

export interface IRideRepository {
  save(ride: CreateRideDTOType): Promise<IRide>;
  findByCustomerAndDriver(
    customerId: string,
    driverId?: string
  ): Promise<IRide[]>;
}
