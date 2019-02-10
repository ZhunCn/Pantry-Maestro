import React from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import Menu from 'react-burger-menu/lib/menus/slide';
import prof from '@/assets/Profile.png';

export default class GenericNavigationBar extends React.Component {
  render() {
    return (
      <Menu>
          <a className="menu-item" href="/"><img src={prof} alt = "Profile" /></a>
          <a className="menu-item" href="/">Home</a>
          <a className="menu-item" href="/about">About</a>
          <a className="menu-item" href="/login">Login</a>
          <a className="menu-item" href="#">Blank</a>
        </Menu>
      );
  }
};
