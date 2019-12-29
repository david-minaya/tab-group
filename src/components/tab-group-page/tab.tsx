import * as React from 'react';
import '../../styles/tab-group-page/tab.css';
import * as storage from '../../storage';

export default function Tab({ tab }: { tab: storage.Tab }) {
  return (
    <div className='tab'>
      <div className='title'>{tab.name}</div>
      <a href={tab.url}>{tab.url}</a>
    </div>
  );
}
