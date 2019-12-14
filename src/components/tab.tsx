import * as React from 'react';
import '../styles/tab.css';
import { MessageType } from '../enums/message-type';
import Storage from '../storage/storage';
import LocalStorage from '../storage/local-storage';

interface props {
  tab: any
}

export class Tab extends React.Component<props> {

  storage: Storage = new Storage(new LocalStorage());

  private handleClick = async () => {
    const tab = this.props.tab;
    this.storage.selectTab(tab);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab: tab } });
  }

  render() {
    let div = {};
    if (!this.props.tab.isSelected) {
      div = (<div className='tab' onClick={this.handleClick}>{this.props.tab.name}</div>);
    } else {
      div = (<div className='tab2' onClick={this.handleClick}>{this.props.tab.name}</div>);
    }
    return div;
  }
}
