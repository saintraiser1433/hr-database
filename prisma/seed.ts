import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create 50 random examinees
  const numberOfUsers = 30

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


  const numberOfDEPARTMENT = 30

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


  const numberofApplicants = 30

  for (let i = 0; i < numberofApplicants; i++) {
    const fname = faker.person.firstName()
    const lname = faker.person.lastName()
    const mname = faker.person.middleName()
    const email = faker.internet.email()
    const contact_number = faker.phone.number()
    const resume = faker.word.sample()
    // Generate a simple password (in production, you'd want stronger passwords)
    // const plainPassword = 'Password123!'
    // const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

    await prisma.applicant.create({
      data: {
        jobApply: { connect: { id: 1 } },
        information: {
          create: {
            first_name: fname,
            middle_name: mname,
            last_name: lname,
            email: email,
            contact_number: contact_number,
            resume_path: resume
          }
        }
      }
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