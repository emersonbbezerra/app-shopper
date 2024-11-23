import { CreateRideDTOType } from '../dtos/CreateRideRequestDTO';
import { IRideQuery } from '../interfaces/IRideQuery';
import { IRideRepository } from '../interfaces/IRideRepository';
import Ride, { IRide } from '../models/Ride';

export class RideRepository implements IRideRepository {
  async save(ride: CreateRideDTOType): Promise<IRide> {
    const newRide = new Ride(ride);
    return await newRide.save();
  }

  async findByCustomerAndDriver(
    customerId: string,
    driverId?: string
  ): Promise<IRide[]> {
    const query: IRideQuery = { customer_id: customerId };

    if (driverId) {
      query['driver.id'] = driverId;
    }

    return await Ride.find(query).sort({ createdAt: -1 });
  }
}
