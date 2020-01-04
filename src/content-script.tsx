import * as React from 'react';
import * as ReactDom from 'react-dom';
import { TabBar } from './components/tab-bar/tab-bar';
import './content-script.css';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

const body = document.body;
const tabGroup = document.createElement('div');
tabGroup.classList.add('tab-group');

body.appendChild(tabGroup);
ReactDom.render(<TabBar/>, tabGroup);
