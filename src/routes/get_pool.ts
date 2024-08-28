import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getPools(app: FastifyInstance){
  app.get('/pools/count', async (request) => {
    const count = await prisma.pool.count()
    return { count }
  }
)}