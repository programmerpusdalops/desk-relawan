const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/password');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Dimulai proses seeding database...');

  // 1. Setup Admin Account
  const adminEmail = 'admin@bpbd.go.id';
  const adminPassword = await hashPassword('admin123');

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // Biarkan jika sudah ada
    create: {
      email: adminEmail,
      password: adminPassword,
      nama: 'Admin BPBD',
      role: 'admin',
      status: 'active', // Admin defaults to active
    },
  });

  console.log(`✅ ${adminUser.role} dibuat dengan email: ${adminUser.email}`);

  // 2. Setup Operator Account
  const operatorEmail = 'operator@bpbd.go.id';
  const operatorPassword = await hashPassword('operator123');

  const operatorUser = await prisma.user.upsert({
    where: { email: operatorEmail },
    update: {},
    create: {
      email: operatorEmail,
      password: operatorPassword,
      nama: 'Operator Desk',
      role: 'operator',
      status: 'active', // Operator defaults to active
    },
  });

  console.log(`✅ ${operatorUser.role} dibuat dengan email: ${operatorUser.email}`);

  console.log('🎉 Seeding Selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Gagal melakukan seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
