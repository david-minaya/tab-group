import * as React from 'react';
import * as ReactDom from 'react-dom';
import { TabBarPage } from '../components';

const root = document.createElement('div');
document.body.prepend(root);
ReactDom.render(<TabBarPage/>, root);
