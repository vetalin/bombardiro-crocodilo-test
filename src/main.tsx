import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { AppConfig } from './AppConfig.tsx';

vkBridge.send('VKWebAppInit');

// --- Тема VK ---
function applyVKTheme(appearance: string) {
  if (appearance === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

vkBridge.send('VKWebAppGetConfig').then((data) => {
  if (data.appearance) {
    applyVKTheme(data.appearance);
  }
});

vkBridge.subscribe((e) => {
  if (e.detail?.type === 'VKWebAppUpdateConfig') {
    const appearance = e.detail.data?.appearance;
    if (appearance) {
      applyVKTheme(appearance);
    }
  }
});
// --- конец темы VK ---

// --- Баннерная реклама VK ---
vkBridge
  .send('VKWebAppShowBannerAd', { banner_location: 'bottom' })
  .then((data) => {
    if (data.result) {
      // Баннер успешно показан
    }
  })
  .catch((error) => {
    // Ошибка показа баннера, не мешаем работе приложения
    // console.log('Ошибка показа баннера:', error);
  });
// --- конец баннерной рекламы ---

createRoot(document.getElementById('root')!).render(<AppConfig />);

if (import.meta.env.MODE === 'development') {
  import('./eruda.ts');
}
