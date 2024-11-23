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
      const routeDetails = await googleMapsService.calculateRoute(
        data.origin,
        data.destination
      );

      const availableDrivers = await rideService.estimateAvailableDrivers(
        routeDetails.distance
      );

      const result = {
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
      const confirmedRide = await rideService.confirmRide(data);
      res.status(200).json({ success: true, ride: confirmedRide });
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
    const customerId = req.params.customer_id;
    try {
      const rideHistory = await rideService.getRideHistory(customerId);
      res.status(200).json(rideHistory);
    } catch (error) {
      console.error('Error occurred:', error); // Logando o erro
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
