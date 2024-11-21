import { z } from 'zod';

export const DriverInfoHistoryDTO = z.object({
  id: z.number(),
  name: z.string(),
});

export const RideHistoryDTO = z.object({
  customer_id: z.string(),
  origin: z.string(),
  destination: z.string(),
  distance: z.number(),
  duration: z.string(),
  value: z.number(),
  driver: DriverInfoHistoryDTO,
});

export type RideHistoryDTOType = z.infer<typeof RideHistoryDTO>;
