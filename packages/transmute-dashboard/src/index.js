import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';

const version = require('../package.json').version;
console.log('Dashboard Version: ', version);

injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
