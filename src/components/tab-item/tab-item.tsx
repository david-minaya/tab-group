import * as React from 'react';
import style from './tab-item.css';
import { Tab } from '../../models';

export function TabItem({ tab }: { tab: Tab }) {
  return (
    <div className={style.tab}>
      <div className={style.title}>{tab.name}</div>
      <a href={tab.url}>{tab.url}</a>
    </div>
  );
}
