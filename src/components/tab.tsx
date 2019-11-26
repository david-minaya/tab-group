/* eslint-disable no-undef */
import * as React from 'react';
import '../styles/tab.css';

interface props {
  tab: any
}

export class Tab extends React.Component<props> {

  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    chrome.storage.local.get('tabsGroup', (response) => {
      const tabsGroup = response.tabsGroup;
      const tabs: any[] = tabsGroup.tabs;
      const tab = tabs.find(tab => tab.url === this.props.tab.url);
      tabs.map(tab => { tab.isSelected = false; return tab; });
      tab.isSelected = true;
      chrome.storage.local.set({ tabsGroup });
      chrome.runtime.sendMessage({ id: 2, tab: this.props.tab });
    });
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
