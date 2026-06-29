import React from 'react';
import ReactDOM from 'react-dom';
import VehicleList from './components/organisms/VehicleList';
import './global-styles.scss';

ReactDOM.render(
  <React.StrictMode>
    <main>
      <VehicleList />
    </main>
  </React.StrictMode>,
  document.querySelector('.root')
);
