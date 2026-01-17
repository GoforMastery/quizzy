import { getQuizById } from '@/actions/quiz';
import QuizDetail from '@/components/QuizDetail';
import { quizIdSchema } from '@/lib/schemas/quiz';
import { notFound } from 'next/navigation';

export default async function QuizPage({ params }: { params: { id: string } }) {
  let quiz;
  try {
    const resolvedParams = await (params as unknown as Promise<{ id: string }>);
    const validatedId = quizIdSchema.parse(resolvedParams.id);
    quiz = await getQuizById(validatedId);
  } catch (error: unknown) {
    notFound();
  }
  if (!quiz) {
    notFound();
  }

  return <QuizDetail quiz={quiz} />;
}
