import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { transformQuestions } from '../src/lib/transforms/quiz';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

async function externalApiFetchAndSeed(
  questions: number,
  category: string,
  difficulty: string,
  type: string
) {
  // Example function to fetch data from an external API and seed the database
  let baseurl = 'https://opentdb.com/api.php?';
  if (questions) baseurl = baseurl.concat(`amount=${questions}&`);
  if (category) baseurl = baseurl.concat(`category=${category}&`);
  if (difficulty) baseurl = baseurl.concat(`difficulty=${difficulty}&`);
  if (type) baseurl = baseurl.concat(`type=${type}&`);
  const response = await fetch(baseurl);
  const jsonData = await response.json();
  return jsonData.results;
}
async function main() {
  // Fetch categories from OpenTDB
  const categoriesUrl = `https://opentdb.com/api_category.php`;
  const res = await fetch(categoriesUrl);
  const data = await res.json();
  const categories = data.trivia_categories.slice(0, 3); // Just first 3 categories to avoid rate limiting

  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

  // Create one quiz per category-difficulty combo (9 quizzes total)
  for (const category of categories) {
    for (const diff of difficulties) {
      const externalQuestions = await externalApiFetchAndSeed(10, category.id, diff, 'multiple');

      if (!externalQuestions || externalQuestions.length === 0) {
        console.log(`No questions found for ${category.name} - ${diff}`);
        continue;
      }

      const transformedQuestions = transformQuestions(externalQuestions);

      await prisma.quiz.create({
        data: {
          title: `${category.name} - ${diff.toUpperCase()}`,
          description: `Test your ${category.name} knowledge!`,
          questionCount: transformedQuestions.length,
          timeLimit: 300,
          difficulty: diff.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD',
          category: category.name,
          questions: {
            create: transformedQuestions.map((q) => ({
              text: q.text,
              type: q.type,
              difficulty: q.difficulty,
              category: category.name,
              options: {
                create: q.options,
              },
            })),
          },
        },
      });

      console.log(`Created quiz: ${category.name} - ${diff}`);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
