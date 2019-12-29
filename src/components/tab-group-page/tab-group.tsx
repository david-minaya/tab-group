import * as React from 'react';
import '../../styles/tab-group-page/tab-group.css';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import Tab from './tab';
import * as storage from '../../storage';

export default class TabGroup extends React.Component {

  props: { tabGroup: storage.TabGroup }

  handleClick = () => {
    console.log('TabGroup -> handleClick');
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
