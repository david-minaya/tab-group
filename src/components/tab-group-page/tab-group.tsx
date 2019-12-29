import * as React from 'react';
import '../../styles/tab-group-page/tab-group.css';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import Tab from './tab';

export default class TabGroup extends React.Component {

  handleClick = () => {
    console.log('TabGroup -> handleClick');
  }

  render() {
    return (
      <div className='tab-group'>
        <div className='top-bar'>
          <div className='title'>Tab group</div>
          <Icon iconName='OpenInNewTab' className='open-option' onClick={this.handleClick}></Icon>
        </div>
        <div className='tab-list'>
          <Tab/>
          <Tab/>
          <Tab/>
          <Tab/>
        </div>
      </div>
    );
  }
}
