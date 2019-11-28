import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Popup } from './components/popup';

const root = document.createElement('div');
document.body.prepend(root);
ReactDom.render(<Popup/>, root);
