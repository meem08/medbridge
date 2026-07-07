import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.get('/profile/:id', controller.getProfile);

export default router;
