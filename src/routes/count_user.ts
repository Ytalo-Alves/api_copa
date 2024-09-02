import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function countUser(fastify: FastifyInstance){
  fastify.get('/users/count', async () => {
    const users = await prisma.user.count()
    return {
      users,
    }
  }
)}