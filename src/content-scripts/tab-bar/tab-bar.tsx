import * as React from 'react';
import * as ReactDom from 'react-dom';
import style from './tab-bar.css';
import { TabBar } from '../../components/tab-bar';
import { Message } from '../../utils';
import { MessageType } from '../../constants';

export async function insertTabBar() {

  const root = document.createElement('div');
  root.classList.add(style.reset);
  root.classList.add(style.tabBarContainer);
  document.body.appendChild(root);
  ReactDom.render(<TabBar/>, root);

  chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.type === MessageType.CLOSE_TAB_BAR) {
      ReactDom.unmountComponentAtNode(root);
    }
  });
}
