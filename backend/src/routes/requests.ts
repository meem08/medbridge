import { Router } from 'express';
import { BloodRequestController } from '../controllers/BloodRequestController';

const router = Router();
const controller = new BloodRequestController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.updateStatus);

export default router;
