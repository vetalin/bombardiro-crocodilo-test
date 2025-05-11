import React, { useState } from 'react';
import questionsData from '../data/questions.json';
import bridge from '@vkontakte/vk-bridge';
import { Share2, RefreshCw, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
// Импортируем компоненты shadcn (Button, Card, ProgressBar и т.д.)
// Импортируйте их согласно вашей структуре, пример:
// import { Button } from "@/components/ui/button";

const questions = questionsData.questions;
const characters = questionsData.characters;

// Динамический импорт всех изображений из assets
const images = import.meta.glob('../assets/*.{png,jpg,jpeg}', {
  eager: true,
  as: 'url',
});

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

function getCharacterImage(id: string): string | undefined {
  const map: Record<string, string> = {
    bombardiro_crocodilo: images['../assets/bombardiro_crocodilo.png'],
    bombombini_gusini: images['../assets/bombombini_gusini.png'],
    tralalelo_tralala: images['../assets/tralalelo_tralala.png'],
    bobrito_bandito: images['../assets/bobrito_bandito.jpg'],
    lirili_larila: images['../assets/lirili_larila.png'],
    trulimero_trulicina: images['../assets/trulimero_trulicina.png'],
    balerina_kapuchino: images['../assets/balerina_kapuchino.png'],
    pingvinator_termoregulator:
      images['../assets/pingvinator_termoregulator.jpeg'],
    orangutini_ananasini: images['../assets/orangutini_ananasini.jpeg'],
    krokodilo_taksichino: images['../assets/krokodilo_taksichino.jpeg'],
    pussini_sushini: images['../assets/pussini_sushini.jpeg'],
    shimpanzini_bananini: images['../assets/shimpanzini_bananini.jpeg'],
    brbaloni_lulilolli: images['../assets/brbaloni_lulilolli.jpg'],
    // Добавьте остальные по необходимости
  };
  return map[id];
}

interface ShareButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'share' | 'retry';
  size?: 'default' | 'lg';
  text?: string;
}

const ShareButton = React.forwardRef<HTMLButtonElement, ShareButtonProps>(
  ({ className, variant = 'share', size = 'default', text, ...props }, ref) => {
    const isShare = variant === 'share';
    const buttonText =
      text || (isShare ? 'Поделиться с друзьями' : 'Пройти ещё раз');
    const Icon = isShare ? Share2 : RefreshCw;
    const buttonColor = isShare
      ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
      : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700';

    return (
      <button
        ref={ref}
        className={cn(
          'relative flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-transparent',
          buttonColor,
          'text-white font-medium transition-all duration-300 ease-in-out',
          'shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2',
          isShare ? 'focus:ring-purple-500' : 'focus:ring-orange-400',
          size === 'default' ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg',
          className,
        )}
        {...props}
      >
        <Icon className="h-5 w-5" />
        <span>{buttonText}</span>
      </button>
    );
  },
);
ShareButton.displayName = 'ShareButton';

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
    const appLink = 'https://vk.com/app53544212';
    const imageSrc = result && getCharacterImage(result.id);
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-card text-card-foreground rounded-xl shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Ты — {result?.name}!</h2>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={result?.name}
            className="mb-4 w-48 h-48 object-contain rounded-xl shadow-md border border-border bg-background"
          />
        )}
        <p className="mb-4 text-center text-lg">{result?.description}</p>
        <div className="flex flex-col gap-4 w-full max-w-xs mt-2">
          <ShareButton
            variant="share"
            size="lg"
            onClick={() =>
              bridge.send('VKWebAppShare', {
                link: appLink,
              })
            }
          />
          <button
            className="relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-transparent bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-white font-medium transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 px-5 py-2.5 text-base"
            onClick={() => bridge.send('VKWebAppRecommend')}
          >
            <Star className="h-4 w-4" />
            <span>Рекомендовать приложение</span>
          </button>
        </div>
        <ShareButton
          variant="retry"
          className="mt-6"
          onClick={() => {
            setStep(0);
            setAnswers([]);
            setShowResult(false);
          }}
        />
        {/* Расширенное описание */}
        {result?.extended_description && (
          <div className="mt-8 w-full">
            <div className="text-lg font-semibold mb-2">
              {result.extended_description}
            </div>
          </div>
        )}
        {/* Биография */}
        {result?.biography && (
          <div className="mt-4 w-full">
            <div className="font-bold mb-1">Биография</div>
            <div className="text-sm text-muted-foreground">
              {result.biography}
            </div>
          </div>
        )}
        {/* История */}
        {result?.story && (
          <div className="mt-4 w-full">
            <div className="font-bold mb-1">История</div>
            <div className="text-sm text-muted-foreground">{result.story}</div>
          </div>
        )}
        {/* Характеристики */}
        {result?.characteristics && (
          <div className="mt-4 w-full">
            <div className="font-bold mb-1">Характеристики</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Сила:</span>{' '}
                {result.characteristics.strength}
              </div>
              <div>
                <span className="font-semibold">Ловкость:</span>{' '}
                {result.characteristics.agility}
              </div>
              <div>
                <span className="font-semibold">Интеллект:</span>{' '}
                {result.characteristics.intelligence}
              </div>
              <div>
                <span className="font-semibold">Харизма:</span>{' '}
                {result.characteristics.charisma}
              </div>
              <div>
                <span className="font-semibold">Сюрреализм:</span>{' '}
                {result.characteristics.surrealism}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const q = questions[step];
  return (
    <div
      id={id}
      className="max-w-xl mx-auto mt-10 p-6 bg-card text-card-foreground rounded-xl shadow-lg"
    >
      <div className="mb-6">
        <div className="text-lg font-semibold mb-2 text-card-foreground">
          Вопрос {step + 1} из {questions.length}
        </div>
        <div className="text-xl font-bold mb-4 text-card-foreground">
          {q.text}
        </div>
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
