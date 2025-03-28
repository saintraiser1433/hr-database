import { ApplicationStatus, ModeStatus, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const tables = [
    "User",
    "Requirements",
    "Job",
    "Screening",
    "JobScreening",
    "Departments",
    "Employees",
    "EmployeeRequirements",
    "Applicant",
    "ApplicantScreeningResult",
    "ApplicantInformation",
    "EducationBackground",
    "WorkExperience",
    "SkillsExpertise",
    "References",
    "AcademicYear",
    "PeerEvaluation",
    "PeerEvaluationResult",
    "PeerCategory",
    "EvaluationStatus",
    "TeamLeadEvaluation",
    "TeamLeadAssignTaskCriteria",
    "TeamLeadEvaluationResult",
    "TeamLeadCriteria",
    "Question",
    "TemplateHeader",
    "TemplateDetail"
  ];
  
  // Function to reset sequence for each table
  async function resetSequences() {
    for (const table of tables) {
      try {
        // Method 1: Direct sequence reset (works for most cases)
        await prisma.$executeRawUnsafe(
          `ALTER SEQUENCE "${table}_id_seq" RESTART WITH 1`
        );
        console.log(`Reset sequence for table: ${table}`);
        
        // OR Method 2: Using pg_get_serial_sequence (more robust)
        // await prisma.$executeRawUnsafe(
        //   `SELECT setval(pg_get_serial_sequence('${table}', 'id'), 1, false)`
        // );
        
      } catch (error) {
        console.error(`Failed to reset sequence for table ${table}:`, error);
      }
    }
  }
  // Call the function to reset the sequences
  resetSequences();

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

const departments = [
  { title: "College of Criminology" },
  { title: "College of Law" },
  { title: "College of Engineering" },
  { title: "College of Business Administration" },
  { title: "College of Information Technology" },
  { title: "College of Architecture" }
];






const peerCategories = [
  {
    academicYearId: 1,
    percentage: 0.40,
    name: 'Professional Behavior and Job Performance Factors'
  },
  {
    academicYearId: 1,
    percentage: 0.30,
    name: 'Communication Skills'
  },
  {
    academicYearId: 1,
    percentage: 0.30,
    name: 'Core Values'
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
    peerTemplateId: 1,
    teamLeadTemplateId: 2,
  },
  {
    school_year: "2020-2021",
    semester: 2,
    status: ModeStatus.NOT_SET,
    peerTemplateId: 1,
    teamLeadTemplateId: 2,
  },
  {
    school_year: "2021-2022",
    semester: 1,
    status: ModeStatus.NOT_SET,
    peerTemplateId: 1,
    teamLeadTemplateId: 2,
  },
  {
    school_year: "2021-2022",
    semester: 2,
    status: ModeStatus.NOT_SET,
    peerTemplateId: 1,
    teamLeadTemplateId: 2,
  },
];

const teamLeadEvaluationList = [
  {
    name: "Percentage",
    percentage: 0.4,
    academicYearId: 1,
    forTeamLead: true,
  },
  {
    name: "Performance Mode",
    percentage: 0.3,
    academicYearId: 1,
    forTeamLead: false,
  },
  {
    name: "Employee Soft Skills",
    percentage: 0.3,
    academicYearId: 1,
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
    teamLeadCriteriaId: 1,
  },
  {
    question: 'Follows Instructions',
    teamLeadCriteriaId: 1,
  },
  {
    question: 'Shows Initiative',
    teamLeadCriteriaId: 1,
  },
  {
    question: 'Works with Minimal Supervision',
    teamLeadCriteriaId: 1,
  },
  {
    question: 'Finishes Assigned Tasks as Scheduled',
    teamLeadCriteriaId: 1,
  },
  {
    question: 'Willing to Perform Extra Assignments',
    teamLeadCriteriaId: 1,
  },


  {
    question: 'Reports to Work on Time',
    teamLeadCriteriaId: 2,
  },
  {
    question: 'Seldom Incur Tardiness',
    teamLeadCriteriaId: 2,
  },
  {
    question: 'Seldom Incur Absences',
    teamLeadCriteriaId: 2,
  },
  {
    question: 'Attends Company Activities',
    teamLeadCriteriaId: 2,
  },

  {
    question: 'Maintains Harmonious Relationship with Colleagues',
    teamLeadCriteriaId: 3,
  },
  {
    question: 'Tolerates Individual Differences',
    teamLeadCriteriaId: 3,
  },
  {
    question: 'Relates well with Colleagues',
    teamLeadCriteriaId: 3,
  },


  {
    question: 'Maintains Healthy Disposition While doing Office Duties',
    teamLeadCriteriaId: 4,
  },
  {
    question: 'Shows Loyalty to the Company',
    teamLeadCriteriaId: 4,
  },
  {
    question: 'Shows Dedication to the Job',
    teamLeadCriteriaId: 4,
  },
  {
    question: 'Reports to Work in Appropriate Attire',
    teamLeadCriteriaId: 4,
  },
  {
    question: 'Speaks and Behaves According to Disciplined Standards of Propriety',
    teamLeadCriteriaId: 4,
  },
  {
    question: 'Maintains Composure at All Times',
    teamLeadCriteriaId: 4,
  },

  



  // {
  //   question: 'How did you meet your spouse/partner?',
  //   assignTaskCriteriaId: 1,
  // },
  // {
  //   question: 'How did you know they were “the one”?',
  //   assignTaskCriteriaId: 1,
  // },
  // {
  //   question: 'How did you propose?',
  //   assignTaskCriteriaId: 1,
  // },



]


const assignTaskCriteria = [
  {
    employeesId: 4,
    teamLeadEvaluationId: 1,
    name: 'Marriage & Partnerships',
  },

]

const templateHeader = [
  {
    template_name:'Peer to Peer Legend',
    description:'Peer to Peer Legend',
  },
  {
    template_name:'Team Lead Legend',
    description:'Team Lead Legend',
  }
]

const templateDetail = [
  {
    title:'Need improvement',
    description:'Need improvement',
    score:1,
    templateId:1
  },
  {
    title:'Fair',
    description:'Fair',
    score:2,
    templateId:1
  },
  {
    title:'Good',
    description:'Good',
    score:3,
    templateId:1
  },
  {
    title:'Very Good',
    description:'Very Good',
    score:4,
    templateId:1
  },
  {
    title:'Outstanding',
    description:'Outstanding',
    score:5,
    templateId:1
  },

  {
    title:'Fair',
    description:'Fair',
    score:1,
    templateId:2
  },
  {
    title:'Satisfactory',
    description:'Satisfactory',
    score:2,
    templateId:2
  },
  {
    title:'Very Satisfactory',
    description:'Very Satisfactory',
    score:3,
    templateId:2
  },
  {
    title:'Amazing',
    description:'Amazing',
    score:4,
    templateId:2
  },
  {
    title:'Outstanding',
    description:'Outstanding',
    score:5,
    templateId:2
  },
]
/////////////////////////////////
//department
await prisma.departments.createMany({
  data:departments
});


//job
for (let i = 0; i < 6; i++) {
  try {
    // Generate fake data
    const jobTitle = faker.name.jobTitle();
    const jobDescription = faker.lorem.paragraph(); // Changed to paragraph for more realistic description
    const totalAvailable = faker.number.int({ min: 1, max: 20 });
    
    // First check if departments exist and get valid IDs
    const existingDepartments = await prisma.departments.findMany({
      select: { id: true }
    });
    
    if (existingDepartments.length === 0) {
      throw new Error('No departments found in database');
    }
    
    // Get random department from existing ones
    const randomDept = faker.helpers.arrayElement(existingDepartments);
    
    // Create job
    const createdJob = await prisma.job.create({
      data: {
        title: jobTitle,
        description: jobDescription,
        totalAvailable: totalAvailable,
        departmentsId: randomDept.id // Use actual existing department ID
      }
    });

    console.log(`Job ${i + 1} created: ${createdJob.title} (ID: ${createdJob.id})`);
    
  } catch (error) {
    // console.error(`Error creating job ${i + 1}:`, error.message);
    // Optional: break or continue based on your needs
    continue;
  }
}


const numberofApplicants = 120;
const d = ["1.pdf", "2.pdf"];
const status = ["PENDING", "ONGOING","PASSED","REJECTED","FAILED"];
const avatarArr = ["profile.png", "profile2.jpg"];
for (let i = 0; i < numberofApplicants; i++) {
  const fname = faker.person.firstName();
  const lname = faker.person.lastName();
  const mname = faker.person.middleName();
  const email = faker.internet.email();
  const contact_number = faker.phone.number();
  const resume = faker.helpers.arrayElement(d);
  const avatar = faker.helpers.arrayElement(avatarArr);
  const stat = faker.helpers.arrayElement([
    'PENDING', 
    'ONGOING', 
    'PASSED', 
    'REJECTED', 
    'FAILED'
  ] as const) as ApplicationStatus;
  const jobid = faker.number.int({ min: 1, max: 6 });
  // const resume = faker.word.sample()
  // Generate a simple password (in production, you'd want stronger passwords)
  // const plainPassword = 'Password123!'
  // const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

  await prisma.applicant.create({
    data: {
      jobApply: { connect: { id: jobid } },
      status:stat,
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


const numberofEmployee = 150;
const usedUsernames = new Set();
for (let i = 0; i < numberofEmployee; i++) {
  const fname = faker.person.firstName();
  const lname = faker.person.lastName();
  const mname = faker.person.middleName();
  const email = faker.internet.email();
  const contact_number = faker.phone.number();
  const resume = faker.helpers.arrayElement(d);
  const avatar = faker.helpers.arrayElement(avatarArr);
  const jobid = faker.number.int({ min: 1, max: 6 });
  let username;
  do {
    username = `${fname.toLowerCase().charAt(0)}${lname.toLowerCase()}${faker.number.int({ min: 1, max: 999 })}`;
  } while (usedUsernames.has(username));
  
  usedUsernames.add(username);


  await prisma.employees.create({
    data: {
      job: { connect: { id: jobid } },
      department: { connect: { id: jobid } },
      username: username,
      password:'123',
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



//END

await prisma.templateHeader.createMany({
  data:templateHeader
})

await prisma.templateDetail.createMany({
  data:templateDetail
})

//CREATE EVALUATION
await prisma.academicYear.createMany({
  data: evaluationList,
});

// // //CREATE PEER


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
  data: question
})

await prisma.peerCategory.createMany({
  data: peerCategories,
});
await prisma.question.createMany({
  data: peerQuestion,
});

}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
