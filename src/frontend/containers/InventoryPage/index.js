import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from "react-router-dom";

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

export default class Inventory extends React.Component {
  render() {
    return (
      <div>
        <GenericNavigationBar/>
        <h1>Inventory</h1>
      </div>
    );
  }
};