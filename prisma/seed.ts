import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function createRandomArticle(): Prisma.ArticleCreateInput {
  return {
    title: faker.lorem.slug(),
    body: faker.lorem.paragraph(),
    published: randomBool(),
  };
}

function randomBool(): boolean {
  return 0.5 > Math.random();
}

async function main() {
  await prisma.article.deleteMany({});
  await prisma.audit.deleteMany({});

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < 50; i++) {
      const article = await prisma.article.create({
        data: createRandomArticle(),
      });

      await prisma.audit.create({
        data: {
          tableName: "Article",
          recordId: article.id,
          action: "Create",
        },
      });
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
