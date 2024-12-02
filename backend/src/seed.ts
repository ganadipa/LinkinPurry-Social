import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});

const prisma = new PrismaClient();

async function main() {
  // Clear database
  // await prisma.push_subscriptions.deleteMany();
  // await prisma.connection.deleteMany();
  // await prisma.connection_request.deleteMany();
  // await prisma.chat.deleteMany();
  // await prisma.feed.deleteMany();
  // await prisma.users.deleteMany();
  // Seed users
  // const users = [];
  // for (let i = 0; i < 20; i++) {
  //   users.push(
  //     await prisma.users.create({
  //       data: {
  //         username: faker.internet.username(),
  //         email: faker.internet.email(),
  //         password_hash: faker.string.alphanumeric(20),
  //         full_name: faker.person.fullName(),
  //         work_history: faker.lorem.sentences(3),
  //         skills: faker.lorem.words(5),
  //         profile_photo_path: faker.image.avatar(),
  //         updated_at: new Date(),
  //       },
  //     })
  //   );
  // }
  // console.log("Seeded users:", users.length);
  // Seed feed
  // for (const user of users) {
  // for (let i = 0; i < 10; i++) {
  //   await prisma.feed.create({
  //     data: {
  //       content: faker.lorem.paragraph(),
  //       user_id: 86,
  //       updated_at: faker.date.recent(),
  //     },
  //   });
  // }
  // // }
  // console.log("Seeded feed.");
  // // Seed chat
  // for (let i = 0; i < 50; i++) {
  //   const fromUser = faker.helpers.arrayElement(users);
  //   const toUser = faker.helpers.arrayElement(
  //     users.filter((u) => u.id !== fromUser.id)
  //   );
  //   await prisma.chat.create({
  //     data: {
  //       from_id: fromUser.id,
  //       to_id: toUser.id,
  //       message: faker.lorem.sentence(),
  //     },
  //   });
  // }
  // console.log("Seeded chat.");
  // // Seed connection requests
  // for (let i = 0; i < 30; i++) {
  //   const fromUser = faker.helpers.arrayElement(users);
  //   const toUser = faker.helpers.arrayElement(
  //     users.filter((u) => u.id !== fromUser.id)
  //   );
  //   try {
  //     const createdAt = faker.date.recent();
  //     await prisma.connection_request.create({
  //       data: {
  //         from_id: fromUser.id,
  //         to_id: toUser.id,
  //         created_at: createdAt,
  //       },
  //     });
  //     await prisma.connection_request.create({
  //       data: {
  //         from_id: toUser.id,
  //         to_id: fromUser.id,
  //         created_at: createdAt,
  //       },
  //     });
  //   } catch (error) {
  //     // Skip if duplicate connection request
  //     continue;
  //   }
  // }
  console.log("Seeded connection requests.");
  // Seed connections
  // for (let i = 0; i < 20; i++) {
  //   const fromUser = faker.helpers.arrayElement(users);
  //   const toUser = faker.helpers.arrayElement(
  //     users.filter((u) => u.id !== fromUser.id)
  //   );
  try {
    await prisma.connection.create({
      data: {
        from_id: 86,
        to_id: 87,
        created_at: faker.date.recent(),
      },
    });

    await prisma.connection.create({
      data: {
        from_id: 87,
        to_id: 86,
        created_at: faker.date.recent(),
      },
    });
  } catch (error) {
    // Skip if duplicate connection
    // continue;
  }
  // }
  // console.log("Seeded connections.");
  // // Seed push subscriptions
  // for (const user of users) {
  //   if (Math.random() > 0.5) {
  //     await prisma.push_subscriptions.create({
  //       data: {
  //         endpoint: faker.internet.url(),
  //         user_id: user.id,
  //         keys: {
  //           p256dh: faker.string.alphanumeric(20),
  //           auth: faker.string.alphanumeric(20),
  //         },
  //       },
  //     });
  //   }
  // }
  // console.log("Seeded push subscriptions.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
