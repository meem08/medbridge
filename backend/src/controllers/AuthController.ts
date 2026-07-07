import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginSchema, SignUpSchema } from '../dtos/auth.dto';
import { sendResponse } from '../utils/response';

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response) => {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendResponse(res, 400, false, 'Validation failed', parsed.error.format());
      }

      const result = await this.authService.login(parsed.data);
      return sendResponse(res, 200, true, 'Login successful', result);
    } catch (err: any) {
      return sendResponse(res, 401, false, err.message);
    }
  };

  signup = async (req: Request, res: Response) => {
    try {
      const parsed = SignUpSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendResponse(res, 400, false, 'Validation failed', parsed.error.format());
      }

      const result = await this.authService.register(parsed.data);
      return sendResponse(res, 201, true, 'User registered successfully', {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
      });
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.authService.getProfile(id);
      if (!user) {
        return sendResponse(res, 404, false, 'User profile not found');
      }
      return sendResponse(res, 200, true, 'Profile retrieved successfully', user);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  };
}
