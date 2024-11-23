import { CreateRideDTOType } from '../dtos/CreateRideDTO';
import { EstimateRideRequestDTOType } from '../dtos/EstimateRideRequestDTO';
import { IGoogleMapsService } from '../interfaces/IGoogleMapsService';
import { IRideRepository } from '../interfaces/IRideRepository';
import { IRideService } from '../interfaces/IRideService';
import Driver, { IDriver } from '../models/Driver';

export class RideService implements IRideService {
  private rideRepository: IRideRepository;
  private googleMapsService: IGoogleMapsService;

  constructor(
    rideRepository: IRideRepository,
    googleMapsService: IGoogleMapsService
  ) {
    this.rideRepository = rideRepository;
    this.googleMapsService = googleMapsService;
  }

  async estimateRide(data: EstimateRideRequestDTOType) {
    const { origin, destination } = data;
    const route = await this.googleMapsService.calculateRoute(
      origin,
      destination
    );

    const availableDrivers = await this.getAvailableDrivers(route.distance);

    return {
      origin: route.origin,
      destination: route.destination,
      distance: route.distance / 1000,
      duration: route.duration,
      options: availableDrivers,
    };
  }

  async confirmRide(data: CreateRideDTOType) {
    return await this.rideRepository.save(data);
  }

  async getRideHistory(customerId: string, driverId?: string) {
    return await this.rideRepository.findByCustomerAndDriver(
      customerId,
      driverId
    );
  }

  private async getAvailableDrivers(distance: number) {
    const drivers: IDriver[] = await Driver.find({
      minKm: { $lte: distance / 1000 },
    });

    const availableDrivers = drivers.map((driver) => ({
      id: driver._id as number,
      name: driver.name,
      vehicle: driver.vehicle,
      value: (distance / 1000) * driver.ratePerKm,
      description: driver.description,
      rating: driver.rating,
      review: {
        rating: driver.rating,
        comment: '',
      },
    }));

    availableDrivers.sort((a, b) => a.value - b.value);

    return availableDrivers;
  }
}
