import * as React from 'react';
import '../../styles/tab-group-page/tab-group-page.css';
import { MainPane } from './main-pane';
import { NavigationPane } from './navigation-pane';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

export function TabGroupPage() {
  return (
    <div className='tab-group-page'>
      <NavigationPane/>
      <MainPane/>
    </div>
  );
}
