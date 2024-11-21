import { z } from 'zod';

export const DriverInfoDTO = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
});

export const CreateRideDTO = z.object({
  customer_id: z.string().min(1, { message: 'Customer ID is required' }),
  origin: z.string().min(1, { message: 'Origin is required' }),
  destination: z.string().min(1, { message: 'Destination is required' }),
  distance: z.number().positive(),
  duration: z.string().min(1),
  driver: DriverInfoDTO,
  value: z.number().positive(),
});

export type CreateRideDTOType = z.infer<typeof CreateRideDTO>;
