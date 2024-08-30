import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import ShortUniqueId from "short-unique-id";

export async function createPool(app: FastifyInstance) {
  // Definindo o schema de validação para os dados da requisição
  const poolSchema = z.object({
    title: z.string().min(4, "O título deve ter pelo menos 4 caracteres."),
  });

  // Rota POST para criar um pool
  app.post('/pools', async (request, reply) => {
    try {
      // Validação dos dados da requisição
      const { title } = poolSchema.parse(request.body);

      const generate = new ShortUniqueId({ length: 6})
      const code = generate.randomUUID().toUpperCase();

      // Criar pool no banco de dados usando Prisma
      const pool = await prisma.pool.create({
        data: {
          title,
          code
        }
      });

      // Retornar o pool criado
      return reply.status(201).send({ code });
      
    } catch (error) {
      // Tratamento de erros
      if (error instanceof z.ZodError) {
        // Erro de validação de entrada
        return reply.status(400).send({ error: error.errors });
      } else {
        // Outros tipos de erros (por exemplo, erro de banco de dados)
        return reply.status(500).send({ error: 'Erro interno do servidor.' });
      }
    }
  });
}