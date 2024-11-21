import { z } from 'zod';

export const ConfirmRideResponseDTO = z.object({
  success: z.boolean(),
});

export type ConfirmRideResponseDTOType = z.infer<typeof ConfirmRideResponseDTO>;
