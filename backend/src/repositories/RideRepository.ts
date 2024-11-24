import { Model } from 'mongoose';
import { CreateRideRequestDTOType } from '../dtos/CreateRideRequestDTO';
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

    if (driver) {
      if (distance < driver.minKm) {
        throw new Error('Quilometragem inválida para o motorista');
      }
      return driver;
    } else {
      throw new Error('Motorista não encontrado');
    }
  }

  async save(ride: CreateRideRequestDTOType): Promise<IRide> {
    const newRide = new Ride(ride);
    const savedRide = await newRide.save();
    return savedRide;
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
