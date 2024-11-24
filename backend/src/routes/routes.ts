import { RequestHandler, Router } from 'express';
import { RideController } from '../controllers/RideController';

const router = Router();

router.post('/ride/estimate', RideController.estimateRide);
router.patch('/ride/confirm', RideController.confirmRide);
router.get(
  '/ride/:customer_id',
  RideController.getRideHistory as RequestHandler
);
export default router;
