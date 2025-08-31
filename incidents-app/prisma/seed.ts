const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
    },
  });

  const fleetManager = await prisma.user.create({
    data: {
      name: "Fleet Manager",
      email: "manager@example.com",
      role: "FLEET_MANAGER",
    },
  });

  const driver = await prisma.user.create({
    data: {
      name: "John Driver",
      email: "driver@example.com",
      role: "DRIVER",
    },
  });

  // Create Cars
  const car1 = await prisma.car.create({
    data: {
      regNumber: "AB123CD",
      model: "Model S",
      make: "Tesla",
      year: 2022,
    },
  });

  const car2 = await prisma.car.create({
    data: {
      regNumber: "XY987ZT",
      model: "Civic",
      make: "Honda",
      year: 2021,
    },
  });

  console.log({ admin, fleetManager, driver, car1, car2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
