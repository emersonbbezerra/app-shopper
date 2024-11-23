import { CreateRideDTOType } from '../dtos/CreateRideDTO';
import { EstimateRideRequestDTOType } from '../dtos/EstimateRideRequestDTO';
import {
  EstimateRideResponseDTO,
  EstimateRideResponseDTOType,
} from '../dtos/EstimateRideResponseDTO';
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

  async estimateRide(
    data: EstimateRideRequestDTOType
  ): Promise<EstimateRideResponseDTOType> {
    const { origin, destination } = data;
    const route = await this.googleMapsService.calculateRoute(
      origin,
      destination
    );

    const availableDrivers = await this.getAvailableDrivers(route.distance);

    return EstimateRideResponseDTO.parse({
      origin: {
        latitude: route.origin.latitude,
        longitude: route.origin.longitude,
      },
      destination: {
        latitude: route.destination.latitude,
        longitude: route.destination.longitude,
      },
      distance: route.distance / 1000,
      duration: route.duration,
      options: availableDrivers.map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: {
          rating: driver.rating,
          comment: '',
        },
        value: (route.distance / 1000) * driver.ratePerKm,
      })),
      routeResponse: route,
    });
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
      ratePerKm: driver.ratePerKm,
      minKm: driver.minKm,
      createdAt: driver.createdAt,
      review: {
        rating: driver.rating,
        comment: '',
      },
    }));

    availableDrivers.sort((a, b) => a.value - b.value);

    return availableDrivers;
  }
}
