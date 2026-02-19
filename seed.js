require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  // Upsert Store 2080 (Michigan)
  const store = await prisma.store.upsert({
    where: { storeNumber: "2080" },
    update: {},
    create: {
      storeNumber: "2080",
      state: "MI",
      city: "Battle Creek"
    }
  });

  console.log("Store ready:", store.storeNumber);

  // Upsert Minor Employee (Jake)
  const employee = await prisma.employee.upsert({
    where: { id: 1 }, // safe demo assumption
    update: {},
    create: {
      firstName: "Jake",
      birthdate: new Date("2008-06-15"),
      isMinor: true,
      storeId: store.id
    }
  });

  console.log("Employee ready:", employee.firstName);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
