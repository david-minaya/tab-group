import * as React from 'react';
import * as style from '../../styles/index/index.css';
import { MainPane } from './main-pane';
import { NavigationPane } from './navigation-pane';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

export function Index() {
  return (
    <div className={style.index}>
      <NavigationPane/>
      <MainPane/>
    </div>
  );
}
