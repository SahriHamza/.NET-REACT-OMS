import React, { Component } from 'react';
import AgGridTable from '../../Utils/AgGridTable';

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.columns = [
            { field: 'Id', headerName: 'ID', resizable: true },
            { field: 'Reference', headerName: 'SKU', resizable: true },
            { field: 'Title', headerName: 'Title', resizable: true },
            { field: 'Price', headerName: 'Price', resizable: true },
            {
                field: 'Active', headerName: 'Is Active ?', resizable: true, cellRenderer: (params) => {
                    return params.value ? 'Yes' : 'No'
                    
                }
            },
            {
                field: 'Id', headerName: '', resizable: false, cellRenderer: (params) => {
                    if (params.value) {
                        const link = document.createElement("button");
                        link.className = "btn btn-outline-success rounded-pill";
                        link.innerText = 'Details';
                        return (
                            <a href={"product/" + params.value}>
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
        return (<AgGridTable title="Products" columns={this.columns} endpoint="/api/products" create={true} create_path="/product/0" />)
    }
}
export default Products;