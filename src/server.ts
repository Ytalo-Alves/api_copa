import Fastify from "fastify";
import { createPool } from "./routes/create_pool";
import { countPool } from "./routes/count_pool";
import cors from '@fastify/cors';
import { countUser } from "./routes/count_user";
import { countGuess } from "./routes/count_Guess";
import { authRoutes } from "./routes/auth";
import jwt from '@fastify/jwt'
import {Games} from "./routes/games";

const fastify = Fastify();

fastify.register(cors, {
  origin: '*'
});

// EM PRODUÇÃO PRECISA SER UMA VARIÁVEL AMBIENTE
fastify.register(jwt, {
  secret: 'nlwcopa',
})

fastify.register(createPool)
fastify.register(countPool)
fastify.register(countUser)
fastify.register(countGuess)
fastify.register(authRoutes)
fastify.register(Games)

const PORT = 3333;

fastify.listen({ port: PORT }).then(() => {
  console.log(`Server is running on ${PORT}`);
});
