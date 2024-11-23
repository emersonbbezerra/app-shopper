import { CreateRideRequestDTOType } from '../dtos/CreateRideRequestDTO';
import { IRideQuery } from '../interfaces/IRideQuery';
import { IRideRepository } from '../interfaces/IRideRepository';
import Ride, { IRide } from '../models/Ride';

export class RideRepository implements IRideRepository {
  async save(ride: CreateRideRequestDTOType): Promise<IRide> {
    const newRide = new Ride(ride);
    return await newRide.save();
  }

  async findByCustomerAndDriver(data: IRideQuery): Promise<IRide[]> {
    const query: IRideQuery = { customer_id: data.customer_id };

    if (data['driver.id']) {
      query['driver.id'] = data['driver.id'];
    }

    return await Ride.find(query).sort({ createdAt: -1 });
  }
}
