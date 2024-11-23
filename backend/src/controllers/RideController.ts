import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { CreateRideDTO } from '../dtos/CreateRideDTO';
import { EstimateRideRequestDTO } from '../dtos/EstimateRideRequestDTO';
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
      const result = await rideService.estimateRide(data);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: error.errors,
        });
      } else {
        res.status(500).json({
          error_code: 'UNKNOWN_ERROR',
          error_description: 'An unknown error occurred',
        });
      }
    }
  }

  static async confirmRide(req: Request, res: Response) {
    try {
      const data = CreateRideDTO.parse(req.body);
      await rideService.confirmRide(data);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: error.errors,
        });
      } else {
        res.status(500).json({
          error_code: 'UNKNOWN_ERROR',
          error_description: 'An unknown error occurred',
        });
      }
    }
  }

  static async getRideHistory(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const { driver_id } = req.query;
      const history = await rideService.getRideHistory(
        customer_id,
        driver_id as string | undefined
      );
      res.status(200).json(history);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: error.errors,
        });
      } else {
        res.status(500).json({
          error_code: 'UNKNOWN_ERROR',
          error_description: 'An unknown error occurred',
        });
      }
    }
  }
}
