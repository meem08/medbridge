import prisma from '../utils/db';

export class DonationRepository {
  async findByDonorId(donorId: string) {
    return prisma.donation.findMany({
      where: { donorId },
      orderBy: { date: 'desc' },
    });
  }

  async create(donationData: {
    id: string;
    date: string;
    location: string;
    units: number;
    bp: string;
    hemoglobin: string;
    pulse: string;
    donorId: string;
  }) {
    return prisma.donation.create({
      data: donationData,
    });
  }
}
