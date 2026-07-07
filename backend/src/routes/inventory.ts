import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';

const router = Router();
const controller = new InventoryController();

router.get('/', controller.getAll);
router.put('/update', controller.updateStock);

export default router;
