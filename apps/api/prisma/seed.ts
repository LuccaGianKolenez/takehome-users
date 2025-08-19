import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = [
    { name: 'Lucca A', email: 'luccaA@email.com' },
    { name: 'Lucca B', email: 'luccaB@email.com' },
  ];
  for (const u of users) {
    await prisma.user.upsert({ where: { email: u.email }, update: {}, create: u });
  }
}
main().finally(()=>prisma.$disconnect());
