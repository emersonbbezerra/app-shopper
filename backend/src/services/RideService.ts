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
import Ride, { IRide } from '../models/Ride';
import { getNextSequenceValue } from '../utils/getNextSequenceValue';

import {
  BlankFieldException,
  DriverNotFoundException,
  InvalidDataException,
  InvalidDistanceException,
  InvalidDriverException,
  NoRidesFoundException,
  SameAddressException,
} from '../exceptions/DomainExceptions';

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
    this.validateRideRequest(data);

    const { origin, destination } = data;
    const route = await this.googleMapsService.calculateRoute(
      origin,
      destination
    );

    if (!route || !route.origin || !route.destination || !route.distance) {
      throw new InvalidDataException('Erro ao calcular a rota');
    }

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
          rating: driver.review?.rating || 0,
          comment: driver.review?.comment || '',
        },
        value: route.distance ? (route.distance / 1000) * driver.ratePerKm : 0,
      })),
      routeResponse: route.routeResponse,
    });
  }

  async confirmRide(
    data: CreateRideRequestDTOType
  ): Promise<ConfirmRideResponseDTOType> {
    CreateRideRequestDTO.parse(data);

    if (!data.driver.id) {
      throw new InvalidDriverException();
    }

    const driver = await this.rideRepository.findDriverBySomeCriteria(
      data.driver.id,
      data.distance
    );

    if (!driver) {
      throw new DriverNotFoundException();
    }

    if (data.distance < driver.minKm) {
      throw new InvalidDistanceException();
    }

    const rideId = await getNextSequenceValue('rideId');

    const newRide: IRide = new Ride({
      _id: rideId,
      customer_id: data.customer_id,
      origin: data.origin,
      destination: data.destination,
      distance: data.distance,
      duration: data.duration,
      driver: {
        id: driver.id,
        name: driver.name,
      },
      value: data.value,
    });

    await newRide.save();

    return {
      success: true,
    };
  }

  async getRideHistory(
    customerId: string,
    driverId: number | undefined
  ): Promise<RideHistoryResponseDTOType> {
    if (!customerId) {
      throw new BlankFieldException('ID do usuário');
    }

    const rides = await this.rideRepository.findByCustomerAndDriver(
      customerId,
      driverId
    );

    if (rides.length === 0) {
      throw new NoRidesFoundException();
    }

    const rideHistory = {
      customer_id: customerId,
      rides: rides.map((ride) => ({
        id: ride._id,
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

  private validateRideRequest(
    data: EstimateRideRequestDTOType | CreateRideRequestDTOType
  ) {
    if (!data.origin?.trim()) {
      throw new BlankFieldException('origem');
    }
    if (!data.destination?.trim()) {
      throw new BlankFieldException('destino');
    }
    if (!data.customer_id) {
      throw new BlankFieldException('ID do usuário');
    }
    if (data.origin === data.destination) {
      throw new SameAddressException();
    }
  }
}
