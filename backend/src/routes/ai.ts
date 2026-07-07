import { Router } from 'express';
import { AIController } from '../controllers/AIController';

const router = Router();
const controller = new AIController();

router.post('/match', controller.match);
router.post('/chat', controller.chat);

export default router;
