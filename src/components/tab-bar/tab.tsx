import * as React from 'react';
import '../../styles/tab-bar/tab.css';
import { MessageType } from '../../enums/message-type';
import { Icon, Spinner, SpinnerSize, Shimmer } from 'office-ui-fabric-react';
import * as Storage from '../../storage';

interface props {
  tab: Storage.Tab;
  isLoading: boolean;
  onUnselectTab: () => void;
  onCloseTab: (tab: Storage.Tab) => void;
}

export function Tab({ tab, onUnselectTab, onCloseTab, isLoading }: props) {

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
      { isLoading &&
        <React.Fragment>
          <Spinner size={SpinnerSize.small}/>
          <Shimmer width='100px'/>
        </React.Fragment>
      } { !isLoading && 
        <React.Fragment>
          <img className='favicon' title={tab.name} src={tab.favIconUrl}/>
          <div className='title' title={tab.name}>{tab.name}</div>
        </React.Fragment>
      }
      <Icon iconName='cancel' className='close' onClick={handleCloseTab} />
    </div>
  );
}
