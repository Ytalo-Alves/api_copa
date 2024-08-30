import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function countUser(app: FastifyInstance){
  app.get('/users/count', async (request) => {
    const [userCount, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany(),
    ])
    return {
      userCount,
      users,
    }
  }
)}