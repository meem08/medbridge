import prisma from '../utils/db';

export class AppointmentRepository {
  async findByDonorId(donorId: string) {
    return prisma.appointment.findMany({
      where: { donorId },
      orderBy: { date: 'asc' },
    });
  }

  async create(appointmentData: {
    date: string;
    time: string;
    location: string;
    donorId: string;
  }) {
    return prisma.appointment.create({
      data: appointmentData,
    });
  }
}
