import React from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import Menu from 'react-burger-menu/lib/menus/slide';
import logo from '@/assets/PantryMaestroLogo.png';
import { List, Icon, Header, Image } from "semantic-ui-react";
export default class GenericNavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const path = window.location.pathname;
    return (
      <Menu width={250}>
      <Image src={logo} size='huge'/>
      <Header as='h2' textAlign='center'>Menu</Header>
      <List divided relaxed="very" selection verticalAlign="middle" size="large">
          <List.Item as={Link} to="/checkout" active={path==='/checkout'} disabled={path==='/checkout'}>
              <List.Icon size="big" name='shopping cart' color={path==='/checkout'?"black":""}/>
              <List.Content><List.Header>Checkout</List.Header></List.Content>
          </List.Item>
          <List.Item as={Link} to="/inventory" active={path==='/inventory'} disabled={path==='/inventory'}>
              <List.Icon size="big" name='clipboard' color={path==='/inventory'?"black":""}/>
              <List.Content><List.Header>Inventory</List.Header></List.Content>
          </List.Item>
          <List.Item as={Link} to="/workspace" active={path==='/workspace'} disabled={path==='/workspace'}>
              <List.Icon size="big" name='building' color={path==='/workspace'?"black":""}/>
              <List.Content><List.Header>Workspaces</List.Header></List.Content>
          </List.Item>
          <List.Item as={Link} to="/analytics" active={path==='/analytics'} disabled={path==='/analytics'}>
              <List.Icon size="big" name='chart bar' color={path==='/analytics'?"black":""}/>
              <List.Content><List.Header>Analytics</List.Header></List.Content>
          </List.Item>
          <List.Item as={Link} to="/changes" active={path==='/changes'} disabled={path==='/changes'}>
              <List.Icon size="big" name='undo' color={path==='/changes'?"black":""}/>
              <List.Content><List.Header>Changes</List.Header></List.Content>
          </List.Item>
          <List.Item as={Link} to="/settings" active={path==='/settings'} disabled={path==='/settings'}>
              <List.Icon size="big" name='settings' color={path==='/settings'?"black":""}/>
              <List.Content><List.Header>Settings</List.Header></List.Content>
          </List.Item>
        </List>
      </Menu>
    );
  }
};
