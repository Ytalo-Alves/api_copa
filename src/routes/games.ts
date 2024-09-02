import { FastifyInstance } from "fastify"
import { authenticate } from "../plugins/authenticate"
import { z } from "zod"
import { prisma } from "../lib/prisma"

export async function Games(fastify: FastifyInstance){
fastify.get('/pools/:id/games',{onRequest: [authenticate]}, async (request) => {
    const getPoolGames = z.object({
      id: z.string(),
    })
  
    const { id } = getPoolGames.parse(request.params)
  
    const games = await prisma.game.findMany({
      orderBy: {
        date: 'desc'
      }
    })
  
    return { games }
  })
}

