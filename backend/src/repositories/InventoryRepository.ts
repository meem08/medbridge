import prisma from '../utils/db';

export class InventoryRepository {
  async findAll() {
    return prisma.inventoryItem.findMany();
  }

  async findByBloodType(bloodType: string) {
    return prisma.inventoryItem.findUnique({
      where: { bloodType },
    });
  }

  async updateUnits(bloodType: string, units: number) {
    return prisma.inventoryItem.update({
      where: { bloodType },
      data: { units },
    });
  }
}
