import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'

import Home from '@/containers/HomePage'
import About from '@/containers/AboutPage'
import Analytics from '@/containers/AnalyticsPage'
import Checkout from '@/containers/CheckoutPage'
import Login from '@/containers/LoginPage'
import Register from '@/containers/RegisterPage'
import Invite from '@/containers/InvitePage'
import Inventory from '@/containers/InventoryPage'
import Settings from "@/containers/SettingsPage";
import Workspace from "@/containers/WorkspacePage";
import Changes from "@/containers/ChangesPage"

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/analytics" component={Analytics} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/login/:inviteToken?" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/join/:token" component={Invite} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/changes" component={Changes} />
        <Route path="/settings" component={Settings} />
        <Route path="/workspace" component={Workspace} />
        <Route path="*" render={() => (<Redirect to="/inventory" />)} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router;
