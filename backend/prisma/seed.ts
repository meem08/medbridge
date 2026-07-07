import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean old data
  await prisma.appointment.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create default users
  const passwordHash = hashPassword('password123');

  const donorUser = await prisma.user.create({
    data: {
      email: 'donor@gmail.com',
      passwordHash,
      role: 'donor',
      name: 'Ada Pharaoh',
      bloodType: 'O-',
      dateOfBirth: '1997-05-14',
      contactNumber: '555-0123',
      isEligible: true,
    },
  });

  const hospitalUser = await prisma.user.create({
    data: {
      email: 'hospital@gmail.com',
      passwordHash,
      role: 'hospital',
      name: 'Dr. Li',
      location: 'Central General Hospital, Wing B',
      contactNumber: '555-0188',
    },
  });

  const bloodBankUser = await prisma.user.create({
    data: {
      email: 'admin@lifecare.org',
      passwordHash,
      role: 'bloodbank',
      name: 'LifeCare Blood Bank',
      location: 'Central Depot Area, Block 5',
      contactNumber: '555-0199',
    },
  });

  console.log('Users seeded:', {
    donor: donorUser.email,
    hospital: hospitalUser.email,
    bloodbank: bloodBankUser.email,
  });

  // 3. Create inventory items matching mobile wireframes
  const inventoryItems = [
    { bloodType: 'O+', units: 14, minRequired: 15 }, // low stock
    { bloodType: 'O-', units: 2, minRequired: 5 },   // low stock
    { bloodType: 'A+', units: 8, minRequired: 10 },  // low stock
    { bloodType: 'A-', units: 12, minRequired: 8 },
    { bloodType: 'B+', units: 15, minRequired: 8 },
    { bloodType: 'B-', units: 9, minRequired: 5 },
    { bloodType: 'AB+', units: 25, minRequired: 12 },
    { bloodType: 'AB-', units: 6, minRequired: 4 },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: item,
    });
  }
  console.log('Inventory items seeded.');

  // 4. Create active emergency requests
  const requests = [
    {
      id: 'REQ-1234',
      bloodType: 'O+',
      units: 4,
      hospitalName: 'City General Hospital',
      location: 'Room 302, Wing A',
      urgency: 'urgent',
      status: 'matching',
      explanation: 'Optimal dispatch routed to LifeCare Blood Bank. High O+ compatibility score.',
    },
    {
      id: 'REQ-1233',
      bloodType: 'A+',
      units: 2,
      hospitalName: 'Survive Clinic',
      location: 'Emergency Bay 3',
      urgency: 'routine',
      status: 'reserved',
      eta: '35 mins',
      explanation: 'Matching completed successfully.',
    },
    {
      id: 'REQ-1232',
      bloodType: 'B+',
      units: 3,
      hospitalName: 'Metro Hospital',
      location: 'ICU Unit 4',
      urgency: 'urgent',
      status: 'complete',
      eta: 'Delivered',
      explanation: 'Asset successfully delivered.',
    },
  ];

  for (const req of requests) {
    await prisma.bloodRequest.create({
      data: req,
    });
  }
  console.log('Blood requests seeded.');

  // 5. Create donation history for donor Ada
  await prisma.donation.create({
    data: {
      id: 'DON-5477',
      date: '2026-03-12T10:30:00Z',
      location: 'Central General Hospital',
      units: 1,
      bp: '120/80',
      hemoglobin: '14.5 g/dl',
      pulse: '72 bpm',
      donorId: donorUser.id,
    },
  });

  await prisma.donation.create({
    data: {
      id: 'DON-5476',
      date: '2026-01-02T09:15:00Z',
      location: 'Central General Hospital',
      units: 1,
      bp: '118/76',
      hemoglobin: '14.2 g/dl',
      pulse: '68 bpm',
      donorId: donorUser.id,
    },
  });

  console.log('Donations seeded.');

  // 6. Create active appointment for Ada
  await prisma.appointment.create({
    data: {
      date: '2026-03-20',
      time: '09:30 AM',
      location: 'Central General Hospital Clinic',
      donorId: donorUser.id,
    },
  });

  console.log('Appointments seeded.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
