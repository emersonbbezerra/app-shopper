import express, { ErrorRequestHandler, Express } from 'express';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use(errorHandler as unknown as ErrorRequestHandler);

export default app;
