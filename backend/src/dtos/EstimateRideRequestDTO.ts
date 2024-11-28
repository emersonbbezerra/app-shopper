import { z } from 'zod';

export const EstimateRideRequestDTO = z
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
  })
  .superRefine(({ origin, destination }, ctx) => {
    if (destination === origin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destination'],
        message:
          'Os endereços de origem e destino não podem ser o mesmo endereço',
      });
    }
  });

export type EstimateRideRequestDTOType = z.infer<typeof EstimateRideRequestDTO>;
