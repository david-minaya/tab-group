import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Index } from './components/index/index';

const root = document.createElement('div');
document.body.prepend(root);
ReactDom.render(<Index/>, root);
