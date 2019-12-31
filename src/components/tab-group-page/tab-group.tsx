import * as React from 'react';
import '../../styles/tab-group-page/tab-group.css';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import Tab from './tab';
import * as storage from '../../storage';

export default class TabGroup extends React.Component {

  props: { tabGroup: storage.TabGroup }
  storage: storage.Storage

  constructor(props: { tabGroup: storage.TabGroup }) {
    super(props);
    this.storage = new storage.Storage(new storage.LocalStorage());
  }

  handleClick = async () => {
    const browserTabId = await this.createTab();
    await this.storage.attachBrowserTab(this.props.tabGroup.id, browserTabId);
    // The tab bar is inserted in the new tab in the background script. 
    // This script listen when a tab is loading the page, and if the id 
    // of that tab is attached to one tab group, the tab bar is inserted. 
    // See the onCommitted event in the background.js file.
  }

  createTab(): Promise<number> {
    return new Promise((resolve, reject) => {
      const url = this.props.tabGroup.tabs[0].url;
      chrome.tabs.create({ url: url }, tab => {
        resolve(tab.id);
      });
    });
  }

  render() {
    return (
      <div className='tab-group'>
        <div className='top-bar'>
          <div className='title'>{this.props.tabGroup.name}</div>
          <Icon iconName='OpenInNewTab' className='open-option' onClick={this.handleClick}></Icon>
        </div>
        <div className='tab-list'>
          {
            this.props.tabGroup.tabs.map(tab => {
              return <Tab key={tab.id} tab={tab}/>;
            })
          }
        </div>
      </div>
    );
  }
}
