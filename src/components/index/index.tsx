import * as React from 'react';
import '../../styles/index/index.css';
import { MainPane } from './main-pane';
import { NavigationPane } from './navigation-pane';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

export function Index() {
  return (
    <div className='index'>
      <NavigationPane/>
      <MainPane/>
    </div>
  );
}
