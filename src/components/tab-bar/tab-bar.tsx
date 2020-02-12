import * as React from 'react';
import { Tab } from './tab';
import '../../styles/tab-bar/tab-bar.css';
import { MessageType } from '../../enums/message-type';
import * as Storage from '../../storage';
import { Icon } from 'office-ui-fabric-react';
import { Message } from '../../message';

export function TabBar() {

  const [tabGroup, setTabGroup] = React.useState(Storage.TabGroup.emptyTabGroup);
  const storage = new Storage.Storage(new Storage.LocalStorage());
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(updateTab);
    updateTabGroup();
    return () => {
      chrome.runtime.onMessage.removeListener(updateTab);
    };
  }, []);

  function getTabId(): Promise<number> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: MessageType.GET_TAB_ID }, tabId => {
        resolve(tabId);
      });
    });
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
    await storage.detachBrowserTab(tabGroup.tabId);
    const tab = getSelectedTab();
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  async function handleUnselectTab() {
    const tab = getSelectedTab();
    await storage.selectTab(tab, false);
  }

  async function handleCloseTab(tab: Storage.Tab) {
    await storage.deleteTab(tab);
    await selectTab(tab);
  }

  async function selectTab(closedTab: Storage.Tab) {

    const { tabs } = tabGroup;
    const isLastTab = tabs[tabs.length - 1].id === closedTab.id;
    const isOnlyTab = tabs.length === 1;

    if (!closedTab.isSelected) {
      await updateTabGroup();
    } else if (isLastTab && !isOnlyTab) {
      await selectBeforeTab();
    } else if (!isOnlyTab) {
      await selectNextTab(closedTab);
    } else {
      await detachTabGroup(closedTab);
    }
  }

  async function selectBeforeTab() {
    const { tabs } = tabGroup;
    const beforeIndex = tabs.length - 2;
    const tab = tabs[beforeIndex];
    await storage.selectTab(tab, true);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  async function selectNextTab(closedTab: Storage.Tab) {
    const { tabs } = tabGroup;
    const nextIndex = tabs.findIndex(tab => tab.id === closedTab.id) + 1;
    const tab = tabs[nextIndex];
    await storage.selectTab(tab, true);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  async function detachTabGroup(closedTab: Storage.Tab) {
    await storage.detachBrowserTab(tabGroup.tabId);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab: closedTab } });
  }

  function getSelectedTab() {
    return tabGroup.tabs.find(tab => tab.isSelected);
  }

  async function updateTab({ type, arg }: Message, sender: any, sendResponse: any) {
    if (type !== MessageType.UPDATE_TAB) return;
    const tabGroup = await storage.getTabGroupByTabId(arg.tabId);
    const tab = tabGroup.tabs.find(tab => tab.isSelected);
    tab.name = arg.title;
    tab.url = arg.url;
    tab.favIconUrl = arg.favIconUrl;
    await storage.updateTab(tab);
    setLoading(false);
    setTabGroup(tabGroup);
  }

  async function updateTabGroup() {
    const tabId = await getTabId();
    const tabGroup = await storage.getTabGroupByTabId(tabId);
    setTabGroup(tabGroup);
  }

  return (
    <div className='tab-bar'>
      <div className='main-pane'>
        <div className='tabs-list'>
          {
            tabGroup.tabs.map(tab => {
              return (
                <Tab
                  key={tab.id}
                  tab={tab}
                  isLoading={isLoading && tab.isSelected}
                  onUnselectTab={handleUnselectTab}
                  onCloseTab={handleCloseTab} />
              );
            })
          }
        </div>
        <Icon iconName='add' className='icon' onClick={handleAddTab}/>
      </div>
      <div className='options'>
        <Icon iconName='cancel' className='icon' onClick={handleCloseTabBar}/>
      </div>
    </div>
  );
}
