import { useState, useEffect, ReactNode } from 'react';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Test } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } =
    useActiveVkuiLocation();
  const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner />);

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Test id="test" />
        </View>
      </SplitCol>
      {popout}
    </SplitLayout>
  );
};
