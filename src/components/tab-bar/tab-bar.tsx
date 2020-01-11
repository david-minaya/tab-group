import * as React from 'react';
import { Tab } from './tab';
import '../../styles/tab-bar/tab-bar.css';
import { MessageType } from '../../enums/message-type';
import * as storage from '../../storage';
import { IconButton } from 'office-ui-fabric-react';

export class TabBar extends React.Component {

  state: { tabGroup: storage.TabGroup }
  storage: storage.Storage

  constructor(props: any) {
    super(props);
    this.state = { tabGroup: storage.TabGroup.emptyTabGroup };
    this.storage = new storage.Storage(new storage.LocalStorage());
  }

  componentDidMount = async () => {
    await this.updateTabGroup();
  }

  getTabId(): Promise<number> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: MessageType.GET_TAB_ID }, tabId => {
        resolve(tabId);
      });
    });
  }

  handleAddOptionClick = async () => {
    const tab = new storage.Tab('Nueva pestaña', 'https://www.google.com', this.state.tabGroup.id);
    const selectedTab = this.getSelectedOffice();
    await this.storage.addTab(tab);
    await this.storage.selectTab(selectedTab, false);
    await this.updateTabGroup();
    chrome.runtime.sendMessage({ type: MessageType.NAVIGATE, arg: { tab } });
  }

  handleUnselectTab = async () => {
    const tab = this.getSelectedOffice();
    await this.storage.selectTab(tab, false);
  }

  getSelectedOffice() {
    return this.state.tabGroup.tabs.find(tab => tab.isSelected);
  }

  async updateTabGroup() {
    const tabId = await this.getTabId();
    const tabGroup = await this.storage.getTabGroupByTabId(tabId);
    this.setState({ tabGroup });
  }

  render() {
    return (
      <div className='tab-bar'>
        <div className='main-pane'>
          <div className='tabs-list'>
            {
              this.state.tabGroup.tabs.map(tab => {
                return <Tab key={tab.id} tab={tab} onUnselectTab={this.handleUnselectTab}/>;
              })
            }
          </div>
          <IconButton iconProps={({ iconName: 'add' })} className='add-option' onClick={this.handleAddOptionClick} />
        </div>
      </div>
    );
  }
}
