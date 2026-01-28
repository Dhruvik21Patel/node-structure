// prisma/seeders/01-users.seeder.ts
import { PrismaClient } from "@prisma/client";
import { USERS } from "../data/users.data";
import { hashPassword } from "../utils/hash.util";

export async function seedUsers(prisma: PrismaClient) {
  console.log("👤 Seeding users...");
  for (const user of USERS) {
    const hashedPassword = await hashPassword(user.password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password: hashedPassword,
      },
    });
  }

  console.log(`  ✓ Created ${USERS.length} users (password: password123)
`);
}
