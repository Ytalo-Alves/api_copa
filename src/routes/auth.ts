import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";


export async function authRoutes(fastify: FastifyInstance){
  fastify.get('/me', {onRequest: [authenticate]}, async (request) => {
    console.log({user: request.user})
    return { user: request.user}
  })

  fastify.post('/users', async (request) => {
    const createUserBody = z.object({
      access_token: z.string(),
    })
    
    const { access_token } = createUserBody.parse(request.body)

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userData = await userResponse.json()

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url()
    })

    const userInfo = userInfoSchema.parse(userData)

    // VALIDANDO SE O USUÁRIO EXISTE.

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id
      }
    })

    // CASO O USUÁRIO NÃO EXISTA VAMOS CRIAR ELE NO BANCO DE DADOS.
    if(!user){
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatarUrl: userInfo.picture,
        }
      })
    }

    // CRIANDO O TOKEN

    const token = fastify.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl,
    }, {
      sub: user.id,
      expiresIn: '7 days',
    })

    return { token }
  })
}