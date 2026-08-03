import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as argon2 from 'argon2';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const phone = '+998997652928';
  
  const user = await prisma.user.findFirst({ where: { phone } });
  
  if (!user) {
    console.log(`User with phone ${phone} not found. Creating a new one...`);
    const hash = await argon2.hash('Islom15');
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        phone: phone,
        password: hash,
        role: 'SUPERADMIN'
      }
    });
    console.log(`Created user ${phone} with password Islom15 and role SUPERADMIN.`);
  } else {
    const hash = await argon2.hash('Islom15');
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'SUPERADMIN', password: hash }
    });
    console.log(`Updated user ${phone} to SUPERADMIN with new password Islom15.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
