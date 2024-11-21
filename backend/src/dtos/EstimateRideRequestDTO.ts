import { z } from 'zod';

export const EstimateRideRequestDTO = z.object({
  customer_id: z.string().min(1, { message: 'Customer ID is required' }),
  origin: z.string().min(1, { message: 'Origin is required' }),
  destination: z.string().min(1, { message: 'Destination is required' }),
});

export type EstimateRideRequestDTOType = z.infer<typeof EstimateRideRequestDTO>;
