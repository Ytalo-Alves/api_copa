import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function countPool(fastify: FastifyInstance){
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()
    return { count }
  }
)}