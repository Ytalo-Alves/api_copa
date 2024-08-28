import Fastify, { type FastifyInstance } from "fastify";
import { createPool } from "./routes/create_pool";
import { getPools } from "./routes/get_pool";


const app = Fastify();

app.register(createPool)
app.register(getPools)

const PORT = 3333;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on ${PORT}`);
});
