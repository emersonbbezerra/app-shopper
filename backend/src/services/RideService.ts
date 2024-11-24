import { ConfirmRideResponseDTOType } from '../dtos/ConfirmRideResponseDTO';
import {
  CreateRideRequestDTO,
  CreateRideRequestDTOType,
} from '../dtos/CreateRideRequestDTO';
import { EstimateRideRequestDTOType } from '../dtos/EstimateRideRequestDTO';
import {
  EstimateRideResponseDTO,
  EstimateRideResponseDTOType,
} from '../dtos/EstimateRideResponseDTO';
import {
  RideHistoryResponseDTO,
  RideHistoryResponseDTOType,
} from '../dtos/RideHistoryResponseDTO';
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

    if (!route || !route.origin || !route.destination || !route.distance) {
      throw new Error('Erro ao calcular a rota');
    }

    const availableDrivers = await this.getAvailableDrivers(route.distance!);

    if (route.distance) {
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
            rating: driver.review?.rating || 0,
            comment: driver.review?.comment || '',
          },
          value: route.distance
            ? (route.distance / 1000) * driver.ratePerKm
            : 0,
        })),
        routeResponse: route,
      });
    } else {
      throw new Error('A rota não possui distância definida');
    }
  }

  async confirmRide(
    data: CreateRideRequestDTOType
  ): Promise<ConfirmRideResponseDTOType> {
    CreateRideRequestDTO.parse(data);

    if (!data.driver.id) {
      throw new Error('ID do motorista inválido');
    }

    const driver = await this.rideRepository.findDriverBySomeCriteria(
      data.driver.id,
      data.distance
    );

    if (!driver) {
      throw new Error('Motorista não encontrado');
    }

    if (data.distance < driver.minKm) {
      throw new Error('Quilometragem inválida para o motorista');
    }

    await this.rideRepository.save({
      ...data,
      driver: {
        id: driver.id,
        name: driver.name,
      },
    });

    return {
      success: true,
    };
  }

  async getRideHistory(
    customerId: string,
    driverId: number | undefined
  ): Promise<RideHistoryResponseDTOType> {
    const rides = await this.rideRepository.findByCustomerAndDriver(
      customerId,
      driverId
    );

    if (!driverId) {
      throw new Error('Motorista inválido');
    }

    if (rides.length === 0) {
      throw new Error('Nenhum registro encontrado');
    }

    const rideHistory = {
      customer_id: customerId,
      rides: rides.map((ride) => ({
        id: ride._id.toString(),
        date: ride.createdAt,
        origin: ride.origin,
        destination: ride.destination,
        distance: ride.distance,
        duration: ride.duration,
        driver: {
          id: ride.driver.id,
          name: ride.driver.name,
        },
        value: ride.value,
      })),
    };
    return RideHistoryResponseDTO.parse(rideHistory);
  }

  async estimateAvailableDrivers(distance: number) {
    return await this.getAvailableDrivers(distance);
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
      ratePerKm: driver.ratePerKm,
      minKm: driver.minKm,
      createdAt: driver.createdAt,
      review: {
        rating: driver.review.rating,
        comment: driver.review.comment,
      },
    }));

    availableDrivers.sort((a, b) => a.value - b.value);

    return availableDrivers;
  }
}
