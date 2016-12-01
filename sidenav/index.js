if (module.hot) {
  module.hot.accept();
}

import React from 'react';
import { render } from 'react-dom';
import SideNav from './components/SideNav';
import './styles/main.scss';

render(<SideNav />, document.getElementById('__root__'));
