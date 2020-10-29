import * as React from 'react';
import * as ReactDom from 'react-dom';
import { initializeIcons } from '../icons';
import { Popup } from '../components/popup/popup';

initializeIcons(chrome.runtime.getURL('/'));

const root = document.createElement('div');
document.body.prepend(root);
ReactDom.render(<Popup/>, root);
