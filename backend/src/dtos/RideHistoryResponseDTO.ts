import { z } from 'zod';

export const HistoryRideDTO = z.object({
  id: z.number(),
  date: z.date(),
  origin: z.string(),
  destination: z.string(),
  distance: z.number(),
  duration: z.string(),
  driver: z.object({
    id: z.number(),
    name: z.string(),
  }),
  value: z.number(),
});

export const RideHistoryResponseDTO = z.object({
  customer_id: z.string(),
  rides: z.array(HistoryRideDTO),
});

export type RideHistoryResponseDTOType = z.infer<typeof RideHistoryResponseDTO>;
