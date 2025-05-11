import { useState, useEffect, ReactNode } from 'react';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';

import { Home, Test } from './panels';

export const App = () => {
  const [activePanel, setActivePanel] = useState<'home' | 'test'>('home');
  const [fetchedUser, setUser] = useState<UserInfo | undefined>();
  const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner />);

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  const goToTest = () => setActivePanel('test');

  return (
    <SplitLayout>
      <SplitCol>
        {activePanel === 'home' && <Home onStart={goToTest} />}
        {activePanel === 'test' && <Test id="test" />}
      </SplitCol>
      {popout}
    </SplitLayout>
  );
};
