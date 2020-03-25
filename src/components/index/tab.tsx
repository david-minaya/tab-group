import * as React from 'react';
import * as style from '../../styles/index/tab.css';
import * as storage from '../../storage';

export function Tab({ tab }: { tab: storage.Tab }) {
  return (
    <div className={style.tab}>
      <div className={style.title}>{tab.name}</div>
      <a href={tab.url}>{tab.url}</a>
    </div>
  );
}
