import * as React from 'react';
import * as style from './tab-bar.css';
import * as Storage from '../../storage';
import { Tab } from '../tab/tab';
import { MessageType, Message, TitlePrefixer } from '../../utils';
import { Icon } from 'office-ui-fabric-react';
import defaultFavicon from '../../images/default-favicon.svg';

interface props { tabGroup: Storage.TabGroup; }
const storage = new Storage.Storage(new Storage.LocalStorage());

export function TabBar({ tabGroup: initialTabGroup }: props) {

  const [tabGroup, setTabGroup] = React.useState(initialTabGroup);

  // TODO: get the selected tab here

  React.useEffect(() => {

    chrome.runtime.onMessage.addListener(menssageListener);
    prefixBrowserTabTitle();

    return () => {
      chrome.runtime.onMessage.removeListener(menssageListener);
    };
  }, []);

  async function menssageListener({ type, arg }: Message, sender: any, sendResponse: any) {

    const isThisTabGroup = arg.tabId === tabGroup.tabId;

    if (!isThisTabGroup) return;

    switch (type) {

      case MessageType.TAB_ADDED:
        await updateTabGroup();
        break;
    }
  }

  function prefixBrowserTabTitle() {

    const titlePrefixer = new TitlePrefixer(tabGroup.name, () => {});
    titlePrefixer.prefixTitle();

    const observer = new MutationObserver(() => titlePrefixer.prefixTitle());
    const titleElement = document.querySelector('title');
    const filter = { characterData: true, childList: true };
    observer.observe(titleElement, filter);
  }

  async function handleAddTab() {

    const selectedTab = getSelectedTab();
    const tab = new Storage.Tab(
      undefined, 'Nueva pestaña', 'https://www.google.com',
      tabGroup.id, true, chrome.runtime.getURL(defaultFavicon)
    );
    
    await storage.addTab(tab);
    await storage.selectTab(selectedTab, false);
    await updateTabGroup();
    
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { url: tab.url } });
  }

  async function handleCloseTabBar() {
    await detachTabGroup();
  }

  async function handleCloseTab(tab: Storage.Tab) {
    await storage.deleteTab(tab);
    await selectNewTab(tab);
  }

  function getSelectedTab() {
    return tabGroup.tabs.find(tab => tab.isSelected);
  }

  async function updateTabGroup() {
    const updatedTabGroup = await storage.getTabGroupByTabId(tabGroup.tabId);
    setTabGroup(updatedTabGroup);
  }

  async function selectNewTab(closedTab: Storage.Tab) {

    const { tabs } = tabGroup;
    const isLastTab = tabs[tabs.length - 1].id === closedTab.id;
    const isOnlyTab = tabs.length === 1;

    if (!closedTab.isSelected) {

      await updateTabGroup();

    } else if (isLastTab && !isOnlyTab) {

      // Select the before tab
      const beforeIndex = tabs.length - 2;
      const tab = tabs[beforeIndex];
      await selectTab(tab);

    } else if (!isOnlyTab) {

      // Select the next tab
      const nextIndex = tabs.findIndex(tab => tab.id === closedTab.id) + 1;
      const tab = tabs[nextIndex];
      await selectTab(tab);

    } else {

      await detachTabGroup();
    }
  }

  async function selectTab(tab: Storage.Tab) {
    await storage.selectTab(tab, true);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { url: tab.url } });
  }

  async function detachTabGroup() {
    const tab = getSelectedTab();
    const url = tab ? tab.url : window.location.href;
    // TODO: remove the tab group without refresh the page
    await storage.detachBrowserTab(tabGroup.tabId);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { url } });
  }

  return (
    <div className={style.tabBar}>
      <div className={style.mainPane}>
        <div className={style.tabs}>
          {
            tabGroup.tabs.map(tab => (
              <Tab
                key={tab.id}
                tab={tab}
                onCloseTab={handleCloseTab} />
            ))
          }
        </div>
        <Icon className={style.icon} iconName='add' onClick={handleAddTab} />
      </div>
      <div className={style.options}>
        <Icon className={style.icon} iconName='cancel' onClick={handleCloseTabBar} />
      </div>
    </div>
  );
}
