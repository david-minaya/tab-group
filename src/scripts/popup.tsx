import * as React from 'react';
import * as ReactDom from 'react-dom';
import { initializeIcons } from '@uifabric/icons';
import { Popup } from '../components/popup/popup';

initializeIcons();

const root = document.createElement('div');
document.body.prepend(root);
ReactDom.render(<Popup/>, root);
