import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const cities = [
  // Мегаполисы
  { name: 'Алматы', type: 'MEGACITY' as const },
  { name: 'Астана', type: 'MEGACITY' as const },
  { name: 'Шымкент', type: 'MEGACITY' as const },
  // Области
  { name: 'Акмолинская область', type: 'OBLAST' as const },
  { name: 'Актюбинская область', type: 'OBLAST' as const },
  { name: 'Алматинская область', type: 'OBLAST' as const },
  { name: 'Атырауская область', type: 'OBLAST' as const },
  { name: 'Восточно-Казахстанская область', type: 'OBLAST' as const },
  { name: 'Жамбылская область', type: 'OBLAST' as const },
  { name: 'Жетысуская область', type: 'OBLAST' as const },
  { name: 'Западно-Казахстанская область', type: 'OBLAST' as const },
  { name: 'Карагандинская область', type: 'OBLAST' as const },
  { name: 'Костанайская область', type: 'OBLAST' as const },
  { name: 'Кызылординская область', type: 'OBLAST' as const },
  { name: 'Мангистауская область', type: 'OBLAST' as const },
  { name: 'Павлодарская область', type: 'OBLAST' as const },
  { name: 'Северо-Казахстанская область', type: 'OBLAST' as const },
  { name: 'Туркестанская область', type: 'OBLAST' as const },
  { name: 'Улытауская область', type: 'OBLAST' as const },
  { name: 'Абайская область', type: 'OBLAST' as const },
];

async function main() {
  console.log('Seeding cities...');

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: city,
    });
  }

  console.log(`✓ Seeded ${cities.length} cities`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
