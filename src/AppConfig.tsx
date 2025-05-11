import './index.css';

import vkBridge, {
  parseURLSearchParamsForGetLaunchParams,
} from '@vkontakte/vk-bridge';
import {
  useAdaptivity,
  useAppearance,
  useInsets,
} from '@vkontakte/vk-bridge-react';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';

import { transformVKBridgeAdaptivity } from './utils';
import { router } from './routes';
import { App } from './App';

export const AppConfig = () => {
  const vkBridgeAppearance = useAppearance() || undefined;
  const vkBridgeInsets = useInsets() || undefined;
  const adaptivity = transformVKBridgeAdaptivity(useAdaptivity());
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(
    window.location.search,
  );

  return (
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  );
};
