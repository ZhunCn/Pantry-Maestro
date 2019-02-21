import React from 'react';
import ReactTable from 'react-table'
import {Redirect} from 'react-router-dom';
import 'react-table/react-table.css'
import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';
import axios from 'axios'

import {sum, authorize} from '@/utils';

import AddChangeItemComponent from '@/components/AddChangeItemComponent';

let workspaceID = localStorage.getItem("currWorkspaceID");

function Item(id, name, expiration, quantity) {
    this.id = id;
    this.name = name;
    this.expiration = expiration;
    this.quantity = quantity;
}

function parseData(serverData) {
    let parsedData = [];
    for (let i = 0; i < Object.entries(serverData.inventory.items).length; i++) {
        for (let j = 0; j < Object.entries(Object.entries(serverData.inventory.items)[i][1].quantities).length; j++) {
            let tempItem = new Item(Object.entries(serverData.inventory.items)[i][1]._id,
                Object.entries(serverData.inventory.items)[i][1].name,
                Object.entries(Object.entries(serverData.inventory.items)[i][1].quantities)[j][0],
                Object.entries(Object.entries(serverData.inventory.items)[i][1].quantities)[j][1]);
            parsedData.push(tempItem);
        }
    }
    return parsedData;
}

export default class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Temporary data set
            data: [
                {
                    name: "TEST1",
                    expiration: "12/01/2019",
                    quantity: 20
                },
                {
                    name: "TEST1",
                    expiration: "02/15/2019",
                    quantity: 12
                }, {
                    name: "TEST1",
                    expiration: "03/19/2019",
                    quantity: 23
                }, {
                    name: "TEST2",
                    expiration: "01/07/2019",
                    quantity: 2
                }, {
                    name: "TEST2",
                    expiration: "05/23/2019",
                    quantity: 11
                }, {
                    name: "TEST2",
                    expiration: "06/24/2019",
                    quantity: 9
                }, {
                    name: "TEST2",
                    expiration: "07/12/2019",
                    quantity:14
                }
            ]
        }
    }

    componentDidMount() {
        // Get the items from the server
        workspaceID = localStorage.getItem("currWorkspaceID")
        axios.get(`/api/workspaces/${workspaceID}/inventory`, {}).then(res => {
            let serverData = parseData(res.data);
            this.setState({ data: serverData });
            console.log(serverData);
        });
    }

    handleRefreshClick() {
        workspaceID = localStorage.getItem("currWorkspaceID")
        axios.get(`/api/workspaces/${workspaceID}/inventory`, {}).then(res => {
            // Add functionality to see if the last modified item is the same as the local last modified item.
            // Only refresh i.e. setState when the last modified items are different
            let serverData = parseData(res.data);
            this.setState({ data: serverData });
            console.log(serverData);
        });
    }

    render() {
        if (!authorize()) {
          return (
            <Redirect to="/login"/>
          );
        }

        const { data } = this.state;
        const columns = [
            {
                Header: "Name",
                accessor: "name",
                sortMethod: (a,b) => {
                    return (a.toLowerCase() > b.toLowerCase()) ? 1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0);
            }
            },
            {
                Header: "Earliest Expiration Date",
                id: "expiration",
                aggregate: vals => vals.sort()[0],
                accessor: d => {
                    let dates = Array.from(d.expiration);
                    return dates.sort((a, b) => {
                        return Date.parse(a) > Date.parse(b);
                    });
                },
                sortMethod: (a,b) => {
                    let date1 = new Date(a.join(""))
                    let date2 = new Date(b.join(""))
                    if (date1 > date2) {
                        return 1;
                      }
                      if (date1 < date2) {
                        return -1;
                      }
                      // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
                      return 0;
                }
            },
            {
                Header: "Quantity",
                accessor: "quantity",
                aggregate: vals => sum(vals),
                Aggregated: row => {
                    return (
                        <span>
                        {row.value} (Total)
                        </span>
                    );
                }
            }
        ];

        return (
            <div class="inventoryPage">
                <GenericNavigationBar/>
                <div class="Content">
                    <div class="InventoryTopBar">
                        <h1>Inventory</h1>
                        <button class="button refreshButton" onClick={() => {this.handleRefreshClick()}}>Refresh</button>
                    </div>
                    <ReactTable ref={(refReactTable) => {this.refReactTable = refReactTable;}}
                                data={data}
                                columns={columns}
                                pivotBy={["name"]}
                                sortable={true}
                    />
                    <AddChangeItemComponent/>
                </div>
            </div>
        );
    }

};
