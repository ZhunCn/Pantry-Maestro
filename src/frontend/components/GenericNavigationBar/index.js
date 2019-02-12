import React from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import Menu from 'react-burger-menu/lib/menus/slide';
import prof from '@/assets/Profile.png';

export default class GenericNavigationBar extends React.Component {
  render() {
    return (
      <Menu>
          <Link to="/settings">
          <img class="img" src={prof} alt = "Profile" />
          <p class="italic">Firstname Lastname</p>
          <p class="italic">Volunteer</p>
          </Link>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/settings">Settings</Link>
        </Menu>
      );
  }
};
