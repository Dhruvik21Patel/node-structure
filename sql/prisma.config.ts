// prisma.config.ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',

  datasource: {
    url: process.env.DATABASE_URL!,
  },

  migrations: {
    seed: 'tsx --tsconfig prisma/tsconfig.json prisma/seed.ts',
  },
});
