import dotenv from 'dotenv';
import app from './app';
import { Database } from './config/Database';

dotenv.config();

const port = process.env.PORT || 8080;
const dbInstance = Database.getInstance();

async function startServer() {
  try {
    await dbInstance.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/app-shopper'
    );

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
