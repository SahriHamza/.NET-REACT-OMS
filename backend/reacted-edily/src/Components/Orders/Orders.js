import React, { Component } from 'react';
import AgGridTable from '../../Utils/AgGridTable';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { getProducts } from '../Products/ProductService';
import { getOrder } from './OrderService';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            products: [],
            order: null
        };
        getProducts().then(data => {
            this.state.products = data
        }).catch(err => {
            console.log(err);
        })
        this.columns = [
            { field: 'Reference', headerName: 'Reference', resizable: true },
            {
                field: 'Date', headerName: 'Date', resizable: true, cellRenderer: (params) => {
                    if (params.value) {
                        return params.value.split("T")[0];
                    }
                }
            },
            { field: 'Status', headerName: 'Status', resizable: true },
            {
                field: 'Client.Name', headerName: 'Client', resizable: true
            },
            {
                field: 'Total', headerName: 'Total', resizable: true, cellRenderer: (params) => {
                    if (params.value) {
                        return parseFloat(params.value).toFixed(2);
                    }
                }
            },
            {
                field: 'ShipDate', headerName: 'Ship Date', resizable: true, cellRenderer: (params) => {
                    if (params.value) {
                        return params.value.split("T")[0];
                    }
                } },
            { field: 'Vendor', headerName: 'Vendor', resizable: true },
            {
                field: 'Id', headerName: '', resizable: true, cellRenderer: (params) => {
                    if (params.value) {
                        const link = document.createElement("button");
                        link.className = "btn btn-outline-success rounded-pill";
                        link.innerText = 'Edit';
                        return (
                            <div className="row">
                                <div className="col-6">
                                    <a href={"order/" + params.value}>
                                        <button className="rounded-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            style={{ 'width': '50%' }} >
                                            Edit
                                        </button>
                                    </a>
                                </div>
                                <div className="col-6">
                                    <button className="rounded-md text-sm font-medium rounded-lg text-white bg-indigo-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => this.showModal(params.value)}> Check Details </button>
                                </div>
                            </div>
                        );
                    }
                }
            }
        ];
    }

    showModal(orderId) {
        getOrder(orderId).then(data => {
            data["Date"] = data["Date"].split("T")[0];
            if (data["ShipDate"]) {
                data["ShipDate"] = data["ShipDate"].split("T")[0];
            }
            this.setState({order: data, open : true})
        }).catch(err => {
            console.log(err);
        })
    }

    renderAddress(address) {
        let str = '';
        if (address) {
            if (address.Name) {
                str += 'Name : ' + address.Name
            }
            if (address.Street) {
                str += '\n Street : ' + address.Street
            }
            if (address.City) {
                str += '\n City : ' + address.City
            }
            if (address.State) {
                str += '\n State / Region : ' + address.State
            }
            if (address.Zip) {
                str += '\n Postal Code : ' + address.Zip
            }
            if (address.Country) {
                str += '\n Country : ' + address.Country
            }
        }
        return str;
    }

    totalPrice(row) {
    if (!row.Quantity || !row.UnitPrice) {
        return 0;
    }
    return row.Quantity * row.UnitPrice
}

    renderOrderLines(order) {
        
        return (
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><strong>Product Ref</strong></TableCell>
                        <TableCell align="center"><strong>Line Description</strong></TableCell>
                        <TableCell align="center"><strong>Quantity</strong></TableCell>
                        <TableCell align="center"><strong>Unit Price</strong></TableCell>
                        <TableCell align="center"><strong>Total Price</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {order.OrderLines?.map((row, i) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {this.state.products.find(product => product.Id == row.ProductId)?.Reference}
                            </TableCell>
                            <TableCell align="center">{row.Description}</TableCell>
                            <TableCell align="center">
                                {row.Quantity}
                            </TableCell>
                            <TableCell align="center">{row.UnitPrice}</TableCell>
                            <TableCell align="center">
                                {this.totalPrice(row)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    renderOrderSummary(order) {
        if (!order) {
            return (<div> Loading Data ... </div>)
        }
        return (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Order Information</h3>
                </div>
                <div className="border-t border-gray-200">
                    <div className="bg-gray-50 row" style={{ 'margin': '25px' }} >
                        <div className="row" >
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order Client </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.Client.Name}</dd>
                            </div>
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order Warehouse</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.Warehouse.Name}</dd>
                            </div>
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.Status}</dd>
                            </div>
                        </div>
                        <hr />
                        <div className="row" >
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order Reference </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.Reference}</dd>
                            </div>
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.Date}</dd>
                            </div>
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order Ship Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.ShipDate}</dd>
                            </div>
                        </div>
                        <hr />
                        <div className="row" >
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order Vendor </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.Vendor}</dd>
                            </div>
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Carrier</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.ShipVia}</dd>
                            </div>
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Shipping Method</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.ShipMethod}</dd>
                            </div>
                        </div>
                        <hr />
                        <div className="row" >
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order Total Tax </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.Taxes}</dd>
                            </div>
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order Shipping Price</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.ShipPrice}</dd>
                            </div>
                            <div className="col-4">
                                <dt className="text-sm font-medium text-gray-500">Order SubTotal</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.SubTotal}</dd>
                            </div>
                        </div>

                    </div>
                    <div className="bg-gray-50 row" style={{ 'margin': '25px' }} >
                        <dt className="text-lg font-medium text-gray-500">Order Addresses & Lines</dt>
                        <div className="row">
                            <div className="col-2">
                                <dt className="text-sm font-medium text-gray-500">Shipping Addresse </dt>
                                <TextField value={this.renderAddress(order.ShipAddress)} multiline />
                            </div>
                            <div className="col-2">
                                <dt className="text-sm font-medium text-gray-500">Billing Addresses </dt>
                                <TextField value={this.renderAddress(order.BillAddress)} multiline />
                            </div>
                            <div className="col-8">
                                {this.renderOrderLines(order)}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    render() {
        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        };

        return (
            <div>
                
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={this.state.open}
                        onClose={() => this.setState({ open: false })}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                <Fade in={this.state.open}>
                    <Box sx={style}>
                            {this.renderOrderSummary(this.state.order) }
                    </Box>
                </Fade>
                </Modal>
                <AgGridTable title="Orders" columns={this.columns} endpoint="/api/orders" create={true} create_path="/order/0" />
            </div>
        )
    }
}
export default Orders;