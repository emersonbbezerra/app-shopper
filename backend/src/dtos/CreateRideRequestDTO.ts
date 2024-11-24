import { z } from 'zod';

export const CreateRideRequestDTO = z
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
    distance: z.number().positive(),
    duration: z.string().min(1),
    driver: z.object({
      id: z.number().positive(),
      name: z.string().min(1),
    }),
    value: z.number().positive(),
  })
  .superRefine(({ origin, destination }, ctx) => {
    if (origin === destination) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destination'],
        message: 'Os endereços de Origem e Destino não podem ser iguais.',
      });
    }
  });

export type CreateRideRequestDTOType = z.infer<typeof CreateRideRequestDTO>;
