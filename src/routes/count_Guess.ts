import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";
import { z } from "zod";

export async function countGuess(fastify: FastifyInstance){
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()
    return { count }
  }
)}