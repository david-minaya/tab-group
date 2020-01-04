import * as React from 'react';
import { Tab } from './tab';
import '../../styles/tab-bar/tab-bar.css';
import { MessageType } from '../../enums/message-type';
import { Storage, LocalStorage, TabGroup } from '../../storage';
import { IconButton } from 'office-ui-fabric-react';

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
      chrome.runtime.sendMessage({ type: MessageType.GET_TAB_ID }, tabId => {
        resolve(tabId);
      });
    });
  }

  render() {
    return (
      <div className='tab-bar'>
        <div className='main-pane'>
          <div className='tabs-list'>
            {
              this.state.tabGroup.tabs.map((tab: any) => {
                return <Tab tab={tab} />;
              })
            }
            <IconButton iconProps={({ iconName: 'add'})} className='add-option'/>
          </div>
        </div>
      </div>
    );
  }
}
