import { CreateRideRequestDTOType } from '../dtos/CreateRideRequestDTO';
import { IDriver } from '../models/Driver';
import { IRide } from '../models/Ride';

export interface IRideRepository {
  save(ride: CreateRideRequestDTOType): Promise<IRide>;
  findByCustomerAndDriver(
    customerId: string,
    driverId: number | undefined
  ): Promise<IRide[]>;
  findDriverBySomeCriteria(
    driverId: number,
    distance: number
  ): Promise<IDriver | null>;
}
