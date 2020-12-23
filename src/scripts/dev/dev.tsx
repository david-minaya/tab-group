import * as React from 'react';
import * as ReactDom from 'react-dom';
import style from './dev.css';
import { Popup } from '../../components';

export function insertDev() {
  const div = document.createElement('div');
  div.classList.add(style.dev);
  document.body.appendChild(div);
  ReactDom.render(<Popup/>, div);
}
