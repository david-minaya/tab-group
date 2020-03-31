import * as React from 'react';
import * as style from './tab-item.css';
import * as storage from '../../storage';

export function TabItem({ tab }: { tab: storage.Tab }) {
  return (
    <div className={style.tab}>
      <div className={style.title}>{tab.name}</div>
      <a href={tab.url}>{tab.url}</a>
    </div>
  );
}
