import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as style from './add-modal.css';
import { AddModal } from '../../components/add-modal';

let root: HTMLDivElement;

export function insertAddModal() {

  root = document.createElement('div');
  root.classList.add(style.reset);
  root.classList.add(style.modalContainer);
  
  document.body.appendChild(root);
  ReactDom.render(<AddModal onCloseModal={closeModal}/>, root);  
}

function closeModal() {  
  document.body.removeChild(root);
}
