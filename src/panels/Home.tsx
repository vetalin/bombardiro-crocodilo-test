import * as React from 'react';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const routeNavigator = useRouteNavigator();
  const handleStartTest = () => {
    routeNavigator.push('test');
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 m-auto">
      <Card className="max-w-3xl w-full bg-background border-none">
        <CardContent className="flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-[400px]">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground w-full text-center">
            Тест Бомбардиро Крокодило
          </h1>
          <p className="text-lg mb-10 text-muted-foreground w-full text-center">
            Добро пожаловать во вселенную Бомбардиро Крокодило! Этот
            увлекательный тест поможет вам узнать больше о себе и своём месте в
            этой удивительной вселенной. Погрузитесь в мир фантазии и откройте
            новые грани своей личности.
          </p>
          <div className="flex justify-center w-full">
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              onClick={handleStartTest}
            >
              Начать
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Home };
