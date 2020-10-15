import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as style from './tab-bar.css';
import { getBrowserTab } from '../../utils';
import { Storage, LocalStorage } from '../../storage';
import { initializeIcons } from '../../icons';
import { TabBar } from '../../components/tab-bar/tab-bar';
import { Context } from '../../context';
import { STORAGE_NAME } from '../../constants';

initializeIcons(chrome.runtime.getURL(''));

export async function insertTabBar() {

  const storage = Storage.init(LocalStorage, STORAGE_NAME);
  const { id } = await getBrowserTab();
  const tabGroup = await storage.tabsGroups.getTabGroupByTabId(id);
  const root = document.createElement('div');

  root.classList.add(style.reset);
  root.classList.add(style.tabBarContainer);
  document.body.appendChild(root);

  const component = (
    <Context.Provider value={{ storage }}>
      <TabBar tabGroup={tabGroup} /> 
    </Context.Provider>
  );

  ReactDom.render(component, root);
}
