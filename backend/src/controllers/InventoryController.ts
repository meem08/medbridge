import { Request, Response } from 'express';
import { InventoryRepository } from '../repositories/InventoryRepository';
import { sendResponse } from '../utils/response';

export class InventoryController {
  private inventoryRepository = new InventoryRepository();

  getAll = async (req: Request, res: Response) => {
    try {
      const inventory = await this.inventoryRepository.findAll();
      return sendResponse(res, 200, true, 'Inventory items retrieved successfully', inventory);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  };

  updateStock = async (req: Request, res: Response) => {
    try {
      const { bloodType, units } = req.body;
      if (!bloodType || units === undefined) {
        return sendResponse(res, 400, false, 'bloodType and units are required');
      }

      const result = await this.inventoryRepository.updateUnits(bloodType, units);
      return sendResponse(res, 200, true, 'Inventory updated successfully', result);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  };
}
