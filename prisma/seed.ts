import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create 50 random examinees
  const numberOfUsers = 500000000

  for (let i = 0; i < numberOfUsers; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const middleName = faker.person.firstName() // Using firstName generator for middle name
    const username = faker.internet.username({ firstName, lastName })

    // Generate a simple password (in production, you'd want stronger passwords)
    // const plainPassword = 'Password123!'
    // const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

    await prisma.requirements.upsert({
      where: {
        title: username,
      },
      update: {}, // Empty update means it won't update if the user exists
      create: {
        title: username,
        description: lastName,
      },
    })
  }


  const numberOfDEPARTMENT = 500

  for (let i = 0; i < numberOfDEPARTMENT; i++) {
    const name = faker.person.fullName() // Using firstName generator for middle name

    // Generate a simple password (in production, you'd want stronger passwords)
    // const plainPassword = 'Password123!'
    // const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

    await prisma.departments.upsert({
      where: {
        title: name,
      },
      update: {}, // Empty update means it won't update if the user exists
      create: {
        title: name,
      },
    })
  }

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })