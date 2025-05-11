import React, { useState } from 'react';
import questionsData from '../data/questions.json';
// Импортируем компоненты shadcn (Button, Card, ProgressBar и т.д.)
// Импортируйте их согласно вашей структуре, пример:
// import { Button } from "@/components/ui/button";

const questions = questionsData.questions;
const characters = questionsData.characters;

function getCharacterResult(answers: string[]) {
  // Подсчёт совпадений по персонажам
  const score: Record<string, number> = {};
  answers.forEach((answerId, idx) => {
    const q = questions[idx];
    const answer = q.answers.find((a: any) => a.id === answerId);
    if (answer) {
      answer.mapping.forEach((charId: string) => {
        score[charId] = (score[charId] || 0) + 1;
      });
    }
  });
  // Находим персонажа с максимальным счётом
  let max = 0;
  let result = '';
  Object.entries(score).forEach(([charId, val]) => {
    if (val > max) {
      max = val;
      result = charId;
    }
  });
  return characters.find((c: any) => c.id === result);
}

const TestPanel: React.FC<{ id: string }> = ({ id }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answerId: string) => {
    const newAnswers = [...answers, answerId];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const result = getCharacterResult(answers);
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Ты — {result?.name}!</h2>
        {/* Здесь можно добавить изображение персонажа, если появится */}
        <p className="mb-4 text-center text-lg">{result?.description}</p>
        {/* <Button onClick={() => { setStep(0); setAnswers([]); setShowResult(false); }}>Пройти ещё раз</Button> */}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            setStep(0);
            setAnswers([]);
            setShowResult(false);
          }}
        >
          Пройти ещё раз
        </button>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div
      id={id}
      className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="mb-6">
        <div className="text-lg font-semibold mb-2">
          Вопрос {step + 1} из {questions.length}
        </div>
        <div className="text-xl font-bold mb-4">{q.text}</div>
        <div className="flex flex-col gap-4">
          {q.answers.map((a: any) => (
            <button
              key={a.id}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={() => handleAnswer(a.id)}
            >
              {a.text}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
        <div
          className="bg-blue-500 h-2.5 rounded-full"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TestPanel;
