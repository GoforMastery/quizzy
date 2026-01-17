'use client';
import { Quiz } from '@/lib/types/quiz';
import he from 'he';
import { useState } from 'react';
interface QuizDetailProps {
  quiz: Quiz;
}

export default function QuizDetail({ quiz }: QuizDetailProps) {
  const [score, setScore] = useState(0);
  const [array, setArray] = useState<number[]>([]);
  const [currChose, setCurrChose] = useState(-1);
  // let's first consider just single option wise.

  function handleChoose(idx: number) {
    console.log(`choose option ${idx}`);
    // this chose for current question
    setCurrChose(idx);
  }
  function handleClick(choice: number) {
    setArray(array.concat(choice));
    console.log(array);
  }
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        <p className="text-sm text-gray-500">
          Category: {quiz.category} | Difficulty: {quiz.difficulty}
        </p>
        <p className="mt-4 text-lg text-gray-700">{quiz.description}</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Questions</h2>
        <ul className="space-y-8">
          {quiz.questions.map((question, index) => (
            <li key={question.id} className="bg-gray-50 p-6 rounded-lg border-2 border-blue-300">
              <p className="font-semibold text-lg text-gray-800 mb-4">
                {index + 1}. {he.decode(question.text)}
              </p>
              <div className="flex flex-col gap-3">
                {question.options.map((option, idx) => (
                  <div key={option.id} className="w-full flex justify-between">
                    <div>{option.text}</div>
                    <button
                      className="border-2 border-black m-1 p-2 rounded-md hover:cursor-pointer"
                      onClick={() => {
                        handleChoose(idx);
                      }}
                    >
                      choose
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button
                  className="w-1/4 border-2 border-black m-2 p-2 rounded-md hover:cursor-pointer"
                  onClick={() => {
                    handleClick(currChose);
                  }}
                >
                  Submit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
