import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter, Redirect} from 'react-router-dom'

import Home from '@/containers/HomePage'
import About from '@/containers/AboutPage'
import Analytics from '@/containers/AnalyticsPage'
import Login from '@/containers/LoginPage'
import Register from '@/containers/RegisterPage'
import Invite from '@/containers/InvitePage'
import Inventory from '@/containers/InventoryPage'
import Settings from "@/containers/SettingsPage";
import Workspace from "@/containers/WorkspacePage";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/invite" component={Invite} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/settings" component={Settings} />
        <Route path="/workspace" component={Workspace} />
        <Route path="*" render={() => (<Redirect to="/"/>)} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router;
