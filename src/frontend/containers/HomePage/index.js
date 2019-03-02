import React from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect} from "react-router-dom";

import {authorize} from '@/utils';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

export default class Home extends React.Component {
  render() {
    if (!authorize()) {
      return (
        <Redirect to="/login"/>
      );
    }

    return (
      <div class="homePage">
        <GenericNavigationBar/>
        <div class="Content">
        <p>Home component</p>
        </div>
      </div>
    );
  }
};
