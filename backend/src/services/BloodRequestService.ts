import { BloodRequestRepository } from '../repositories/BloodRequestRepository';
import { CreateRequestDto } from '../dtos/request.dto';

export class BloodRequestService {
  private requestRepository = new BloodRequestRepository();

  async createRequest(data: CreateRequestDto) {
    const id = 'REQ-' + Math.floor(Math.random() * 10000);
    return this.requestRepository.create({
      id,
      bloodType: data.bloodType,
      units: data.units,
      hospitalName: data.hospitalName,
      location: data.location,
      urgency: data.urgency,
      status: 'pending',
    });
  }

  async getAllRequests() {
    return this.requestRepository.findAll();
  }

  async updateStatus(id: string, status: string, eta?: string, explanation?: string) {
    return this.requestRepository.update(id, {
      status,
      eta,
      explanation,
    });
  }
}
