import * as React from 'react';
import '../../styles/tab-bar/tab.css';
import { MessageType } from '../../enums/message-type';
import { Icon } from 'office-ui-fabric-react';
import * as Storage from '../../storage';

interface props {
  tab: Storage.Tab,
  onUnselectTab: () => void,
  onCloseTab: (tab: Storage.Tab) => void
}

export function Tab({ tab, onUnselectTab, onCloseTab }: props) {

  const storage = new Storage.Storage(new Storage.LocalStorage());

  async function handleTabClick() {
    await onUnselectTab();
    await storage.selectTab(tab, true);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } }); 
  }

  function handleCloseTab(event: any) {
    onCloseTab(tab);
    event.stopPropagation();
  }

  const className = tab.isSelected ? 'tab selected-tab' : 'tab';

  return (
    <div className={className} onClick={handleTabClick}>
      <img className='favicon' src={tab.favIconUrl} />
      <div className='title'>{tab.name}</div>
      <Icon iconName='cancel' className='close' onClick={handleCloseTab} />
    </div>
  );
}
