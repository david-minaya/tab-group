import * as React from 'react';
import * as style from './tab-group.css';
import * as Storage from '../../storage';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { TabItem } from '../tab-item';

const storage = new Storage.Storage(new Storage.LocalStorage());

export function TabGroup({ tabGroup }: { tabGroup: Storage.TabGroup }) {

  function handleOpenInNewTab() {

    const selectedTab = tabGroup.tabs.find(tab => tab.isSelected);
    const createProperties = { url: selectedTab.url };

    chrome.tabs.create(createProperties, async browserTab => {
      await storage.attachBrowserTab(tabGroup.id, browserTab.id);
    });

    // The tab bar is inserted in the new tab in the background script. 
    // This script listen when a tab is loading the page, and if the id 
    // of that tab is attached to one tab group, the tab bar is inserted. 
    // See the onCommitted event in the background.js file.
  }

  async function handleDeleteTabBar() {
    await storage.deleteTabGroup(tabGroup.id);
  }

  return (
    <div className={style.tabGroup}>
      <div className={style.topBar}>
        <div className={style.title}>{tabGroup.name}</div>
        <div className={style.options}>
          <Icon className={style.option} iconName='OpenInNewTab' onClick={handleOpenInNewTab}/>
          <Icon className={style.option} iconName='delete' onClick={handleDeleteTabBar}/>
        </div>
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
