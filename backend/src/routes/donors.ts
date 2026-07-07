import { Router } from 'express';
import { DonorController } from '../controllers/DonorController';

const router = Router();
const controller = new DonorController();

router.get('/history/:id', controller.getDonationHistory);
router.get('/appointments/:id', controller.getAppointments);
router.post('/appointments', controller.bookAppointment);

export default router;
