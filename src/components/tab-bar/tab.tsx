import * as React from 'react';
import '../../styles/tab-bar/tab.css';
import { MessageType } from '../../enums/message-type';
import * as storage from '../../storage';

interface props {
  tab: storage.Tab,
  onUnselectTab: () => void
}

export class Tab extends React.Component<props> {

  storage = new storage.Storage(new storage.LocalStorage());

  handleClick = async () => {
    await this.props.onUnselectTab();
    const tab = this.props.tab;
    await this.storage.selectTab(tab, true);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  render() {
    if (this.props.tab.isSelected) {
      return <div className='tab selected-tab' onClick={this.handleClick}>{this.props.tab.name}</div>;
    } else {
      return <div className='tab' onClick={this.handleClick}>{this.props.tab.name}</div>;
    }
  }
}
