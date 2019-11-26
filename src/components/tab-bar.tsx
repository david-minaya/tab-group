/* eslint-disable no-undef */
import * as React from 'react';
import { Tab } from './tab';
import '../styles/tab-bar.css';

interface state {
  tabs: any
}

export class TabBar extends React.Component<{}, state> {

  constructor(props: any) {
    super(props);

    this.state = {
      tabs: []
    };

    chrome.storage.local.get('tabsGroup', (result) => {
      this.setState({ tabs: result.tabsGroup.tabs });
    });
  }

  render() {
    return (
      <div className='tab-bar'>
        {
          this.state.tabs.map((tab: any) => {
            return (<Tab tab={tab} />);
          })
        }
      </div>
    );
  }
}
