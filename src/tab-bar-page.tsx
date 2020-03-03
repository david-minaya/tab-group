import * as React from 'react';
import * as ReactDom from 'react-dom';
import getBrowserTabId from './utils/getBrowserTabId';
import { initializeIcons } from '@uifabric/icons';
import { TabBar } from './components/tab-bar/tab-bar';
import { Storage, LocalStorage } from './storage';

initializeIcons();

(async () => {
  const tabId = await getBrowserTabId();
  const storage = new Storage(new LocalStorage());
  const tabGroup = await storage.getTabGroupByTabId(tabId);
  const root = document.createElement('div');
  document.body.appendChild(root);
  ReactDom.render(<TabBar tabGroup={tabGroup}/>, root);
})();
