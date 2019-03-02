import React from 'react';
import ReactDOM from 'react-dom';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
//import Tabs from '@/components/AnalyticsTabs/Tabs';
import './styles.scss';

export default class Analytics extends React.Component {
  render() {
    return (
      <div class="analyticsPage">
        <GenericNavigationBar/>
        <div class="Content">
        <h1>Analytics</h1>
        <Tabs>

          <TabList>
            <Tab><font face="Comic Sans MS" size="4" color="grey"><b>Expiration Analytics</b></font></Tab>
            <Tab><font face="Comic Sans MS" size="4" color="grey"><b>Quantity Analytics</b></font></Tab>
            <Tab><font face="Comic Sans MS" size="4" color="grey"><b>Popularity Analytics</b></font></Tab>
          </TabList>

          <TabPanel>
            What?<br/>
            Your Milk is evolving!<br/>
            Congratulations! Your Milk has evolved into Expired Milk!
          </TabPanel>
          <TabPanel>
            <em>Why?</em> Because Quantity over Quality.
          </TabPanel>
          <TabPanel>
            Was gonna make a joke about AnalYtics.. but maybe not..
          </TabPanel>

        </Tabs>
        </div>
      </div>
    );
  }
};
