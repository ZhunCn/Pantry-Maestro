import React from 'react';
import ReactTable from 'react-table'
import { Redirect } from 'react-router-dom';
import 'react-table/react-table.css'
import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import { sum, authorize } from '@/utils';

import AddChangeItemComponent from '@/components/AddChangeItemComponent';
import { toast } from 'react-toastify';

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
                    quantity: 14
                }
            ],
            dateRangeStart: undefined,
            dateRangeEnd: undefined
        }
    }

    componentDidMount() {
        // Get the items from the server
        this.fetchData();
    }

    fetchData() {
        workspaceID = localStorage.getItem("currWorkspaceID")
        axios.get(`/api/workspaces/${workspaceID}/inventory`, {}).then(res => {
            // Add functionality to see if the last modified item is the same as the local last modified item.
            // Only refresh i.e. setState when the last modified items are different
            let serverData = parseData(res.data);
            this.setState({ data: serverData });
            localStorage.setItem("inventory", JSON.stringify(serverData));
            // console.log(serverData);
        });
    }

    handleCalendarChangeStart(date) {
        let startDate = new Date(date);
        this.setState({ dateRangeStart: startDate })
    }

    handleCalendarChangeEnd(date) {
        let endDate = new Date(date);
        this.setState({ dateRangeEnd: endDate })
    }

    dateDiff(first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }

    editQuantityButton(item, updown) {
        console.log(item);
        console.log(updown);

        let updatedQuantity = {
            "quantities": {
                [item.expiration]: updown
            }
        }
        console.log(updatedQuantity);
        workspaceID = localStorage.getItem("currWorkspaceID");
        let itemID = item.id;
        axios.put(`/api/workspaces/${workspaceID}/inventory/${itemID}`, updatedQuantity).then(res => {
            // HTTP status 200 OK
            if (res.status === 200) {
                console.log("updated quantity");
            }
            console.log(res.data);
            // this.fetchData();
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        if (!authorize()) {
            return (
                <Redirect to="/login" />
            );
        }

        const { data } = this.state;
        const columns = [
            {
                Header: "Name",
                id: "name",
                accessor: d => d.name,
                sortMethod: (a, b) => {
                    return (a.toLowerCase() > b.toLowerCase()) ? 1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0);
                },
                filterMethod: (filter, row) => {
                    return (row.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1)
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
                sortMethod: (a, b) => {
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
                },
                filterMethod: (filter, row) => {
                    var currDate = new Date();
                    var rowDate = new Date(row.expiration.join(""));
                    console.log(rowDate);
                    // Terrible, *TERRIBLE* code. Very copypasted. 
                    // I'll refactor it when I have time later
                    // Right now, functionality is paramount
                    if (filter.value == "all") {
                        // Show all items
                        return true;
                    }
                    if (filter.value == "expired") {
                        if (rowDate < currDate) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (filter.value == "sevenDays") {
                        if (this.dateDiff(currDate, rowDate) <= 7) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (filter.value == "thirtyDays") {
                        if (this.dateDiff(currDate, rowDate) <= 30) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (filter.value == "sixtyDays") {
                        if (this.dateDiff(currDate, rowDate) <= 60) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (filter.value == "ninetyDays") {
                        if (this.dateDiff(currDate, rowDate) <= 90) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (filter.value == "later") {
                        if (this.dateDiff(currDate, rowDate) > 90) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    console.log(row);
                    console.log(filter);
                },
                Filter: ({ filter, onChange }) =>
                    <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}
                    >
                        <option value="all">Show all</option>
                        <option value="expired">Already Expired</option>
                        <option value="sevenDays">7 Days</option>
                        <option value="thirtyDays">30 Days</option>
                        <option value="sixtyDays">60 Days</option>
                        <option value="ninetyDays">90 Days</option>
                        <option value="later">91+ Days</option>
                    </select>
            }, {
                Header: "Quantity",
                accessor: "quantity",
                aggregate: vals => sum(vals),
                Aggregated: row => {
                    return (
                        <span>
                            {row.value} (Total)
                        </span>
                    );
                },
                Cell: row => {
                    console.log(row);
                    return (
                        <div>
                            <label style={{ padding: '10px' }}>{row.row.quantity}</label>
                            <button onClick={() => this.editQuantityButton(row.row._original, 1)}>+</button>
                            <button onClick={() => this.editQuantityButton(row.row._original, -1)}>-</button>
                        </div>
                    )
                }
            }
        ];

        return (
            <div class="inventoryPage" >
                <GenericNavigationBar />
                <div class="Content">
                    <div class="InventoryTopBar">
                        <h1>Inventory</h1>
                        <button class="button refreshButton" onClick={() => { this.fetchData() }}>Refresh</button>
                    </div>
                    <ReactTable ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                        data={data}
                        columns={columns}
                        pivotBy={["name"]}
                        sortable={true}
                        filterable
                        defaultFilterMethod={(filter, row) =>
                            String(row[filter.id]) === filter.value}
                    />
                    <AddChangeItemComponent fetchData={() => { this.fetchData() }} />
                </div>
            </div>
        );
    }

};
