import * as React from 'react';
import * as style from './tab-group.css';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { TabItem } from '../tab-item';
import * as Storage from '../../storage';

export function TabGroup({ tabGroup }: { tabGroup: Storage.TabGroup }) {

  const storage = new Storage.Storage(new Storage.LocalStorage());

  async function handleClick() {
    const browserTabId = await createTab();
    await storage.attachBrowserTab(tabGroup.id, browserTabId);
    // The tab bar is inserted in the new tab in the background script. 
    // This script listen when a tab is loading the page, and if the id 
    // of that tab is attached to one tab group, the tab bar is inserted. 
    // See the onCommitted event in the background.js file.
  }

  async function createTab(): Promise<number> {
    const { url } = await getSelectedTab();
    return new Promise((resolve, reject) => {
      chrome.tabs.create({ url }, ({ id }) => {
        resolve(id);
      });
    });
  }

  function getSelectedTab() {
    return tabGroup.tabs.find(tab => tab.isSelected);
  }

  return (
    <div className={style.tabGroup}>
      <div className={style.topBar}>
        <div className={style.title}>{tabGroup.name}</div>
        <Icon className={style.openOption} iconName='OpenInNewTab' onClick={handleClick}></Icon>
      </div>
      <div className={style.list}>
        {
          tabGroup.tabs.map(tab => {
            return <TabItem key={tab.id} tab={tab} />;
          })
        }
      </div>
    </div>
  );
}
