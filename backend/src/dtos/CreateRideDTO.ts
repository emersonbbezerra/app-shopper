import { z } from 'zod';

export const DriverInfoDTO = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
});

export const CreateRideDTO = z.object({
  customer_id: z.string().min(1, { message: 'O ID do usuário é obrigatório.' }),
  origin: z.string().min(1, { message: 'O endereço de Origem é obrigatório.' }),
  destination: z
    .string()
    .min(1, { message: 'O endereço de Destino é obrigatório.' }),
  distance: z.number().positive(),
  duration: z.string().min(1),
  driver: DriverInfoDTO,
  value: z.number().positive(),
});

export type CreateRideDTOType = z.infer<typeof CreateRideDTO>;
