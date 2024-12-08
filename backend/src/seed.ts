import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { config } from "dotenv";

config({ path: ".env.local" });

const BATCH_SIZE = 20;
const PASSWORD_HASH =
  "$2b$10$.k/4hq/W0r4kl3IzH82aLupDS1nSnej/1YZCPJUhORvksBcOaU18q";

const prisma = new PrismaClient();

async function clearDatabase() {
  const tables = [
    "push_subscriptions",
    "connection",
    "connection_request",
    "chat",
    "feed",
    "users",
  ];

  await Promise.all(
    tables.map((table) =>
      // @ts-ignore
      prisma[table].deleteMany()
    )
  );
}

async function createUsers(count: number) {
  // First create the specific user
  await prisma.users.create({
    data: {
      username: "gana1234",
      email: "gana1234@example.com",
      password_hash: PASSWORD_HASH,
      full_name: faker.person.fullName(),
      work_history: faker.lorem.paragraphs(2),
      skills: Array.from({ length: 5 }, () => faker.person.jobArea()).join(
        ", "
      ),
      profile_photo_path: "/default-profile-picture.jpg",
      updated_at: new Date(),
    },
  });

  // Then create the rest of random users
  return await prisma.users.createMany({
    data: Array.from({ length: count - 1 }, () => ({
      username: faker.internet.username(),
      email: faker.internet.email(),
      password_hash: PASSWORD_HASH,
      full_name: faker.person.fullName(),
      work_history: faker.lorem.paragraphs(2),
      skills: Array.from({ length: 5 }, () => faker.person.jobArea()).join(
        ", "
      ),
      profile_photo_path: "/default-profile-picture.jpg",
      updated_at: new Date(),
    })),
  });
}

async function createFeeds(users: any[]) {
  const feedData = users.flatMap((user) =>
    Array.from({ length: 5 }, () => ({
      content: faker.lorem.paragraph(),
      user_id: user.id,
      updated_at: faker.date.recent(),
    }))
  );

  await prisma.feed.createMany({ data: feedData });
}

async function createChats(users: any[]) {
  const chatData = Array.from({ length: 50 }, () => {
    const [fromUser, toUser] = faker.helpers.arrayElements(users, 2);
    return {
      from_id: fromUser.id,
      to_id: toUser.id,
      message: faker.lorem.sentence(),
      timestamp: faker.date.recent(),
    };
  });

  await prisma.chat.createMany({ data: chatData });
}

async function createConnections(users: any[]) {
  for (let i = 0; i < users.length; i++) {
    const connections = users
      .slice(i + 1)
      .filter(() => Math.random() > 0.5)
      .map((toUser) => [
        {
          from_id: users[i].id,
          to_id: toUser.id,
          created_at: faker.date.recent(),
        },
        {
          from_id: toUser.id,
          to_id: users[i].id,
          created_at: faker.date.recent(),
        },
      ]);

    await prisma.connection.createMany({
      data: connections.flat(),
      skipDuplicates: true,
    });
  }
}

async function createPushSubscriptions(users: any[]) {
  const subscriptionData = users
    .filter(() => Math.random() > 0.5)
    .map((user) => ({
      endpoint: faker.internet.url(),
      user_id: user.id,
      keys: {
        p256dh: faker.string.alphanumeric(20),
        auth: faker.string.alphanumeric(20),
      },
    }));

  await prisma.push_subscriptions.createMany({ data: subscriptionData });
}

async function main() {
  try {
    await clearDatabase();

    const { count } = await createUsers(BATCH_SIZE);
    const users = await prisma.users.findMany();
    console.log(`Created ${count} users`);

    await Promise.all([
      createFeeds(users),
      createChats(users),
      createConnections(users),
      createPushSubscriptions(users),
    ]);

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
