// server actions
'use server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import {
  createQuizSchema,
  QuizAttemptInput,
  quizAttemptSchema,
  type CreateQuiz,
} from '../lib/schemas/quiz';

export default async function createQuiz(data: CreateQuiz) {
  const validatedData = createQuizSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error('Invalid quiz data');
  }
  // proceed to create quiz in the database
  // zod returns the validated data in the .data property
  const {
    title,
    description,
    questionCount,
    timeLimit,
    difficulty,
    category,
    externalId,
    questions,
  } = validatedData.data;
  // this is just in memory of js
  // we need to store in db
  // so we use prisma.quiz.create({data:    questions:{create: }})
  await prisma.quiz.create({
    data: {
      title,
      description,
      questionCount,
      timeLimit,
      difficulty,
      category,
      externalId,
      questions: {
        // nest create for questions and options
        create: questions.map((question) => {
          return {
            text: question.text,
            type: question.type,
            difficulty: question.difficulty,
            category: category,
            options: {
              create: question.options.map((option) => {
                return {
                  text: option.text,
                  isCorrect: option.isCorrect,
                };
              }),
            },
          };
        }),
      },
    },
  });
}

/**
 * Get all quizzes for the dashboard
 * Supports optional filtering by difficulty and category
 */
export async function getQuizzes(filters?: {
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  category?: string;
}) {
  const filterDifficulty = filters?.difficulty;
  const filterCategory = filters?.category;
  const quizzes = await prisma.quiz.findMany({
    where: {
      difficulty: filterDifficulty,
      category: filterCategory,
    },
    orderBy: { createdAt: 'desc' },
  });
  console.log('Fetched quizzes:', quizzes.length);
  return quizzes;
}

/**
 * Get a single quiz by its ID, including questions and options
 * @param quizId - the ID of the quiz to retrieve
 * @return the quiz with its questions and options
 **/
export async function getQuizById(quizId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  return quiz;
}

// after submitting quiz
// user info, quiz id, score
// we are taking data from client as parameters
// we need to validate it
export async function savequizAttempt(data: QuizAttemptInput) {
  // first validate it
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be logged in to submit.');
  }
  const validated = quizAttemptSchema.safeParse(data);
  if (!validated.success) {
    throw new Error('Invalid quiz attempt schema.');
  }
  const { quizId, score, userAnswers } = validated.data;
  return await prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      score,
      userAnswers: {
        create: userAnswers.map((answer) => ({
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect: answer.isCorrect,
        })),
      },
    },
  });
}
