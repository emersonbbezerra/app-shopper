import { z } from 'zod';

export const EstimateRideResponseDTO = z.object({
  origin: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  destination: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  distance: z.number(),
  duration: z.string(),
  options: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      vehicle: z.string(),
      review: z.object({
        rating: z.number(),
        comment: z.string(),
      }),
      value: z.number(),
    })
  ),
  routeResponse: z.any(),
});

export type EstimateRideResponseDTOType = z.infer<
  typeof EstimateRideResponseDTO
>;
