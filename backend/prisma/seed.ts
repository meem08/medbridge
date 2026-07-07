import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data and seeding clean baseline inventory...');

  // 1. Delete all records
  await prisma.appointment.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.user.deleteMany();

  console.log('All previous database records cleared.');

  // 2. Seed clean inventory with 0 units for all blood types
  const inventoryItems = [
    { bloodType: 'O+', units: 0, minRequired: 15 },
    { bloodType: 'O-', units: 0, minRequired: 10 },
    { bloodType: 'A+', units: 0, minRequired: 15 },
    { bloodType: 'A-', units: 0, minRequired: 10 },
    { bloodType: 'B+', units: 0, minRequired: 10 },
    { bloodType: 'B-', units: 0, minRequired: 8 },
    { bloodType: 'AB+', units: 0, minRequired: 8 },
    { bloodType: 'AB-', units: 0, minRequired: 5 },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: item,
    });
  }

  console.log('Empty baseline inventory created successfully (all types set to 0 units).');
  console.log('Database is now ready for production signups and live data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
