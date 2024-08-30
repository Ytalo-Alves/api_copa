import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function countGuess(app: FastifyInstance){
  app.get('/guesses/count', async (request) => {
    const count = await prisma.guess.count()
    return { count }
  }
)}