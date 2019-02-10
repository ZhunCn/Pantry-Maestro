import React from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import Menu from 'react-burger-menu/lib/menus/slide';
import prof from '@/assets/Profile.png';

export default class GenericNavigationBar extends React.Component {
  render() {
    return (
      <Menu>
<<<<<<< HEAD
          <Link to="/"><img src={prof} alt = "Profile" /></Link>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
          <Link to="/#">Blank</Link>
        </Menu>
      );
=======
        <a className="menu-item" href="/"><img src={prof} alt="Profile"/></a>
        <a className="menu-item" href="/">Home</a>
        <a className="menu-item" href="/about">About</a>
        <a className="menu-item" href="/login">Login</a>
        <a className="menu-item" href="/inventory">Inventory</a>
        <a className="menu-item" href="#">Blank</a>
      </Menu>
    );
>>>>>>> 0bffeb7592208abe7ad9498c976bdb4ed870d43d
  }
};
