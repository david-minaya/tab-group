import * as React from 'react';
import * as style from './tab-bar-page.css';
import { MainPane } from '../main-pane';
import { NavigationPane } from '../navigation-pane';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

export function TabBarPage() {
  return (
    <div className={style.index}>
      <NavigationPane/>
      <MainPane/>
    </div>
  );
}
