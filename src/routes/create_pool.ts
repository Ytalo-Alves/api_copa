import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function createPool(app: FastifyInstance) {
  // Definindo o schema de validação para os dados da requisição
  const poolSchema = z.object({
    title: z.string().min(4, "O título deve ter pelo menos 4 caracteres."),
    code: z.string().min(6, "O código deve ter pelo menos 6 caracteres."),
  });

  // Rota POST para criar um pool
  app.post('/pools', async (request, reply) => {
    try {
      // Validação dos dados da requisição
      const { title, code} = poolSchema.parse(request.body);

      // Criar pool no banco de dados usando Prisma
      const pool = await prisma.pool.create({
        data: {
          title,
          code
        }
      });

      // Retornar o pool criado
      return reply.status(201).send({ pool });
      
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