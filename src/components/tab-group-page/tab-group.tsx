import * as React from 'react';
import '../../styles/tab-group-page/tab-group.css';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class TabGroup extends React.Component {

  handleClick = () => {
    console.log('TabGroup -> handleClick');
  }

  render() {
    return (
      <div className='tab-group'>
        <div className='top'>
          <div className='title'>Tab group</div>
          <Icon iconName='OpenInNewTab' className='open' onClick={this.handleClick}></Icon>
        </div>
        <div className='bottom'></div>
      </div>
    );
  }
}
