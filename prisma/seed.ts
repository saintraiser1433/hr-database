import { ModeStatus, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create 50 random examinees
  // const numberOfUsers = 30

  // for (let i = 0; i < numberOfUsers; i++) {
  //   const firstName = faker.person.firstName()
  //   const lastName = faker.person.lastName()
  //   const middleName = faker.person.firstName() // Using firstName generator for middle name
  //   const username = faker.internet.username({ firstName, lastName })

  // Generate a simple password (in production, you'd want stronger passwords)
  // const plainPassword = 'Password123!'
  // const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

  //   await prisma.requirements.upsert({
  //     where: {
  //       title: username,
  //     },
  //     update: {}, // Empty update means it won't update if the user exists
  //     create: {
  //       title: username,
  //       description: lastName,
  //     },
  //   })
  // }

  // const numberOfDEPARTMENT = 30

  // for (let i = 0; i < numberOfDEPARTMENT; i++) {
  //   const name = faker.person.fullName() // Using firstName generator for middle name

  //   // Generate a simple password (in production, you'd want stronger passwords)
  //   // const plainPassword = 'Password123!'
  //   // const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

  //   await prisma.departments.upsert({
  //     where: {
  //       title: name,
  //     },
  //     update: {}, // Empty update means it won't update if the user exists
  //     create: {
  //       title: name,
  //     },
  //   })
  // }

  const numberofApplicants = 30;
  const d = ["1.pdf", "2.pdf"];
  const avatarArr = ["profile.png", "profile2.jpg"];
  for (let i = 0; i < numberofApplicants; i++) {
    const fname = faker.person.firstName();
    const lname = faker.person.lastName();
    const mname = faker.person.middleName();
    const email = faker.internet.email();
    const contact_number = faker.phone.number();
    const resume = faker.helpers.arrayElement(d);
    const avatar = faker.helpers.arrayElement(avatarArr);
    // const resume = faker.word.sample()
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
            resume_path: resume,
            photo_path: avatar,
          },
        },
      },
    });
  }
}

const peerCategories = [
  {
    evaluationId: 1,
    percentage: 0.40,
    name:'Professional Behavior and Job Performance Factors'
  },
  {
    evaluationId: 1,
    percentage: 0.30,
    name:'Communication Skills'
  },
  {
    evaluationId: 1,
    percentage: 0.30,
    name:'Core Values'
  },
]

const peerQuestion = [
  {
    peerId: 1,
    question: 'Demonstrates the values and behavior enshrined in the Philippines Professional Standards for Teachers.'
  },
  {
    peerId: 1,
    question: 'Possesses required skills, knowledge, and abilities to competently perform the job.'
  },
  {
    peerId: 1,
    question: 'Exhibits character and integrity consistent with the institution’s core values.'
  },
  {
    peerId: 1,
    question: 'Exhibits tact and sincerity when working with others to achieve objectives.'
  },
  {
    peerId: 1,
    question: 'Conscientious effort in performing work in a productive and timely manner, with high commitment to work time frames/schedules.'
  },
  {
    peerId: 1,
    question: 'Written and oral communications are clear, organized, and effective; listens and comprehends well.'
  },
  {
    peerId: 1,
    question: 'Makes thoughtful, well-reasoned decisions; exercises good judgment, resourcefulness, and creativity in problem-solving.'
  },
  {
    peerId: 1,
    question: 'Shows confidence, respect, and firmness in decision-making; open to suggestions and recommendations from subordinates.'
  },
  {
    peerId: 2,
    question: 'Interacts with other departments/units to achieve company goals.'
  },
  {
    peerId: 2,
    question: 'Verbalizes clear ideas, facts, problems, and solutions.'
  },
  {
    peerId: 2,
    question: 'Maintains a positive relationship with all students and shows sensitivity toward individual students.'
  },
  {
    peerId: 2,
    question: 'Instructor’s spoken and written language is clear and accurate. Displays good listening skills.'
  },
  {
    peerId: 2,
    question: 'Models respect for diversity within the school community.'
  },
  {
    peerId: 3,
    question: 'Reports for work on time, provides advance notice of need for absence.'
  },
  {
    peerId: 3,
    question: 'Upholds character traits and work ethics including sound judgment, honesty, dependability, and loyalty to the corporation’s mission.'
  },
  {
    peerId: 3,
    question: 'Accepts work responsibilities easily and positively. Accepts constructive criticism and suggestions.'
  },
  {
    peerId: 3,
    question: 'Displays appropriate hygiene/attire; displays a positive attitude; accepts constructive criticism and recommendations and implements suggestions.'
  },
]

const evaluationList = [
  {
    school_year: "2020-2021",
    semester: 1,
    status: ModeStatus.ONGOING,
    teamLeadTemplateId: 2,
  },
  {
    school_year: "2020-2021",
    semester: 2,
    status: ModeStatus.NOT_SET,
    teamLeadTemplateId: 2,
  },
  {
    school_year: "2021-2022",
    semester: 1,
    status: ModeStatus.NOT_SET,
    teamLeadTemplateId: 2,
  },
  {
    school_year: "2021-2022",
    semester: 2,
    status: ModeStatus.NOT_SET,
    teamLeadTemplateId: 2,
  },
];

const teamLeadEvaluationList = [
  {
    name: "Percentage",
    percentage: 0.4,
    evaluationId: 1,
    forTeamLead: true,
  },
  {
    name: "Performance Mode",
    percentage: 0.3,
    evaluationId: 1,
    forTeamLead: false,
  },
  {
    name: "Employee Soft Skills",
    percentage: 0.3,
    evaluationId: 1,
    forTeamLead: false,
  },
];

const teamLeadCriteria = [
  {
    name: "Quality of Work",
    teamLeadEvaluationId: 2,
  },
  {
    name: "Attendance/Punctuality",
    teamLeadEvaluationId: 2,
  },
  {
    name: "Interpersonal Relationship",
    teamLeadEvaluationId: 3,
  },
  {
    name: "Attitudes Towards Work",
    teamLeadEvaluationId: 3,
  },
];

const question = [
  {
    question: 'Works Thoroughly & Accurately',
    teamLeadCriteriaId:1,
  },
  {
    question: 'Follows Instructions',
    teamLeadCriteriaId:1,
  },
  {
    question: 'Shows Initiative',
    teamLeadCriteriaId:1,
  },
  {
    question: 'Works with Minimal Supervision',
    teamLeadCriteriaId:1,
  },
  {
    question: 'Finishes Assigned Tasks as Scheduled',
    teamLeadCriteriaId:1,
  },
  {
    question: 'Willing to Perform Extra Assignments',
    teamLeadCriteriaId:1,
  },

  
  {
    question: 'Reports to Work on Time',
    teamLeadCriteriaId:2,
  },
  {
    question: 'Seldom Incur Tardiness',
    teamLeadCriteriaId:2,
  },
  {
    question: 'Seldom Incur Absences',
    teamLeadCriteriaId:2,
  },
  {
    question: 'Attends Company Activities',
    teamLeadCriteriaId:2,
  },

  {
    question: 'Maintains Harmonious Relationship with Colleagues',
    teamLeadCriteriaId:3,
  },
  {
    question: 'Tolerates Individual Differences',
    teamLeadCriteriaId:3,
  },
  {
    question: 'Relates well with Colleagues',
    teamLeadCriteriaId:3,
  },


  {
    question: 'Maintains Healthy Disposition While doing Office Duties',
    teamLeadCriteriaId:4,
  },
  {
    question: 'Shows Loyalty to the Company',
    teamLeadCriteriaId:4,
  },
  {
    question: 'Shows Dedication to the Job',
    teamLeadCriteriaId:4,
  },
  {
    question: 'Reports to Work in Appropriate Attire',
    teamLeadCriteriaId:4,
  },
  {
    question: 'Speaks and Behaves According to Disciplined Standards of Propriety',
    teamLeadCriteriaId:4,
  },
  {
    question: 'Maintains Composure at All Times',
    teamLeadCriteriaId:4,
  },

  



  {
    question: 'How did you meet your spouse/partner?',
    assignTaskCriteriaId:1,
  },
  {
    question: 'How did you know they were “the one”?',
    assignTaskCriteriaId:1,
  },
  {
    question: 'How did you propose?',
    assignTaskCriteriaId:1,
  },



]

const assignTaskCriteria = [
  {
    employeesId: 4,
    teamLeadEvaluationId: 1,
    name: 'Marriage & Partnerships',
  },

]

//CREATE PEER
await prisma.peer.createMany({
  data: peerCategories,
});
await prisma.question.createMany({
  data: peerQuestion,
}); 

//END


//CREATE EVALUATION
await prisma.evaluation.createMany({
  data: evaluationList,
});

await prisma.teamLeadEvaluation.createMany({
  data: teamLeadEvaluationList,
});

await prisma.teamLeadCriteria.createMany({
  data: teamLeadCriteria,
});

await prisma.teamLeadAssignTaskCriteria.createMany({
  data: assignTaskCriteria
})

await prisma.question.createMany({
  data:question
})


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
