import React, { Component } from 'react';
import AgGridTable from '../../Utils/AgGridTable';

class Warehouses extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.columns = [
            { field: 'Id', headerName: 'ID', resizable: true },
            { field: 'Name', headerName: 'Name', resizable: true },
            { field: 'Phone', headerName: 'Phone', resizable: true },
            {
                field: 'Id', headerName: '', resizable: false, cellRenderer: (params) => {
                    if (params.value) {
                        const link = document.createElement("button");
                        link.className = "btn btn-outline-success rounded-pill";
                        link.innerText = 'Details';
                        return (
                            <a href={"warehouse/" + params.value}>
                                <button className="rounded-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    style={{ 'width': '50%' }} >
                                    Details
                                </button>
                            </a>
                        );
                    }
                }
            }
        ];
    }

    render() {
        return (<AgGridTable title="Warehouses" columns={this.columns} endpoint="/api/warehouses" create={true} create_path="/warehouse/0" />)
    }
}
export default Warehouses;