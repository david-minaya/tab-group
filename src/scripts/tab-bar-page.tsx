import * as React from 'react';
import * as ReactDom from 'react-dom';
import { initializeIcons } from '../icons';
import { TabBarPage } from '../components/tab-bar-page/tab-bar-page';

initializeIcons(chrome.runtime.getURL('/'));

const root = document.createElement('div');
document.body.prepend(root);
ReactDom.render(<TabBarPage/>, root);
