import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as style from './tab-bar.css';
import { getBrowserTab } from '../../utils';
import { Storage, LocalStorage, TabGroup } from '../../storage';
import { initializeIcons } from '@uifabric/icons';
import { TabBar } from '../../components/tab-bar/tab-bar';

export async function insertTabBar() {

  initializeIcons();

  const storage = new Storage(new LocalStorage());
  const { id } = await getBrowserTab();
  const tabGroup = await storage.getTabGroupByTabId(id);
  const root = document.createElement('div');

  root.classList.add(style.reset);
  root.classList.add(style.tabBarContainer);
  document.body.appendChild(root);
  ReactDom.render(<TabBar tabGroup={tabGroup} />, root);
}
