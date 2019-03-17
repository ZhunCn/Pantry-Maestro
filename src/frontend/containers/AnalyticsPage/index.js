import React from 'react';
import ReactDOM from 'react-dom';
import PopularityChart from '@/components/PopularityChart';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
//import Tabs from '@/components/AnalyticsTabs/Tabs';
import './styles.scss';

export default class Analytics extends React.Component {

  componentWillMount(){
    this.getChartData();
  }

  getChartData(){
    // Ajax calls here
    this.setState({
      chartData:{
        labels: ['Ramen', 'Frozen Pizza', 'Milk', 'Macaroni & Cheese', 'Rice', 'Ice Cream', 'Chocolate Ice Cream'],
        datasets:[
          {
            label:'Food Item',
            data:[
              617,
              181,
              153,
              105,
              109,
              80,
              1000
            ],
            backgroundColor:[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(139, 69, 19, 0.6)'
            ]
          }
        ]
      }
    });
  }


  render() {
    return (
      <div class="analyticsPage">
        <GenericNavigationBar/>
        <div class="Content">
        <h1>Analytics</h1>
        <Tabs>

          <TabList>
            <Tab><font face="Futura" size="4" color="grey"><b>Expiration Analytics</b></font></Tab>
            <Tab><font face="Futura" size="4" color="grey"><b>Quantity Analytics</b></font></Tab>
            <Tab><font face="Futura" size="4" color="grey"><b>Popularity Analytics</b></font></Tab>
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
            Was gonna make a joke about AnalYtics.. but maybe not..<br/>
            <PopularityChart chartData={this.state.chartData} pantry="/Insert Workspace Name Here/" legendPosition="bottom"/>
          </TabPanel>

        </Tabs>
        </div>
      </div>
    );
  }
};
