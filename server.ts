import { PrismaClient } from "@prisma/client";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const prisma = new PrismaClient({});

app.get(
  "/articles",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const articles = await prisma.article.findMany({});
      return res.status(200).json(articles);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/articles/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const article = await prisma.article.findUnique({
        where: { id },
      });

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      return res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/articles/audit/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const auditRecords = await prisma.audit.findMany({
        where: { recordId: id, tableName: "Article" },
      });

      if (auditRecords.length == 0) {
        return res.status(404).json({ error: "Article not found" });
      }

      return res.status(200).json(auditRecords);
    } catch (err) {
      next(err);
    }
  }
);

app.patch(
  "/articles/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { title, body, published } = req.body;

      await prisma.$transaction(async (tx) => {
        const article = await prisma.article.update({
          where: { id },
          data: {
            title,
            body,
            published,
          },
        });

        await prisma.audit.create({
          data: {
            tableName: "Article",
            recordId: article.id,
            action: "Update",
          },
        });
        return res.status(201).json(article);
      });
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/articles",
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, body, published } = req.body;

    try {
      await prisma.$transaction(async (tx) => {
        const article = await prisma.article.create({
          data: {
            title,
            body,
            published,
          },
        });

        await prisma.audit.create({
          data: {
            tableName: "Article",
            recordId: article.id,
            action: "Create",
          },
        });
        res.status(201).json(article);
      });
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  "/articles/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    try {
      await prisma.$transaction(async (tx) => {
        const article = await prisma.article.delete({
          where: { id },
        });

        await prisma.audit.create({
          data: {
            tableName: "Article",
            recordId: article.id,
            action: "Delete",
          },
        });
        return res.status(200).json(article);
      });
    } catch (err) {
      next(err);
    }
  }
);

// This is a silly endpoint that will do lots of random things, lol
app.get("/random", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    let articles = await prisma.article.findMany();

    let promises = articles.map(({ id }) =>
      prisma.audit.count({ where: { recordId: id } })
    );

    let results = await Promise.all(promises);
    let r1 = prisma.$executeRaw`SELECT pg_sleep(1);`;
    let r2 = prisma.$executeRaw`SELECT pg_sleep(0.3);`;
    await Promise.allSettled([r1, r2]);

    let p1 = prisma
      .$transaction(
        async (tx) => {
          await tx.$executeRaw`SELECT pg_sleep(0.1);`;
        },
        { timeout: 30000 }
      )
      .catch((err) => {
        console.log("tx err", err);
      });

    let p2 = prisma.article.findMany({});

    await Promise.allSettled([p1, p2]);
    res.status(200).json({ count: results });
  } catch (err) {
    next(err);
  }
});

app.get("/metrics", async (_req, res: Response) => {
  res.set("Content-Type", "text");
  let metrics = await prisma.$metrics.prometheus();
  res.status(200).end(metrics);
});


// error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).end(error.message);
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Express API Server running on: http://localhost:${port}/`);
});
