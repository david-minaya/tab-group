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
    chrome.storage.local.get('tabs', (response) => {
      const tabs: any[] = response.tabs;
      const tab = tabs.find(tab => tab.url === this.props.tab.url);
      tabs.map(tab => { tab.isSelected = false; return tab; });
      tab.isSelected = true;
      chrome.storage.local.set({ tabs: tabs });
      chrome.runtime.sendMessage(this.props.tab);
      console.log('Tab -> handleClick');
    });

  }

  render() {

    let div = {};

    if (!this.props.tab.isSelected) {
      div = (<div className='tab' onClick={this.handleClick}>{this.props.tab.name}</div>)
    } else {
      div = (<div className='tab2' onClick={this.handleClick}>{this.props.tab.name}</div>)
    }

    return div;
  }
}
