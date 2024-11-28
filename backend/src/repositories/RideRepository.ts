import { Model } from 'mongoose';
import { CreateRideRequestDTOType } from '../dtos/CreateRideRequestDTO';
import {
  DriverNotFoundException,
  InvalidDistanceException,
} from '../exceptions/DomainExceptions';
import { IRideQuery } from '../interfaces/IRideQuery';
import { IRideRepository } from '../interfaces/IRideRepository';
import Driver, { IDriver } from '../models/Driver';
import Ride, { IRide } from '../models/Ride';

export class RideRepository implements IRideRepository {
  private driverModel: Model<IDriver>;

  constructor() {
    this.driverModel = Driver;
  }

  async findDriverBySomeCriteria(
    driverId: number,
    distance: number
  ): Promise<IDriver | null> {
    const driver: IDriver | null = await this.driverModel.findOne({
      _id: driverId,
    });

    if (!driver) {
      throw new DriverNotFoundException();
    }

    if (distance < driver.minKm) {
      throw new InvalidDistanceException();
    }

    return driver;
  }

  async save(ride: CreateRideRequestDTOType): Promise<IRide> {
    const newRide = new Ride(ride);
    return await newRide.save();
  }

  async findByCustomerAndDriver(
    customerId: string,
    driverId: number | undefined
  ): Promise<IRide[]> {
    const query: IRideQuery = { customer_id: customerId };
    if (driverId) {
      query['driver.id'] = driverId;
    }
    return await Ride.find(query).sort({ createdAt: -1 });
  }
}
