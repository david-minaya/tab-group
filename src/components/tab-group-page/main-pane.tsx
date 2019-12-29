import * as React from 'react';
import '../../styles/tab-group-page/main-pane.css';
import TabGroup from './tab-group';

export function MainPane() {
  return (
    <div className='main-pane'>
      <div className='tab-group-list'>
        <TabGroup/>
        <TabGroup/>
        <TabGroup/>
      </div>
    </div>
  );
}
