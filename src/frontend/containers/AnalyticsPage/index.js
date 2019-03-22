import React from 'react';
import ReactDOM from 'react-dom';
import PopularityChart from '@/components/PopularityChart';
import QuantityChart from '@/components/QuantityChart';
import ExpirationChart from '@/components/ExpirationChart';
import GenericNavigationBar from '@/components/GenericNavigationBar';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import axios from 'axios';

//import Tabs from '@/components/AnalyticsTabs/Tabs';
import './styles.scss';

export default class Analytics extends React.Component {

  componentWillMount(){
    this.getDemoChartData();
    this.getPopChartData();
    //this.getQuantChartData();
    //this.getExpChartData();
  }
  getPopChartData(){
    let userLoginToken = localStorage.getItem("loginToken");
    let workspaceID = localStorage.getItem("currWorkspaceID");
    axios.get(`/api/workspaces/${workspaceID}/analytics/quantities/top`, { headers: { "Authorization" : `${userLoginToken}` } }).then(res => {
        console.log(workspaceID);
        console.log(userLoginToken);
        //console.log(res.analytics);
      if(res.data.analytics.inventory.items.length != 3){
        console.log("hi0");
        console.log(res.data.analytics.inventory.items);
      }else{
        console.log("hi");
        var labellist = [res.data.analytics.inventory.items[0].name,res.data.analytics.inventory.items[1].name,res.data.analytics.inventory.items[2].name];
        var qval = [res.data.analytics.inventory.items[0].total,res.data.analytics.inventory.items[1].total,res.data.analytics.inventory.items[2].total];
        this.setState({
          chartPopData:{
            labels: labellist,
            datasets:[
              {
                label: 'Food Item',
                data: qval,
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
    });
  }

  getDemoChartData(){
    // Ajax calls here
    this.setState({
      chartDemoData:{
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
            <ExpirationChart chartData={this.state.chartDemoData} pantry="/Insert Workspace Name Here/" legendPosition="bottom"/>
          </TabPanel>
          <TabPanel>
            <em>Why?</em> Because Quantity over Quality.
            <QuantityChart chartData={this.state.chartDemoData} pantry="/Insert Workspace Name Here/" legendPosition="bottom"/>
          </TabPanel>
          <TabPanel>
            Was gonna make a joke about AnalYtics.. but maybe not..<br/>
            <PopularityChart chartData={this.state.chartPopData} pantry="/Insert Workspace Name Here/" legendPosition="bottom"/>
          </TabPanel>

        </Tabs>
        </div>
      </div>
    );
  }
};
