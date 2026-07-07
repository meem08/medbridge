import prisma from '../utils/db';

export class BloodRequestRepository {
  async findAll() {
    return prisma.bloodRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.bloodRequest.findUnique({
      where: { id },
    });
  }

  async create(requestData: {
    id: string;
    bloodType: string;
    units: number;
    hospitalName: string;
    location: string;
    urgency: string;
    status: string;
    explanation?: string;
  }) {
    return prisma.bloodRequest.create({
      data: requestData,
    });
  }

  async update(id: string, updateData: {
    status?: string;
    eta?: string;
    explanation?: string;
  }) {
    return prisma.bloodRequest.update({
      where: { id },
      data: updateData,
    });
  }
}
