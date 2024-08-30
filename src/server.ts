import Fastify from "fastify";
import { createPool } from "./routes/create_pool";
import { countPool } from "./routes/count_pool";
import cors from '@fastify/cors';
import { countUser } from "./routes/count_user";
import { countGuess } from "./routes/count_Guess";

const app = Fastify();

app.register(cors, {
  origin: '*'
});

app.register(createPool)
app.register(countPool)
app.register(countUser)
app.register(countGuess)

const PORT = 3333;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on ${PORT}`);
});
