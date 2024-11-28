import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { CreateRideRequestDTO } from '../dtos/CreateRideRequestDTO';
import { EstimateRideRequestDTO } from '../dtos/EstimateRideRequestDTO';
import {
  InvalidDataException,
  InvalidDriverException,
} from '../exceptions/DomainExceptions';
import { RideRepository } from '../repositories/RideRepository';
import { RideService } from '../services/RideService';
import { GoogleMapsService } from '../utils/GoogleMapsService';

const rideRepository = new RideRepository();
const googleMapsService = new GoogleMapsService();
const rideService = new RideService(rideRepository, googleMapsService);

export class RideController {
  static async estimateRide(req: Request, res: Response, next: NextFunction) {
    try {
      const data = EstimateRideRequestDTO.parse(req.body);
      const result = await rideService.estimateRide(data);

      res.status(200).json({
        message: 'Operação realizada com sucesso',
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new InvalidDataException(
            'Os dados fornecidos no corpo da requisição são inválidos',
            error.errors
          )
        );
      } else {
        next(error);
      }
    }
  }

  static async confirmRide(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateRideRequestDTO.parse(req.body);
      await rideService.confirmRide(data);

      res.status(200).json({
        message: 'Operação realizada com sucesso',
        success: true,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new InvalidDataException(
            'Os dados fornecidos no corpo da requisição são inválidos',
            error.errors
          )
        );
      } else {
        next(error);
      }
    }
  }

  static async getRideHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.params.customer_id;
      const driverIdString = req.query.driver_id as string | undefined;
      let driverId: number | undefined;

      if (driverIdString) {
        const isValidDriverId = /^\d+$/.test(driverIdString);
        if (!isValidDriverId) {
          throw new InvalidDriverException();
        }
        driverId = parseInt(driverIdString, 10);
      }

      if (driverId === 0) {
        throw new InvalidDriverException();
      }

      const rideHistory = await rideService.getRideHistory(
        customerId,
        driverId
      );

      res.status(200).json({
        message: 'Operação realizada com sucesso',
        data: rideHistory,
      });
    } catch (error) {
      next(error);
    }
  }
}
