import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as style from './index.css';
import getBrowserTabId from '../../utils/getBrowserTabId';
import { Storage, LocalStorage, TabGroup } from '../../storage';
import { initializeIcons } from '@uifabric/icons';
import { TabBar } from '../../components/tab-bar/tab-bar';

(async () => {
  
  initializeIcons();

  const storage = new Storage(new LocalStorage());
  const tabId = await getBrowserTabId();
  const tabGroup = await storage.getTabGroupByTabId(tabId);
  const root = document.createElement('div');

  root.classList.add(style.reset);
  root.classList.add(style.tabBarContainer);
  document.body.appendChild(root);
  ReactDom.render(<TabBar tabGroup={tabGroup}/>, root);
})();
