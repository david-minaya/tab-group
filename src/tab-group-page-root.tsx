import * as React from 'react';
import * as ReactDom from 'react-dom';
import { TabGroupPage } from './components/tab-group-page';

const root = document.createElement('div');
document.body.prepend(root);
ReactDom.render(<TabGroupPage/>, root);
