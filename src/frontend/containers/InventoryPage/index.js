import React from 'react';
import _ from 'lodash'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';
import axios from 'axios'
import AddChangeItemComponent from '@/components/AddChangeItemComponent';

const workspaceID = "5c64def057910030016ba7c1";

function Item(id, name, expiration, quantity) {
    this.id = id;
    this.name = name;
    this.expiration = expiration;
    this.quantity = quantity;
}

// const requestData = () => {
//     return new Promise((resolve, reject) => {
//         axios.get(`/api/workspaces/${workspaceID}/inventory`, {
//
//         }).then(res => {
//             resolve(parseData(res.data));
//             console.log(res.data);
//         });
//     })
// };

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

function getInitialData() {
// Get the items from the server
// Hard-coding 5c64def057910030016ba7c1 for now
    axios.get(`/api/workspaces/${workspaceID}/inventory`, {}).then(res => {
        let serverData = parseData(res.data);
        console.log(serverData);
        return serverData;
    });
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
        axios.get(`/api/workspaces/${workspaceID}/inventory`, {}).then(res => {
            let serverData = parseData(res.data);
            this.setState({ data: serverData });
            console.log(serverData);
        });
    }

    handleDayClick(day) {

    }

    render() {
        const { data } = this.state;
        const columns = [
            {
                Header: "Name",
                accessor: "name"
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
                }
            },
            {
                Header: "Quantity",
                accessor: "quantity",
                aggregate: vals => _.sum(vals),
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
            <div>
                <GenericNavigationBar/>
                <div class="Content">
                    <h1>Inventory</h1>
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