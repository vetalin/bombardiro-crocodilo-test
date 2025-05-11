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

createRoot(document.getElementById('root')!).render(<AppConfig />);

if (import.meta.env.MODE === 'development') {
  import('./eruda.ts');
}
