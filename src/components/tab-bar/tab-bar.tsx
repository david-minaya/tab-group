import * as React from 'react';
import * as style from '../../styles/tab-bar/tab-bar.css';
import { Tab } from './tab';
import { MessageType } from '../../enums/message-type';
import * as Storage from '../../storage';
import { Icon } from 'office-ui-fabric-react';
import { Message } from '../../message';
import TitlePrefixer from '../../content-scripts/tab-bar/TitlePrefixer';

interface props { tabGroup: Storage.TabGroup; }
const storage = new Storage.Storage(new Storage.LocalStorage());

export function TabBar({ tabGroup: initialTabGroup }: props) {

  const [tabGroup, setTabGroup] = React.useState(initialTabGroup);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(menssageListener);
    prefixBrowserTabTitle();
    return () => {
      chrome.runtime.onMessage.removeListener(menssageListener);
    };
  }, []);

  async function menssageListener({ type, arg }: Message, sender: any, sendResponse: any) {
    
    const isUpdateTab = type === MessageType.UPDATE_TAB;
    const isThisTabGroup = arg.tabId === tabGroup.tabId;
    
    if (isUpdateTab && isThisTabGroup) {
      const tab = getSelectedTab();
      tab.url = arg.url;
      tab.favIconUrl = arg.favIconUrl;
      await storage.updateTab(tab);
      await updateTabGroup();
      setLoading(false);
    }
  }

  function prefixBrowserTabTitle() {
    
    const titleUpdateListener = async (title: string) => {
      const tab = getSelectedTab();
      tab.name = title;
      await storage.updateTab(tab);
      await updateTabGroup();
      setLoading(false);
    };
    
    const titlePrefixer = new TitlePrefixer(tabGroup.name, titleUpdateListener);
    titlePrefixer.prefixTitle();
    
    const observer = new MutationObserver(() => titlePrefixer.prefixTitle()); // eslint-disable-line no-undef
    const titleElement = document.querySelector('title');
    const filter = { characterData: true, childList: true };
    observer.observe(titleElement, filter);
  }

  async function handleAddTab() {
    const tab = new Storage.Tab(
      undefined, 'Nueva pestaña', 'https://www.google.com',
      tabGroup.id, true, 'https://www.google.com/favicon.ico'
    );
    await storage.addTab(tab);
    await handleUnselectTab();
    await updateTabGroup();
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  async function handleCloseTabBar() {
    await detachTabGroup();
  }

  async function handleUnselectTab() {
    const tab = getSelectedTab();
    await storage.selectTab(tab, false);
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
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  async function detachTabGroup() {
    const tab = getSelectedTab();
    await storage.detachBrowserTab(tabGroup.tabId);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
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
                isLoading={isLoading && tab.isSelected}
                onUnselectTab={handleUnselectTab}
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
