import { z } from 'zod';

export const CreateRideRequestDTO = z
  .object({
    customer_id: z
      .string()
      .min(1, { message: 'O id do usuário não pode estar em branco' }),
    origin: z.string().min(1, {
      message:
        'Os endereços de origem e destino recebidos não podem estar em branco',
    }),
    destination: z.string().min(1, {
      message:
        'Os endereços de origem e destino recebidos não podem estar em branco',
    }),
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
        message:
          'Os endereços de origem e destino não podem ser o mesmo endereço',
      });
    }
  });

export type CreateRideRequestDTOType = z.infer<typeof CreateRideRequestDTO>;
