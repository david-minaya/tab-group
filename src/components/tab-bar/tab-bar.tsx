import * as React from 'react';
import { Tab } from './tab';
import '../../styles/tab-bar/tab-bar.css';
import { MessageType } from '../../enums/message-type';
import * as Storage from '../../storage';
import { IconButton } from 'office-ui-fabric-react';
import { Message } from '../../message';

export function TabBar() {

  const [tabGroup, setTabGroup] = React.useState(Storage.TabGroup.emptyTabGroup);
  const storage = new Storage.Storage(new Storage.LocalStorage());

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

  async function handleAddOptionClick() {
    const tab = new Storage.Tab(undefined, 'Nueva pestaña', 'https://www.google.com', tabGroup.id);
    const selectedTab = getSelectedTab();
    await storage.addTab(tab);
    await storage.selectTab(selectedTab, false);
    await updateTabGroup();
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  async function handleUnselectTab() {
    const tab = getSelectedTab();
    await storage.selectTab(tab, false);
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
    await storage.updateTab(tab);
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
              return <Tab key={tab.id} tab={tab} onUnselectTab={handleUnselectTab} />;
            })
          }
        </div>
        <IconButton iconProps={({ iconName: 'add' })} className='add-option' onClick={handleAddOptionClick} />
      </div>
    </div>
  );
}
