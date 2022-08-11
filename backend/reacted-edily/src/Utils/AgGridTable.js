import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

class AgGridTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            data_endpoint: props.endpoint,
            columnDefs: props.columns,
            title: props.title,
            add_create_button: props.create ? props.create : false,
            create_component_path: props.create_path
        };
        this.getData();
        this.renderCreateButton = this.renderCreateButton.bind(this);
    }

    async getData() {
        const response = await fetch(this.state.data_endpoint);
        const data = await response.json();
        this.setState({ data: data, loading: false });
    }

    renderCreateButton() {
        if (this.state.add_create_button) {
            return (
                <Button variant="outline-primary" style={{ 'float': 'right' }}>
                    <Link to={this.state.create_component_path }>
                        New
                    </Link>
                </Button>
            )
        } else {
            return (<div></div>)
        }
    }

    render() {
        return (
            <div>
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <div class="row">
                            <div class="col-6" >
                                <h1 className="text-3xl font-bold text-gray-900">{this.state.title}</h1>
                            </div>
                            <div class="col-6" >
                                {this.renderCreateButton()}
                            </div>
                        </div>
                        
                    </div>
                </header>
                <main>
                    <div>
                        <div>
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 ag-theme-alpine"  >
                                <AgGridReact
                                    rowData={this.state.data}
                                    columnDefs={this.state.columnDefs}
                                    loading={this.state.loading}>
                                </AgGridReact>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            )
        
    }
}

export default AgGridTable;