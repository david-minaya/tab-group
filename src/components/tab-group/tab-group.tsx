import * as React from 'react';
import * as style from './tab-group.css';
import * as Storage from '../../storage';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { TabItem } from '../tab-item';
import { MessageType } from '../../utils';

const storage = new Storage.Storage(new Storage.LocalStorage());

export function TabGroup({ tabGroup }: { tabGroup: Storage.TabGroup }) {

  function handleOpenInNewTab() {

    const selectedTab = tabGroup.tabs.find(tab => tab.isSelected) || tabGroup.tabs[0];
    const createProperties = { url: selectedTab.url };

    chrome.tabs.create(createProperties, async browserTab => {

      await storage.attachBrowserTab(tabGroup.id, browserTab.id);

      // The tab bar is inserted from the background script when the listener
      // chrome.webNavigation.onCommitted is triggered. This listener is triggered
      // when the page is updating. This line send a message to the background 
      // script to update the page.
      chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { url: selectedTab.url } });
    });
  }

  async function handleDeleteTabBar() {
    await storage.deleteTabGroup(tabGroup.id);
  }

  return (
    <div className={style.tabGroup}>
      <div className={style.topBar}>
        <div className={style.title}>{tabGroup.name}</div>
        <div className={style.options}>
          <Icon className={style.option} iconName='OpenInNewTab' onClick={handleOpenInNewTab} />
          <Icon className={style.option} iconName='delete' onClick={handleDeleteTabBar} />
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
