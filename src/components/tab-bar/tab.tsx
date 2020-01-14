import * as React from 'react';
import '../../styles/tab-bar/tab.css';
import { MessageType } from '../../enums/message-type';
import * as Storage from '../../storage';

interface props {
  tab: Storage.Tab,
  onUnselectTab: () => void
}

export function Tab({ tab, onUnselectTab }: props) {

  const storage = new Storage.Storage(new Storage.LocalStorage());

  async function handleClick() {
    await onUnselectTab();
    await storage.selectTab(tab, true);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  if (tab.isSelected) {
    return <div className='tab selected-tab' onClick={handleClick}>{tab.name}</div>;
  } else {
    return <div className='tab' onClick={handleClick}>{tab.name}</div>;
  }
}
