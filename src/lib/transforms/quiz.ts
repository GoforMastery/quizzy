// took help and guidance from claude

/*
    Example Input (Open Trivia DB format):
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
    difficulty: "easy",
    type: "multiple",
    category: "Geography"
  }

    Example Output (internal format):
  {
    text: "What is the capital of France?",
    difficulty: "EASY",
    type: "MULTIPLE_CHOICE",
    options: [
      { text: "Paris", isCorrect: true },
      { text: "London", isCorrect: false },
      { text: "Berlin", isCorrect: false },
      { text: "Madrid", isCorrect: false }
    ]
  }
*/
type difficultyProps = 'easy' | 'medium' | 'hard';
type returnedDifficultyType = 'EASY' | 'MEDIUM' | 'HARD';
type externalQuestionCategory = 'multiple' | 'boolean';
type returnedQuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
type externalQuestionType = {
  type: externalQuestionCategory;
  difficulty: difficultyProps;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};
function mapDifficulty(externalDifficulty: difficultyProps): returnedDifficultyType {
  switch (externalDifficulty.toLowerCase()) {
    case 'easy':
      return 'EASY';
    case 'medium':
      return 'MEDIUM';
    case 'hard':
      return 'HARD';
    default:
      throw new Error(`Unknown difficulty level: ${externalDifficulty}`);
  }
}
function mapQuestionType(externalType: externalQuestionCategory): returnedQuestionType {
  switch (externalType.toLowerCase()) {
    case 'multiple':
      return 'MULTIPLE_CHOICE';
    case 'boolean':
      return 'TRUE_FALSE';
    default:
      throw new Error(`Unknown question type: ${externalType}`);
  }
}
function generateArray(correctAns: string, incorrectAns: string[]) {
  const result = [];
  result.push({ text: correctAns, isCorrect: true });
  incorrectAns.forEach((ans) => {
    result.push({ text: ans, isCorrect: false });
  });
  return result;
}
function transformQuestion(externalQuestion: externalQuestionType) {
  return {
    text: externalQuestion.question,
    difficulty: mapDifficulty(externalQuestion.difficulty),
    type: mapQuestionType(externalQuestion.type),
    options: generateArray(externalQuestion.correct_answer, externalQuestion.incorrect_answers),
  };
}

// external api schemas => internal schemas

export function transformQuestions(externalQuestions: externalQuestionType[]) {
  return externalQuestions.map((question) => transformQuestion(question));
}
