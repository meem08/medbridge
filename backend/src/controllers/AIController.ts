import { Request, Response } from 'express';
import { AIService } from '../services/AIService';
import { sendResponse } from '../utils/response';

export class AIController {
  private aiService = new AIService();

  match = async (req: Request, res: Response) => {
    try {
      const { requestId } = req.body;
      if (!requestId) {
        return sendResponse(res, 400, false, 'requestId is required');
      }

      const matchResult = await this.aiService.matchRequest(requestId);
      return sendResponse(res, 200, true, 'AI matching completed successfully', matchResult);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  };

  chat = async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return sendResponse(res, 400, false, 'message is required');
      }

      const response = await this.aiService.chatCoordinator(message, history || []);
      return sendResponse(res, 200, true, 'AI response generated successfully', { response });
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  };
}
