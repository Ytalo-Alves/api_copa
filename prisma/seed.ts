import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'john Doe',
      email: 'john.doe@example.com',
      avatarUrl: 'https://github.com/Ytalo-Alves.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Bolão do Mambo',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.201Z',
      firstTeamCountryCode: 'BR',
      secondsTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints:4,
          secondTeamPoints:1,

          participant: {
            connect: {
              userId_poolId:{
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-04T12:00:00.201Z',
      firstTeamCountryCode: 'DE',
      secondsTeamCountryCode: 'US'
    }
  })
}

main()