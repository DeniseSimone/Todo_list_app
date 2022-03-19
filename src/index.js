import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const DATA = [
  { id: "1", name: "Do the dishes", completed: true },
  { id: "2", name: "Cook dinner", completed: false },
];

ReactDOM.render(<App tasks={DATA} />,document.getElementById('root'));
                 

