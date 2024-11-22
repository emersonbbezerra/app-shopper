import { z } from 'zod';

export const EstimateRideRequestDTO = z
  .object({
    customer_id: z
      .string()
      .min(1, { message: 'O ID do usuário é obrigatório.' }),
    origin: z
      .string()
      .min(1, { message: 'O endereço de Origem é obrigatório.' }),
    destination: z
      .string()
      .min(1, { message: 'O endereço de Destino é obrigatório.' }),
  })
  .superRefine(({ origin, destination }, ctx) => {
    if (destination === origin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destination'],
        message: 'Os endereços de Origem e Destino não podem ser iguais.',
      });
    }
  });

export type EstimateRideRequestDTOType = z.infer<typeof EstimateRideRequestDTO>;
