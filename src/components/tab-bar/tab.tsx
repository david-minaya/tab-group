import * as React from 'react';
import '../../styles/tab-bar/tab.css';
import { MessageType } from '../../enums/message-type';
import { Storage, LocalStorage} from '../../storage';

interface props {
  tab: any
}

export class Tab extends React.Component<props> {

  storage: Storage = new Storage(new LocalStorage());

  handleClick = async () => {
    const tab = this.props.tab;
    this.storage.selectTab(tab);
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab: tab } });
  }

  render() {
    if (this.props.tab.isSelected) {
      return <div className='tab selected-tab' onClick={this.handleClick}>{this.props.tab.name}</div>;
    } else {
      return <div className='tab' onClick={this.handleClick}>{this.props.tab.name}</div>;
    }
  }
}
