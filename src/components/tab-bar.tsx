import * as React from 'react';
import { Tab } from './tab';
import '../styles/tab-bar.css';
import { MessageType } from '../enums/message-type';
import Storage from '../storage/storage';
import TabGroup from '../storage/tab-group';
import LocalStorage from '../storage/local-storage';

export class TabBar extends React.Component {

  state: { tabGroup: TabGroup | any }
  storage: Storage

  constructor(props: any) {
    super(props);
    this.state = { tabGroup: { tabs: [] } };
    this.storage = new Storage(new LocalStorage());
  }

  componentDidMount = async () => {
    const tabId = await this.getTabId();
    const tabGroup = await this.storage.getTabGroupByTabId(tabId);
    this.setState({ tabGroup });
  }

  private getTabId(): Promise<number> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: MessageType.CREATE_TAB }, tabId => {
        resolve(tabId);
      });
    });
  }

  render() {
    return (
      <div className='tab-bar'>
        {
          this.state.tabGroup.tabs.map((tab: any) => {
            return (<Tab tab={tab} />);
          })
        }
      </div>
    );
  }
}
