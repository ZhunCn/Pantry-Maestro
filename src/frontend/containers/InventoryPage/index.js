import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from "react-router-dom";
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

export default class Inventory extends React.Component {
    constructor(props) {
        super(props);
        // Temporary data set
        this.state = {
            data: [
                {
                    "_id:": "123456789",
                    "name": "Starburst",
                    "quantities": {
                        "01/01/2019": 20,
                        "02/15/2019": 12,
                        "03/19/2019": 23
                    }
                },
                {
                    "_id:": "987654321",
                    "name": "Ramen",
                    "quantities": {
                        "01/07/2019": 2,
                        "05/23/2019": 11,
                        "06/24/2019": 9
                    }
                }
            ]
        }
    }
    render() {
        const { data } = this.state;
        const columns = [{
            Header: 'Name',
            accessor: 'name'
        }, {
            Header: 'Total Quantity',
            id: 'quantity',
            accessor: d => {
                let totalQuantity = 0;
                for (const [key, value] of Object.entries(d.quantities)) {
                    totalQuantity+=value;
                }
                return totalQuantity
            }
        },{
            Header: 'Earliest Expiration Date',
            id: 'expiration',
            accessor: d => {
                let dates = [];
                for (const [key] of Object.entries(d.quantities)) {
                    dates.push(key);
                }
                let orderedDates = dates.sort(function(a,b) {
                    return Date.parse(a) > Date.parse(b);
                });
                return orderedDates[0]
            }
        }];

        return (
          <div>
              <GenericNavigationBar/>
              <div class="Content">
                  <h1>Inventory</h1>
                  <ReactTable
                    data={data}
                    columns={columns}/>
              </div>
          </div>
        );
    }

};