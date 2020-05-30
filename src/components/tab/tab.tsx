import * as React from 'react';
import * as style from './tab.css';
import * as Storage from '../../storage';
import { MessageType } from '../../utils';
import { Icon } from 'office-ui-fabric-react';

interface props {
  tab: Storage.Tab;
  onCloseTab: (tab: Storage.Tab) => void;
}

export function Tab({ tab, onCloseTab }: props) {

  function handleTabClick() {
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { url: tab.url } });
  }

  function handleCloseTab(event: any) {
    onCloseTab(tab);
    event.stopPropagation();
  }

  const tabStyle = tab.isSelected ? style.selectedTab : style.tab;

  return (
    <div className={tabStyle} onClick={handleTabClick}>
      <img className={style.favicon} title={tab.name} src={tab.favIconUrl} />
      <div className={style.title} title={tab.name}>{tab.name}</div>
      <Icon className={style.close} iconName='cancel' onClick={handleCloseTab} />
    </div>
  );
}
