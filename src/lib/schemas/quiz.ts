import * as z from 'zod';
// external api schemas for Open Trivia DB

export const OpenTriviaQuestionSchema = z.object({
  category: z.string(),
  type: z.enum(['multiple', 'boolean']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  question: z.string(),
  correct_answer: z.string(),
  incorrect_answers: z.array(z.string()),
});

export const OpenTriviaResponseSchema = z.object({
  response_code: z.number(),
  results: z.array(OpenTriviaQuestionSchema),
});

// internal schemas for database and validation

export const createOptionSchema = z.object({
  text: z.string().min(1).max(200),
  isCorrect: z.boolean(),
});

export const createQuestionSchema = z.object({
  text: z.string().min(1).max(500),
  type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  options: z
    .array(createOptionSchema)
    .min(2, 'A question must have at least 2 options.')
    .max(6, 'A question can have at most 6 options.'),
});

export const createQuizSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  questionCount: z.number().int().min(1).max(100),
  timeLimit: z.number().int().min(10).max(3600),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  category: z.string().min(1).max(100),
  externalId: z.string().optional(),
  questions: z.array(createQuestionSchema).min(1, 'Quiz must have at least 1 question.'),
});

// export types

export type OpenTriviaQuestion = z.infer<typeof OpenTriviaQuestionSchema>;
export type OpenTriviaResponse = z.infer<typeof OpenTriviaResponseSchema>;
export type CreateOption = z.infer<typeof createOptionSchema>;
export type CreateQuestion = z.infer<typeof createQuestionSchema>;
export type CreateQuiz = z.infer<typeof createQuizSchema>;
