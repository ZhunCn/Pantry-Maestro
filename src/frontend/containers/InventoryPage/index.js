import React from 'react';
import _ from 'lodash'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

let tempData = [
    {
        "_id:": "123456789",
        name: "Starburst",
        quantities: {
            "01/01/2019": 20,
            "02/15/2019": 12,
            "03/19/2019": 23
        }
    },
    {
        "_id:": "987654321",
        name: "Ramen",
        quantities: {
            "01/07/2019": 2,
            "05/23/2019": 11,
            "06/24/2019": 9
        }
    }
]
function Item(name, expiration, quantity) {
    this.name = name;
    this.expiration = expiration;
    this.quantity = quantity;
}
function parseData(tempData) {
    let parsedData = [];
    for (let i = 0; i < tempData.length; i++) {
        for (let j = 0; j < Object.entries(tempData[1].quantities).length; j++) {
            let tempItem = new Item(tempData[i].name,
                Object.entries(tempData[i].quantities)[j][0],
                Object.entries(tempData[i].quantities)[j][1])
            parsedData.push(tempItem)
        }
    }
    return parsedData
}

export default class Inventory extends React.Component {
    constructor(props) {
        super(props);
        // Temporary data set
        this.state = {
            data: parseData(tempData)
        }
    }
    render() {
        const {data} = this.state;
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
                    return dates.sort(function (a, b) {
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
                    <ReactTable data={data} columns={columns} pivotBy={["name"]}/>
                </div>
            </div>
        );
    }

};