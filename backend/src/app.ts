import cors from 'cors';
import express, { ErrorRequestHandler, Express } from 'express';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app: Express = express();

const allowedOrigins = [
  process.env.FRONTEND_URI && 'http://localhost:3000',
  'http://localhost:80',
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.use(errorHandler as unknown as ErrorRequestHandler);

export default app;
