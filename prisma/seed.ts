import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("erindiscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const posts = [
    {
      slug: "my-first-post",
      title: "asdasd post",
      markdown: `# I am a markdown`.trim(),
    },
    {
      slug: "my-second-post",
      title: "2nd post",
      markdown: `# I am a markdown`.trim(),
    },
    {
      slug: "my-third-post",
      title: "3rd post",
      markdown: `## I am a markdown
      #asd
      `.trim(),
    },
    {
      slug: "my-fourth-post",
      title: "4th post",
      markdown: `# I am a markdown`.trim(),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
