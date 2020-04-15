import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as style from './dev.css';
import { AddModal } from '../../components/add-modal';

export function insertDev() {
  const div = document.createElement('div');
  div.classList.add(style.dev);
  document.body.appendChild(div);
  ReactDom.render(<AddModal onCloseModal={() => {}}/>, div);
}
