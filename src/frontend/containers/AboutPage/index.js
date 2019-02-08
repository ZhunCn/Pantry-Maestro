import React from 'react';
import ReactDOM from 'react-dom';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

export default class About extends React.Component {
  render() {
    return (
      <div>
        <GenericNavigationBar/>
        <div class="Content">
        <p>About component!</p>
        </div>
      </div>
    );
  }
};
