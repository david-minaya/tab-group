import * as React from 'react';
import '../../styles/tab-bar/tab.css';
import { MessageType } from '../../enums/message-type';
import { Icon } from 'office-ui-fabric-react';
import * as Storage from '../../storage';

interface props {
  tab: Storage.Tab,
  onUnselectTab: () => void
}

export function Tab({ tab, onUnselectTab }: props) {

  const storage = new Storage.Storage(new Storage.LocalStorage());

  async function handleClick() {
    // TODO: Remember remove uncomment this code
    await onUnselectTab();
    await storage.selectTab(tab, true);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } }); 
  }

  const className = tab.isSelected ? 'tab selected-tab' : 'tab';

  return (
    <div className={className} onClick={handleClick}>
      <img className='favicon' src='https://cdn.sstatic.net/Sites/es/img/favicon.ico?v=a8def514be8a' />
      <div className='title'>{tab.name}</div>
      <Icon iconName='cancel' className='close' />
    </div>
  );
}
