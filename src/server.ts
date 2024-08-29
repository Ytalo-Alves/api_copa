import Fastify from "fastify";
import { createPool } from "./routes/create_pool";
import { getPools } from "./routes/get_pool";
import cors from '@fastify/cors';

const app = Fastify();

app.register(cors, {
  origin: '*'
});

app.register(createPool)
app.register(getPools)

const PORT = 3333;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on ${PORT}`);
});
