import * as React from 'react';
import * as ReactDom from 'react-dom';
import { TabBar } from './components/tab-bar/tab-bar';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

const root = document.createElement('div');
document.body.appendChild(root);
ReactDom.render(<TabBar/>, root);
