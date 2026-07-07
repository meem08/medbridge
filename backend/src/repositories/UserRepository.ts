import prisma from '../utils/db';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        donations: true,
        appointments: true,
      },
    });
  }

  async create(userData: {
    email: string;
    passwordHash: string;
    role: string;
    name: string;
    location?: string;
    contactNumber?: string;
    bloodType?: string;
    dateOfBirth?: string;
  }) {
    return prisma.user.create({
      data: userData,
    });
  }

  async update(id: string, updateData: any) {
    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
}
