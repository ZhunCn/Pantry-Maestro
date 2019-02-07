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
        <p>Home component</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
};
