import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from "react-router-dom";
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
let parsedData = [
    {
        name: "Starburst",
        expiration: "12/01/2019",
        quantity: 20
    },
    {
        name: "Starburst",
        expiration: "02/15/2019",
        quantity: 12
    }, {
        name: "Starburst",
        expiration: "03/19/2019",
        quantity: 23
    }, {
        name: "Ramen",
        expiration: "01/07/2019",
        quantity: 2
    }, {
        name: "Ramen",
        expiration: "05/23/2019",
        quantity: 11
    }, {
        name: "Ramen",
        expiration: "06/24/2019",
        quantity: 9
    }, {
        name: "Ramen",
        expiration: "07/12/2019",
        quantity:14
    }
]

export default class Inventory extends React.Component {
    constructor(props) {
        super(props);
        // Temporary data set
        this.state = {
            data: parsedData
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
            },
            {
                Header: "Earliest Expiration Date",
                id: "expiration",
                aggregate: vals => vals.sort()[0],
                accessor: d => {
                    let dates = Array.from(d.expiration);
                    let orderedDates = dates.sort(function (a, b) {
                        return Date.parse(a) > Date.parse(b);
                    });
                    return orderedDates;
                }
            }
        ];


        return (
            <div>
                <div class="Content">
                    <h1>Inventory</h1>
                    <ReactTable data={data} columns={columns} pivotBy={["name"]}/>
                </div>
            </div>
        );
    }

};