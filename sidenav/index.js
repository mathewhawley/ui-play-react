if (module.hot) {
  module.hot.accept();
}

import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import './styles/main.scss';

render(<Root />, document.getElementById('__root__'));
