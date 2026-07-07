import { Request, Response } from 'express';
import { BloodRequestService } from '../services/BloodRequestService';
import { CreateRequestSchema } from '../dtos/request.dto';
import { sendResponse } from '../utils/response';

export class BloodRequestController {
  private requestService = new BloodRequestService();

  getAll = async (req: Request, res: Response) => {
    try {
      const requests = await this.requestService.getAllRequests();
      return sendResponse(res, 200, true, 'Requests retrieved successfully', requests);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const parsed = CreateRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendResponse(res, 400, false, 'Validation failed', parsed.error.format());
      }

      const result = await this.requestService.createRequest(parsed.data);
      return sendResponse(res, 201, true, 'Blood request dispatch created', result);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, eta, explanation } = req.body;

      if (!status) {
        return sendResponse(res, 400, false, 'Status field is required');
      }

      const result = await this.requestService.updateStatus(id, status, eta, explanation);
      return sendResponse(res, 200, true, 'Request status updated successfully', result);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  };
}
