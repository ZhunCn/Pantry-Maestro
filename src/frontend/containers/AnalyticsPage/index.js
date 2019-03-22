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
    let workspaceID = localStorage.getItem("currWorkspaceID");
    if (workspaceID == "null") {
      console.log("gotem");
      this.getDemoChartData();
    }else{
      console.log(workspaceID);
      this.getExpChartData();
      this.getPopChartData();
      this.getQuantChartData();
    }
  }
  getPopChartData(){
    let userLoginToken = localStorage.getItem("loginToken");
    let workspaceID = localStorage.getItem("currWorkspaceID");
    axios.get(`/api/workspaces/${workspaceID}/analytics/quantities/top`, { headers: { "Authorization" : `${userLoginToken}` } }).then(res => {
        //console.log(workspaceID);
        //console.log(userLoginToken);
        //console.log(res.analytics[0].name);
        //console.log(res.data);


      //if(res.data.analytics.length != 3){
      //  console.log("hi0");
      //  console.log(res.data.analytics);
      //}else{
        //console.log("hi");
        //console.log(res.data.analytics);
        var labellist = [res.data.analytics[0].name,res.data.analytics[1].name,res.data.analytics[2].name];
        var qval = [res.data.analytics[0].total,res.data.analytics[1].total,res.data.analytics[2].total];
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
      //}
    });
  }

  getQuantChartData(){
    let userLoginToken = localStorage.getItem("loginToken");
    let workspaceID = localStorage.getItem("currWorkspaceID");
    axios.get(`/api/workspaces/${workspaceID}/inventory`, {}).then(res => {
        //console.log(workspaceID);
        //console.log(userLoginToken);
        //console.log(res.analytics);
        //console.log("hi");
        var labellist = [];
        var qval = [];
        for (let i = 0; i<res.data.inventory.items.length; i++) {
          labellist[i] = res.data.inventory.items[i].name;
          qval[i] = res.data.inventory.items[i].total;
        }
        //[res.data.analytics.inventory.items[0].name,res.data.analytics.inventory.items[1].name,res.data.analytics.inventory.items[2].name];
        //[res.data.analytics.inventory.items[0].total,res.data.analytics.inventory.items[1].total,res.data.analytics.inventory.items[2].total];
        this.setState({
          chartQuantData:{
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
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
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
        //console.log("doneq");
    });
  }

  getExpChartData(){

    let userLoginToken = localStorage.getItem("loginToken");
    let workspaceID = localStorage.getItem("currWorkspaceID");
    //console.log("letsgoooo");
    axios.get(`/api/workspaces/${workspaceID}/analytics/expiration/expired`, { headers: { "Authorization" : `${userLoginToken}` } }).then(res => {
        //console.log("letsgoooostart");
        console.log(workspaceID);
        console.log(userLoginToken);
        console.log("hiexp");
        console.log(res.data.analytics);
        console.log(res.data);
        console.log("hiexp");
        let labellist = [];
        let qval = [];
        let counter = 0
        for (let i = 0; i<res.data.analytics.length; i++) {
          if(res.data.analytics[i].expired != 0){
            labellist[counter] = res.data.analytics[i].name;
            qval[counter] = res.data.analytics[i].total;
            counter++;
          }
        }
        //[res.data.analytics.inventory.items[0].name,res.data.analytics.inventory.items[1].name,res.data.analytics.inventory.items[2].name];
        //[res.data.analytics.inventory.items[0].total,res.data.analytics.inventory.items[1].total,res.data.analytics.inventory.items[2].total];
        this.setState({
          chartExpData:{
            labels: labellist,
            datasets:[
              {
                label: 'Expired Food Items',
                data: qval,
                backgroundColor:[
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(139, 69, 19, 0.6)',
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
    });
  }

  getDemoChartData(){
    // Ajax calls here
    this.setState({
      chartExpData:{
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
      },

        chartQuantData:{
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
        },

          chartPopData:{
            labels: ['Ramen', 'Frozen Pizza', 'Milk', 'Macaroni & Cheese', 'Rice', 'Ice Cream', 'Chocolate Ice Cream'],
            datasets:[
              {
                label:'This is a demo',
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
            <ExpirationChart chartData={this.state.chartExpData} pantry="The Pantry" legendPosition="bottom"/>
          </TabPanel>
          <TabPanel>
            <QuantityChart chartData={this.state.chartQuantData} pantry="The Pantry" legendPosition="bottom"/>
          </TabPanel>
          <TabPanel>
            <PopularityChart chartData={this.state.chartPopData} pantry="The Pantry" legendPosition="bottom"/>
          </TabPanel>

        </Tabs>
        </div>
      </div>
    );
  }
};
