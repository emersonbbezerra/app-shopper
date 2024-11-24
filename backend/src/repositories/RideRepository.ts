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
        throw new Error(
          `Quilometragem inválida para o motorista. Mínimo: ${driver.minKm} km.`
        );
      }
      return driver;
    } else {
      throw new Error('Motorista não encontrado');
    }
  }

  async save(ride: CreateRideRequestDTOType): Promise<IRide> {
    console.log('RideRepository: save() - Iniciando a inserção da corrida...');
    console.log('RideRepository: save() - Dados da corrida:', ride);
    try {
      const newRide = new Ride(ride);
      const savedRide = await newRide.save();
      console.log(
        'RideRepository: save() - Corrida salva com sucesso:',
        savedRide
      );
      return savedRide;
    } catch (error) {
      console.error('RideRepository: save() - Erro ao salvar corrida:', error);
      throw error;
    }
  }

  async findByCustomerAndDriver(data: IRideQuery): Promise<IRide[]> {
    const query: IRideQuery = { customer_id: data.customer_id };

    if (data['driver.id']) {
      query['driver.id'] = data['driver.id'];
    }

    return await Ride.find(query).sort({ createdAt: -1 });
  }
}
