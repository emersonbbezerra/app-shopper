import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ConfirmRideResponseDTOType } from '../dtos/ConfirmRideResponseDTO';
import { CreateRideRequestDTO } from '../dtos/CreateRideRequestDTO';
import { EstimateRideRequestDTO } from '../dtos/EstimateRideRequestDTO';
import { EstimateRideResponseDTOType } from '../dtos/EstimateRideResponseDTO';
import { RideHistoryResponseDTOType } from '../dtos/RideHistoryResponseDTO';
import { RideRepository } from '../repositories/RideRepository';
import { RideService } from '../services/RideService';
import { GoogleMapsService } from '../utils/GoogleMapsService';

const rideRepository = new RideRepository();
const googleMapsService = new GoogleMapsService();
const rideService = new RideService(rideRepository, googleMapsService);

export class RideController {
  static async estimateRide(req: Request, res: Response) {
    try {
      const data = EstimateRideRequestDTO.parse(req.body);
      const routeDetails = await googleMapsService.calculateRoute(
        data.origin,
        data.destination
      );

      const availableDrivers = await rideService.estimateAvailableDrivers(
        routeDetails.distance
      );

      const result: EstimateRideResponseDTOType = {
        origin: {
          latitude: routeDetails.origin.latitude,
          longitude: routeDetails.origin.longitude,
        },
        destination: {
          latitude: routeDetails.destination.latitude,
          longitude: routeDetails.destination.longitude,
        },
        distance: routeDetails.distance / 1000,
        duration: routeDetails.duration,
        options: availableDrivers.map((driver) => ({
          id: driver.id,
          name: driver.name,
          description: driver.description,
          vehicle: driver.vehicle,
          review: {
            rating: driver.review.rating,
            comment: driver.review.comment,
          },
          value: (routeDetails.distance / 1000) * driver.ratePerKm,
        })),
        routeResponse: routeDetails,
      };

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description:
            'Os dados fornecidos no corpo da requisição são inválidos',
        });
      } else {
        res.status(500).json({
          error_code: 'UNKNOWN_ERROR',
          error_description: 'Um erro desconhecido ocorreu',
        });
      }
    }
  }

  static async confirmRide(req: Request, res: Response) {
    try {
      const data = CreateRideRequestDTO.parse(req.body);
      await rideService.confirmRide(data);
      const response: ConfirmRideResponseDTOType = {
        success: true,
      };
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description:
            'Os dados fornecidos no corpo da requisição são inválidos',
        });
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
      ) {
        if (error.message === 'Motorista não encontrado') {
          res.status(404).json({
            error_code: 'DRIVER_NOT_FOUND',
            error_description: 'Motorista não encontrado',
          });
        } else if (
          error.message === 'Quilometragem inválida para o motorista'
        ) {
          res.status(406).json({
            error_code: 'INVALID_DISTANCE',
            error_description: 'Quilometragem inválida para o motorista',
          });
        }
      } else {
        res.status(500).json({
          error_code: 'UNKNOWN_ERROR',
          error_description: 'Um erro desconhecido ocorreu',
        });
      }
    }
  }

  static async getRideHistory(req: Request, res: Response) {
    try {
      const customerId = req.params.customer_id;
      const driverId = req.query.driver_id
        ? parseInt(req.query.driver_id.toString(), 10)
        : undefined;

      if (!customerId) {
        return res.status(400).json({
          error_code: 'MISSING_CUSTOMER_ID',
          error_description: 'O ID do usuário é obrigatório.',
        });
      }

      if (driverId !== undefined && isNaN(driverId)) {
        return res.status(400).json({
          error_code: 'INVALID_DRIVER',
          error_description: 'Motorista inválido',
        });
      }

      const rideHistory: RideHistoryResponseDTOType =
        await rideService.getRideHistory(customerId, driverId);
      res.status(200).json(rideHistory);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: error.errors,
        });
      } else if (
        error instanceof Error &&
        error.message === 'Motorista inválido'
      ) {
        res.status(400).json({
          error_code: 'INVALID_DRIVER',
          error_description: 'Motorista inválido',
        });
      } else if (
        error instanceof Error &&
        error.message === 'Nenhuma registro encontrado'
      ) {
        res.status(404).json({
          error_code: 'NO_RIDES_FOUND',
          error_description: 'Nenhum registro encontrado',
        });
      } else {
        res.status(500).json({
          error_code: 'UNKNOWN_ERROR',
          error_description: 'Um erro desconhecido ocorreu.',
        });
      }
    }
  }
}
