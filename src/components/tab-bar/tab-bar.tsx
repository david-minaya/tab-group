import * as React from 'react';
import { Tab } from './tab';
import '../../styles/tab-bar/tab-bar.css';
import { MessageType } from '../../enums/message-type';
import * as Storage from '../../storage';
import { IconButton } from 'office-ui-fabric-react';

export function TabBar() {

  const [tabGroup, setTabGroup] = React.useState(Storage.TabGroup.emptyTabGroup);
  const storage = new Storage.Storage(new Storage.LocalStorage());

  React.useEffect(() => {
    updateTabGroup();
  });

  function getTabId(): Promise<number> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: MessageType.GET_TAB_ID }, tabId => {
        resolve(tabId);
      });
    });
  }

  async function handleAddOptionClick() {
    const tab = new Storage.Tab('Nueva pestaña', 'https://www.google.com', tabGroup.id);
    const selectedTab = getSelectedOffice();
    await storage.addTab(tab);
    await storage.selectTab(selectedTab, false);
    await updateTabGroup();
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  async function handleUnselectTab() {
    const tab = getSelectedOffice();
    await storage.selectTab(tab, false);
  }

  function getSelectedOffice() {
    return tabGroup.tabs.find(tab => tab.isSelected);
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
