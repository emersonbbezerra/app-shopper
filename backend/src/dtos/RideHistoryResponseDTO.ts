import { z } from 'zod';

export const RideHistoryResponseDTO = z.object({
  customer_id: z.string(),
  rides: z.array(
    z.object({
      id: z.string(),
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
    })
  ),
});

export type RideHistoryResponseDTOType = z.infer<typeof RideHistoryResponseDTO>;
