// import "dotenv/config";
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import {
//   Company,
//   EmploymentType,
//   LocationType,
//   PrismaClient,
//   VacancyType,
//   ApplicationStatus
// } from "../generated/prisma/client";
//
// const connectionString = `${process.env.DATABASE_URL}`;
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });
//
// // Вспомогательные функции
// const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// const getRandomMultiple = <T>(arr: T[], count: number): T[] => {
//   const shuffled = [...arr].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };
// const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
//
// async function main() {
//   console.log("🌱 Starting advanced seeding...");
//
//   // 1. ОЧИСТКА БАЗЫ (с учетом новых связей)
//   await prisma.application.deleteMany();
//   await prisma.vacancy.deleteMany();
//   await prisma.user.deleteMany();
//   await prisma.company.deleteMany();
//   await prisma.skill.deleteMany();
//   await prisma.language.deleteMany();
//   await prisma.domain.deleteMany();
//   await prisma.category.deleteMany();
//
//   // 2. СЛОВАРИ
//   console.log("📚 Seeding dictionaries...");
//   const categoriesData = ["Frontend", "Backend", "Fullstack", "DevOps", "Design", "QA", "Management"];
//   const categories = await Promise.all(
//     categoriesData.map((name) =>
//       prisma.category.create({ data: { name, slug: name.toLowerCase() } })
//     )
//   );
//
//   // Расширенный стек технологий
//   const skillsData = [
//     "React", "Node.js", "TypeScript", "JavaScript", "Prisma", "NestJS",
//     "Next.js", "Redux Toolkit", "Tailwind CSS", "AWS", "Docker", "Figma",
//     "Java", "Spring Boot", "PostgreSQL", "Python", "GraphQL", "WebSockets"
//   ];
//   const skills = await Promise.all(
//     skillsData.map((name) =>
//       prisma.skill.create({ data: { name, slug: name.toLowerCase().replace(/[\.\s]/g, '-') } })
//     )
//   );
//
//   const languages = await Promise.all(
//     ["English", "Ukrainian", "Spanish", "German", "Polish"].map((name) =>
//       prisma.language.create({ data: { name, slug: name.toLowerCase() } })
//     )
//   );
//
//   const domains = await Promise.all(
//     ["Fintech", "EdTech", "E-commerce", "HealthTech", "Web3", "GameDev", "AI/ML"].map((name) =>
//       prisma.domain.create({ data: { name, slug: name.toLowerCase() } })
//     )
//   );
//
//   // 3. КОМПАНИИ И HR (30 штук)
//   console.log("🏢 Seeding companies & HRs...");
//   const companyNames = [
//     "Google", "Meta", "Grammarly", "MacPaw", "Genesis", "SoftServe",
//     "Epam", "Madrigal Electromotive", "Ciklum", "Luxoft", "Vercel", "Stripe"
//   ];
//   const companyTypes = ["PRODUCT", "OUTSOURCE", "OUTSTAFF", "STARTUP", "AGENCY"] as const;
//   const hrPositions = ["Talent Acquisition Specialist", "IT Recruiter", "Head of HR", "HR Manager", "Technical Sourcer"];
//
//   const companies: Company[] = [];
//   const hrs = [];
//
//   for (let i = 1; i <= 30; i++) {
//     const baseName = companyNames[i % companyNames.length];
//     const uniqueName = `${baseName} ${i > companyNames.length ? `Corp ${i}` : ''}`.trim();
//
//     const company = await prisma.company.create({
//       data: {
//         name: uniqueName,
//         slug: uniqueName.toLowerCase().replace(/\s+/g, '-'),
//         description: `We are a top-tier ${companyTypes[i % companyTypes.length].toLowerCase()} company driving innovation in our domain. Join us to build scalable and impactful solutions.`,
//         companyType: companyTypes[i % companyTypes.length],
//         websiteUrl: `https://${uniqueName.toLowerCase().replace(/\s+/g, '')}.com`,
//         logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(uniqueName)}&background=random`,
//       },
//     });
//
//     companies.push(company);
//
//     // Создаем HR-а для компании
//     const hr = await prisma.user.create({
//       data: {
//         id: `hr-uuid-${i}`,
//         email: `hr${i}@${company.slug}.com`,
//         name: `${getRandom(["Anna", "Dmitry", "Elena", "Max", "Sarah", "Mia", "Vincent"])} HR`,
//         role: "EMPLOYER",
//         companyRole: i % 3 === 0 ? "OWNER" : "RECRUITER",
//         position: getRandom(hrPositions), // Установили нормальную позицию для HR
//         companyId: company.id,
//         avatarUrl: `https://ui-avatars.com/api/?name=HR&background=0D8ABC&color=fff`,
//       }
//     });
//     hrs.push(hr);
//   }
//
//   const vacancyTypes: VacancyType[] = [VacancyType.REMOTE, VacancyType.OFFICE, VacancyType.HYBRID];
//   const employmentTypes: EmploymentType[] = [EmploymentType.FULL_TIME, EmploymentType.PART_TIME, EmploymentType.FREELANCE, EmploymentType.CONTRACT];
//   const locations: LocationType[] = [LocationType.ALL_WORLD, LocationType.EUROPA, LocationType.CIS, LocationType.AMERICA];
//   const levels = ["Trainee", "Junior", "Middle", "Senior", "Lead", "Principal"];
//
//   // 4. ВАКАНСИИ (150 штук)
//   console.log("💼 Seeding 150 vacancies...");
//   const createdVacancies = [];
//
//   for (let i = 1; i <= 150; i++) {
//     const category = getRandom(categories);
//     const company = getRandom(companies);
//     const domain = getRandom(domains);
//     const selectedSkills = getRandomMultiple(skills, randomInt(3, 6));
//     const selectedLangs = getRandomMultiple(languages, randomInt(1, 2));
//
//     const level = getRandom(levels);
//
//     // Делаем названия вакансий более органичными
//     const titlePrefixes = ["Looking for", "Urgent:", "Awesome", ""];
//     const titleSuffixes = ["Developer", "Engineer", "Ninja", "Specialist", "Architect"];
//     const cleanTitle = `${level} ${category.name} ${getRandom(titleSuffixes)}`;
//     const title = `${getRandom(titlePrefixes)} ${cleanTitle}`.trim();
//
//     const salaryMin = randomInt(800, 4000);
//     const salaryMax = salaryMin + randomInt(500, 3000);
//
//     const vacancy = await prisma.vacancy.create({
//       data: {
//         title,
//         description: `### About the role\nWe are looking for a highly skilled **${cleanTitle}** to join our fast-growing team at ${company.name}.\n\n### What you will do:\n- Architect and build scalable solutions\n- Collaborate with cross-functional teams\n- Participate in code reviews and mentoring\n\n### Requirements:\n- Solid experience in our core stack\n- Problem-solving mindset\n- Good communication skills.`,
//         salaryMin,
//         salaryMax,
//         currency: "USD",
//         type: getRandom(vacancyTypes),
//         location: getRandom(locations),
//         experience: level === "Junior" || level === "Trainee" ? randomInt(0, 1) : level === "Middle" ? randomInt(2, 3) : randomInt(4, 7),
//         isActive: Math.random() > 0.1, // 90% активных, 10% закрытых
//         companyId: company.id,
//         categoryId: category.id,
//         domainId: domain.id,
//         skills: { connect: selectedSkills.map(s => ({ id: s.id })) },
//         languages: { connect: selectedLangs.map(l => ({ id: l.id })) },
//       }
//     });
//     createdVacancies.push(vacancy);
//   }
//
//   // 5. КАНДИДАТЫ (200 штук)
//   console.log("👨‍💻 Seeding 200 applicants...");
//   const firstNames = ["Alex", "Maria", "Walter", "Jesse", "Anna", "John", "Quentin", "Elena", "David", "Jessica", "Jules", "Mia"];
//   const lastNames = ["Smith", "Pinkman", "Williams", "Brown", "Jones", "Garcia", "Vega", "Davis", "Rodriguez", "White"];
//   const createdApplicants = [];
//
//   for (let i = 1; i <= 200; i++) {
//     const category = getRandom(categories);
//     const selectedSkills = getRandomMultiple(skills, randomInt(3, 7));
//     const selectedLangs = getRandomMultiple(languages, randomInt(1, 3));
//     const level = getRandom(levels);
//
//     const firstName = getRandom(firstNames);
//     const lastName = getRandom(lastNames);
//
//     // Кастомная генерация позиции для юзера
//     const position = `${level} ${category.name} ${getRandom(["Engineer", "Developer", "Creator"])}`;
//
//     const applicant = await prisma.user.create({
//       data: {
//         id: `applicant-uuid-${i}`,
//         email: `applicant${i}_${Date.now()}@example.com`,
//         name: `${firstName} ${lastName}`,
//         role: "APPLICANT",
//         position: position,
//         about: `Hi! I am a passionate ${position}. I have strong experience building modern applications, setting up architectures from scratch, and writing clean, maintainable code. Open to new opportunities and exciting product challenges!`,
//         avatarUrl: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
//         experience: level === "Junior" || level === "Trainee" ? randomInt(0, 1) : level === "Middle" ? randomInt(2, 3) : randomInt(4, 8),
//         location: getRandom(locations),
//         categoryId: category.id,
//         workFormats: getRandomMultiple(vacancyTypes, randomInt(1, 3)),
//         employmentTypes: getRandomMultiple(employmentTypes, randomInt(1, 2)),
//         skills: { connect: selectedSkills.map(s => ({ id: s.id })) },
//         languages: { connect: selectedLangs.map(l => ({ id: l.id })) },
//       }
//     });
//     createdApplicants.push(applicant);
//   }
//
//   // 6. ОТКЛИКИ НА ВАКАНСИИ (APPLICATIONS)
//   // Чтобы база не была мертвой, создадим случайные отклики кандидатов на вакансии
//   console.log("📩 Seeding applications...");
//   const applicationStatuses = [
//     ApplicationStatus.PENDING,
//     ApplicationStatus.REVIEWING,
//     ApplicationStatus.ACCEPTED,
//     ApplicationStatus.REJECTED,
//     ApplicationStatus.INVITED
//   ];
//
//   for (let i = 0; i < 300; i++) {
//     const applicant = getRandom(createdApplicants);
//     const vacancy = getRandom(createdVacancies);
//
//     // Проверяем, нет ли уже такого отклика (согласно @@unique([applicantId, vacancyId]))
//     const existing = await prisma.application.findUnique({
//       where: {
//         applicantId_vacancyId: {
//           applicantId: applicant.id,
//           vacancyId: vacancy.id
//         }
//       }
//     });
//
//     if (!existing) {
//       await prisma.application.create({
//         data: {
//           applicantId: applicant.id,
//           vacancyId: vacancy.id,
//           coverLetter: Math.random() > 0.5 ? `Hello! I am very interested in the ${vacancy.title} position at your company. My skills perfectly match your requirements. Let's talk!` : null,
//           status: getRandom(applicationStatuses)
//         }
//       });
//     }
//   }
//
//   console.log("✅ Seeding finished successfully! Database is locked and loaded.");
// }
//
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//     await pool.end();
//   })
//   .catch(async (e) => {
//     console.error("❌ Seeding failed:", e);
//     await prisma.$disconnect();
//     await pool.end();
//     process.exit(1);
//   });