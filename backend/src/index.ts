import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import routes from '../src/routes/routes';
import { Database } from './config/Database';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const dbInstance = Database.getInstance();

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
async function startServer() {
  try {
    await dbInstance.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/app-shopper'
    );

    app.use(express.urlencoded({ extended: true }));

    app.use('/', routes);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await dbInstance.disconnect();
  process.exit(0);
});
