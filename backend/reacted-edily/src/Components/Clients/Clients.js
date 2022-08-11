import React, { Component } from 'react';
import AgGridTable from '../../Utils/AgGridTable';

class Clients extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {
        const columnDefs = [
            { field: 'Id', headerName: 'ID', resizable: true },
            { field: 'Name', headerName: 'Name', resizable: true },
            { field: 'CustomerNumber', headerName: 'Customer #', resizable: true },
            { field: 'PaymentMethod', headerName: 'Payment Method', resizable: true },
            {
                field: 'Id', headerName: '', resizable: false, cellRenderer: (params) => {
                    if (params.value) {
                        const link = document.createElement("button");
                        link.className = "btn btn-outline-success rounded-pill";
                        link.innerText = 'Details';
                        return (
                            <a href={"client/" + params.value}>
                                <button  className="rounded-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    style={{'width': '50%'} } >
                                    Details
                                </button>
                            </a>
                            );
                    }
                }
            }
        ];
        return (
            <AgGridTable title="Clients" columns={columnDefs} endpoint="/api/clients" create={true} create_path="/client/0" />
        )
    }
}
export default Clients;