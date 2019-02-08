import React from 'react';
import './styles.scss';

export default class GenericNavigationBar extends React.Component {
  render() {
    return <div class = "Sidebar"> Sidebar Placeholder
      <a href="/home">Home</a>
	    <a href="/about">About</a>
	    <a href="/login">Login</a>
	    <a href="#">Blank</a>
	    </div>;
  }
};
