import React from 'react';
import ReactDOM from 'react-dom';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

export default class Analytics extends React.Component {
  render() {
    return (
      <div class="analyticsPage">
        <GenericNavigationBar/>
        <div class="Content">
        <p>Analytics Page !! Wowowowowow!!!</p>
        </div>
      </div>
    );
  }
};
