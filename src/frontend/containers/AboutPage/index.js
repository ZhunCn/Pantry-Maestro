import React from 'react';
import ReactDOM from 'react-dom';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

export default class About extends React.Component {
  render() {
    return (
      <div class="aboutPage">
        <GenericNavigationBar />
        <div class="MainContent">
          <p>About component!</p>
        </div>
      </div>
    );
  }
};
