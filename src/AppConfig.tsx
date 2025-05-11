import './index.css';

import vkBridge, {
  parseURLSearchParamsForGetLaunchParams,
} from '@vkontakte/vk-bridge';
import {
  useAdaptivity,
  useAppearance,
  useInsets,
} from '@vkontakte/vk-bridge-react';
// Удаляю импорт RouterProvider
// import { RouterProvider } from '@vkontakte/vk-mini-apps-router';

import { transformVKBridgeAdaptivity } from './utils';
// Удаляю импорт router
// import { router } from './routes';
import { App } from './App';

export const AppConfig = () => {
  const vkBridgeAppearance = useAppearance() || undefined;
  const vkBridgeInsets = useInsets() || undefined;
  const adaptivity = transformVKBridgeAdaptivity(useAdaptivity());
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(
    window.location.search,
  );

  // Просто рендерю <App />
  return <App />;
};
