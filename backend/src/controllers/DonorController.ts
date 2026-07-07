import { Request, Response } from 'express';
import { DonationRepository } from '../repositories/DonationRepository';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { sendResponse } from '../utils/response';

export class DonorController {
  private donationRepository = new DonationRepository();
  private appointmentRepository = new AppointmentRepository();

  getDonationHistory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const history = await this.donationRepository.findByDonorId(id);
      return sendResponse(res, 200, true, 'Donation history retrieved successfully', history);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  };

  getAppointments = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const appointments = await this.appointmentRepository.findByDonorId(id);
      return sendResponse(res, 200, true, 'Appointments retrieved successfully', appointments);
    } catch (err: any) {
      return sendResponse(res, 500, false, err.message);
    }
  };

  bookAppointment = async (req: Request, res: Response) => {
    try {
      const { date, time, location, donorId } = req.body;
      if (!date || !time || !location || !donorId) {
        return sendResponse(res, 400, false, 'date, time, location, and donorId are required');
      }

      const result = await this.appointmentRepository.create({
        date,
        time,
        location,
        donorId,
      });
      return sendResponse(res, 201, true, 'Appointment booked successfully', result);
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message);
    }
  };
}
