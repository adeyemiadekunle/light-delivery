import { PrismaClient } from '@prisma/client';
import {
  buildNigeriaNetworkSeed,
  NIGERIA_LOCAL_GOVERNMENTS_SQL_URL,
  NIGERIA_STATES_SQL_URL,
} from './nigeria-network-source';

const prisma = new PrismaClient();

async function fetchText(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch seed source ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

async function main() {
  const [statesSql, localGovernmentsSql] = await Promise.all([
    fetchText(NIGERIA_STATES_SQL_URL),
    fetchText(NIGERIA_LOCAL_GOVERNMENTS_SQL_URL),
  ]);
  const seed = buildNigeriaNetworkSeed(statesSql, localGovernmentsSql);

  const country = await prisma.country.upsert({
    where: { code: seed.country.code },
    update: { name: seed.country.name },
    create: seed.country,
  });

  let localAreaCount = 0;

  for (const stateSeed of seed.states) {
    const state = await prisma.state.upsert({
      where: {
        countryId_code: {
          countryId: country.id,
          code: stateSeed.code,
        },
      },
      update: { name: stateSeed.name },
      create: {
        countryId: country.id,
        name: stateSeed.name,
        code: stateSeed.code,
      },
    });

    const city = await prisma.city.upsert({
      where: {
        stateId_code: {
          stateId: state.id,
          code: stateSeed.city.code,
        },
      },
      update: { name: stateSeed.city.name },
      create: {
        stateId: state.id,
        name: stateSeed.city.name,
        code: stateSeed.city.code,
      },
    });

    for (const localAreaSeed of stateSeed.localAreas) {
      await prisma.localArea.upsert({
        where: {
          cityId_code: {
            cityId: city.id,
            code: localAreaSeed.code,
          },
        },
        update: { name: localAreaSeed.name },
        create: {
          cityId: city.id,
          name: localAreaSeed.name,
          code: localAreaSeed.code,
        },
      });
      localAreaCount += 1;
    }
  }

  console.log(
    `Seeded ${seed.country.name}: ${seed.states.length} states and ${localAreaCount} local areas.`,
  );
}

void main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
