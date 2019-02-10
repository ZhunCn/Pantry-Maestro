import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from "react-router-dom";

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <GenericNavigationBar/>
        <div class="Content">
        <p>Home component</p>
        <button id="testingbutton">testing button</button>
        <Link id="login" to="/login">Login</Link>
        </div>
      </div>
    );
  }
};
