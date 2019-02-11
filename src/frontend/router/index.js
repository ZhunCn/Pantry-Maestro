import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter, Redirect} from 'react-router-dom'

import Home from '@/containers/HomePage'
import About from '@/containers/AboutPage'
import Login from '@/containers/LoginPage'
import Register from '@/containers/RegisterPage'
import Inventory from '@/containers/InventoryPage'
import Settings from "@/containers/SettingsPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/settings" component={Settings} />
        <Route path="*" render={() => (<Redirect to="/"/>)} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router;
