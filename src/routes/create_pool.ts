import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import ShortUniqueId from "short-unique-id";
import { authenticate } from "../plugins/authenticate";

export async function createPool(fastify: FastifyInstance) {
  const poolSchema = z.object({
    title: z.string().min(4, "O título deve ter pelo menos 4 caracteres."),
  });

  fastify.post("/pools", async (request, reply) => {
    const { title } = poolSchema.parse(request.body);

    const generate = new ShortUniqueId({ length: 6 });
    const code = generate.randomUUID().toUpperCase();

    try {
      await request.jwtVerify();

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,
          participants: {
            create: {
              userId: request.user.sub,
            },
          },
        },
      });
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code,
        },
      });
    }

    return reply.status(201).send({ code });
  });

  fastify.post(
    "/pools/join",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const joinPoolBody = z.object({
        code: z.string(),
      });
      const { code } = joinPoolBody.parse(request.body);

      const pool = await prisma.pool.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub,
            },
          },
        },
      });

      if (!pool) {
        return reply.status(404).send({ message: "Pool not found" });
      }

      if (pool.participants.length > 0) {
        return reply
          .status(409)
          .send({ message: "You already joined this pool" });
      }

      if (!pool.ownerId) {
        await prisma.pool.update({
          where: {
            id: pool.id,
          },
          data: {
            ownerId: request.user.sub,
          },
        });
      }

      await prisma.participant.create({
        data: {
          poolId: pool.id,
          userId: request.user.sub,
        },
      });

      return reply.status(201).send();
    }
  );

  fastify.get(
    "/pools",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const pools = await prisma.pool.findMany({
        where: {
          participants: {
            some: {
              userId: request.user.sub,
            },
          },
        },
        include: {
          _count: {
            select: {
              participants: true,
            },
          },
          participants: {
            select: {
              id: true,

              user: {
                select: {
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { created_at: "asc" },
      });

      console.log(pools);
      return { pools };
    }
  );

  fastify.get('/pools/:id', {onRequest: [authenticate]}, async (request)=> {
    const getPoolParams = z.object({
      id: z.string(),
    })

    const { id } = getPoolParams.parse(request.params)

    const pool = await prisma.pool.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              },
            },
          },
          take: 4,
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { pool }
  })
}
