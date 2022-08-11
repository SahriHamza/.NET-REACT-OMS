import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toast from 'react-bootstrap/Toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Stepper, Step, StepLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { getWarehouses } from '../Warehouses/WarehouseService';
import { getClients } from '../Clients/ClientService';
import { getProducts } from '../Products/ProductService';
import { createOrder, updateOrder } from './OrderService';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';

function OrderDetails() {
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true); // Loading state
    const [order, setOrder] = useState({Status: 0, ShipPrice: 0, Taxes: 0});
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [warehouses, setWarehouses] = useState(null);
    const [clients, setClients] = useState(null);
    const [products, setProducts] = useState(null);
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("success");
    const [title, setTitle] = useState();
    const [message, setMessage] = useState();
    let navigate = useNavigate();

    const statusMap = [{
        value: 0, label: 'New'
    },
        { value: 1, label: 'Processing' },
        { value: 2, label: 'Shipped' },
        { value: 3, label: 'Invoiced' }
    ]

    useEffect(() => { // useEffect hook
        getWarehouses().then(response => {
            setWarehouses(response);
        }).catch(err => {
            console.log(err);
        });

        getClients().then(response => {
            setClients(response);
        }).catch(err => {
            console.log(err);
        });

        getProducts().then(response => {
            setProducts(response);
        }).catch(err => {
            console.log(err);
        });

        if (id != 0) {
            setTimeout(async () => { // simulate a delay
                const response = await fetch('/api/orders/' + id);
                const data = await response.json();
                data["Client"] = data["Client"]["Id"];
                data["Warehouse"] = data["Warehouse"]["Id"];
                data["Date"] = data["Date"].split("T")[0];
                if (data["ShipDate"]) {
                    data["ShipDate"] = data["ShipDate"].split("T")[0];
                }
                data["Status"] = statusMap.find(status => status.label == data["Status"]).value;
                setOrder(data);
                setLoading(false);
            }, 3000);
        } else {
            setLoading(false);
        }
    }, []);

    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        cleanOrderNUmbers();
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    function cleanOrderNUmbers() {
        let lines = order.OrderLines
        if (lines) {
            lines.map((row) => {
                row.Quantity = eval(row.Quantity)
            })
        }
        
        let taxes = eval(parseFloat(order.Taxes).toFixed(2))
        let shipPrice = eval(parseFloat(order.ShipPrice).toFixed(2))
        setOrder(current => {
            return {
                ...current,
                OrderLines: lines,
                Taxes: taxes,
                ShipPrice: shipPrice
            }
        })
    }

    function showToast(title, message, variant) {
        setTitle(title);
        setMessage(message);
        setVariant(variant);
        setShow(true);
    }

    function renderToast() {
        return (
            <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide bg={variant}
                animation={true} style={{ 'position': 'absolute', 'right': '0', 'opacity': '0.7' }}>
                <Toast.Header closeButton={true}>
                    <strong className="me-auto">{title}</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        )
    }

    async function createOrUpdateOrder (history) {
        cleanOrderNUmbers(order);

        let data;
        if (id == 0) {
            data = await createOrder(order);
        } else {
            data = await updateOrder(order);
        }
        if (data.status == 200) {
            
            showToast("Updated", "Order Updated !", "success");
            navigate("/order-list", { replace: true });
        } else {
            showToast("Error", "Order Not Updated !", "danger");
        }
    };

    if (isLoading) {
        return (
            <div class="row">
                <div className="col-4">

                </div>
                <div className="col-4">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
                <div className="col-4">

                </div>
            </div>
        )
    }

    function handleChange(event) {
        
        let field = event.target.name
        let value = event.target.value
        setOrder(current => {
            return {
                ...current,
                [field]: value
            }
        })
    }

    function renderClientPicker() {
        if (!clients) {
            return (<div>loading clients</div>)
        }
        return (
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel>Pick a Client</InputLabel>
                    <Select
                        id="client"
                        name="Client"
                        value={order.Client}
                        onChange={handleChange}
                    >
                        {
                            clients.map((client) => (
                                <MenuItem value={client.Id}>{client.Name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Box>
        )
    }

    function renderWarehousePicker() {
        if (!warehouses) {
            return (<div>loading warehouses</div>)
        }
        return (
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel>Pick a Warehouse</InputLabel>
                    <Select
                        id="warehouse"
                        name="Warehouse"
                        value={order.Warehouse}
                        onChange={handleChange}
                    >
                        {
                            warehouses.map((warehouse) => (
                                <MenuItem value={warehouse.Id}>{warehouse.Name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Box>
        )
    }

    function renderShipPrice() {
        return parseFloat(order.ShipPrice).toFixed(2)
    }

    function renderOrderInformationForm() {
        if (!order.Warehouse) {
            return renderAlert("Order Warehouse is Required. Please go back to Step 1");
        } else if (!order.Client) {
            return renderAlert("Order Client is Required. Please go back to Step 2");
        } else {
            return (
                <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">

                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Reference *
                                </label>
                                <input
                                    type="text"
                                    name="Reference"
                                    id="name"
                                    autoComplete="given-name"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={order.Reference}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">

                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="Date"
                                    id="date"
                                    autoComplete="given-name"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={order.Date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">

                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Vendor
                                </label>
                                <input
                                    type="text"
                                    name="Vendor"
                                    id="vendor"
                                    autoComplete="given-name"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={order.Vendor}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">

                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Estimated Ship Date
                                </label>
                                <input
                                    type="date"
                                    name="ShipDate"
                                    id="shipDate"
                                    autoComplete="given-name"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={order.ShipDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">

                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Carrier
                                </label>
                                <input
                                    type="text"
                                    name="ShipVia"
                                    id="vendor"
                                    autoComplete="given-name"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={order.ShipVia}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">

                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Shipping Method
                                </label>
                                <input
                                    type="text"
                                    name="ShipMethod"
                                    id="vendor"
                                    autoComplete="given-name"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={order.ShipMethod}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">

                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Shipping Price
                                </label>
                                <input
                                    type="number"
                                    name="ShipPrice"
                                    id="vendor"
                                    autoComplete="given-name"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={order.ShipPrice}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">

                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Tax Amount
                                </label>
                                <input
                                    type="number"
                                    name="Taxes"
                                    id="vendor"
                                    autoComplete="given-name"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={order.Taxes}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                )
        }
    }

    function handleShipAddressChange(event) {
        let field = event.target.name
        let value = event.target.value
        let address = order.ShipAddress
        if (!address) {
            address = {}
        }
        address[field] = value
        setOrder(current => {
            return {
                ...current,
                ShipAddress: address
            }
        })
    }

    function handleBillAddressChange(event) {
        let field = event.target.name
        let value = event.target.value
        let address = order.BillAddress
        if (!address) {
            address = {}
        }
        address[field] = value
        setOrder(current => {
            return {
                ...current,
                BillAddress: address
            }
        })
    }

    function renderOrderAddressesForm(){
        if (!order.Reference || order.Reference.trim() == '') {
            return renderAlert("Order Reference is Required. Please go back to Step 3");
        } else if (!order.Date) {
            return renderAlert("Order Date is Required. Please go back to Step 3");
        } else {
            return (
                <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="row">
                            <div className="col-6">
                                <label htmlFor="first-name" className="block text-lg font-medium text-gray-700">
                                    Shipping Address *
                                </label>
                                <br />
                                <div className="grid grid-cols-4 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="Name"
                                            id="name"
                                            autoComplete="given-name"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.ShipAddress?.Name}
                                            onChange={handleShipAddressChange}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                            Street
                                        </label>
                                        <input
                                            type="text"
                                            name="Street"
                                            id="name"
                                            autoComplete="given-name"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.ShipAddress?.Street}
                                            onChange={handleShipAddressChange}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="City"
                                            id="city"
                                            autoComplete="address-level2"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.ShipAddress?.City}
                                            onChange={handleShipAddressChange}
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                            State / Province
                                        </label>
                                        <input
                                            type="text"
                                            name="State"
                                            id="region"
                                            autoComplete="address-level1"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.ShipAddress?.State}
                                            onChange={handleShipAddressChange}
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                                            ZIP / Postal code
                                        </label>
                                        <input
                                            type="text"
                                            name="Zip"
                                            id="postal-code"
                                            autoComplete="postal-code"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.ShipAddress?.Zip}
                                            onChange={handleShipAddressChange}
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                            Country
                                        </label>
                                        <select
                                            id="country"
                                            name="Country"
                                            autoComplete="country-name"
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={order.ShipAddress?.Country}
                                            onChange={handleShipAddressChange}
                                        >
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>Mexico</option>
                                            <option>France</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <label htmlFor="first-name" className="block text-lg font-medium text-gray-700">
                                    Billing Address *
                                </label>
                                <br />
                                <div className="grid grid-cols-4 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="Name"
                                            id="name"
                                            autoComplete="given-name"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.BillAddress?.Name}
                                            onChange={handleBillAddressChange}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                            Street
                                        </label>
                                        <input
                                            type="text"
                                            name="Street"
                                            id="name"
                                            autoComplete="given-name"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.BillAddress?.Street}
                                            onChange={handleBillAddressChange}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="City"
                                            id="city"
                                            autoComplete="address-level2"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.BillAddress?.City}
                                            onChange={handleBillAddressChange}
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                            State / Province
                                        </label>
                                        <input
                                            type="text"
                                            name="State"
                                            id="region"
                                            autoComplete="address-level1"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.BillAddress?.State}
                                            onChange={handleBillAddressChange}
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                                            ZIP / Postal code
                                        </label>
                                        <input
                                            type="text"
                                            name="Zip"
                                            id="postal-code"
                                            autoComplete="postal-code"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            value={order.BillAddress?.Zip}
                                            onChange={handleBillAddressChange}
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                            Country
                                        </label>
                                        <select
                                            id="country"
                                            name="Country"
                                            autoComplete="country-name"
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={order.BillAddress?.Country}
                                            onChange={handleBillAddressChange}
                                        >
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>Mexico</option>
                                            <option>France</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                </div>
            )
        }
    }

    function renderAlert(message) {
        return (<Alert severity="error"> {message}</Alert>)
    }

    function addItem() {
        if (!order.OrderLines) {
            order.OrderLines = [];
        }
        let lines = order.OrderLines
        lines.push({Quantity: 1})
        setOrder(current => {
            return {
                ...current,
                OrderLines: lines
            }
        })

    }
    function handleLineItemQuantityChange(event, index){
        let value = event.target.value
        let lines = order.OrderLines
        lines[index]["Quantity"] = value
        let subTotal = calculateSubTotal(lines)
        setOrder(current => {
            return {
                ...current,
                SubTotal: subTotal,
                Total: subTotal + eval(order.Taxes) + eval(order.ShipPrice),
                OrderLines: lines
            }
        })
    }
    function handleLineItemChange(event, index) {
        let lines = order.OrderLines
        let field = event.target.name
        let value = event.target.value
        let product = products.find(product => product.Id == value)

        lines[index][field] = value
        lines[index]["Description"] = product.Description
        lines[index]["UnitPrice"] = product.Price
        let subTotal = calculateSubTotal(lines)
        setOrder(current => {
            return {
                ...current,
                OrderLines: lines,
                SubTotal: subTotal,
                Total: subTotal + eval(order.Taxes) + eval(order.ShipPrice)
            }
        })
    }
    function renderProductRef(row, index) {
        return (
            <div>
                <FormControl fullWidth>
                    <InputLabel>Pick a Product</InputLabel>
                    <Select
                        id="product"
                        name="ProductId"
                        value={row.ProductId}
                        onChange={(e) => handleLineItemChange(e, index)}
                    >
                        {
                            products.map((product) => (
                                <MenuItem value={product.Id}>{product.Reference}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
        )
    }

    function totalPrice(row) {
        if (!row.Quantity || !row.UnitPrice) {
            return 0;
        }
        return row.Quantity * row.UnitPrice
    }

    function deleteLineItem(index) {
        let lines = order.OrderLines;
        lines.splice(index, 1);
        let subTotal = calculateSubTotal(lines)
        setOrder(current => {
            return {
                ...current,
                SubTotal: subTotal,
                Total: subTotal + eval(order.Taxes) + eval(order.ShipPrice),
                OrderLines: lines
            }
        })
    }

    function calculateSubTotal(lines) {
        let subtotal = 0
        lines.map(line => {
            if (line.Quantity && line.UnitPrice) {
                subtotal += line.Quantity * line.UnitPrice
            }
        })
        return subtotal;
    }
    

    function renderOrderItemsForm() {
        if (!order.ShipAddress || !order.BillAddress) {
            return renderAlert("Ship Address & Bill Address are required");
        } else {
            return (
                <div className="row">
                    <div className="row">
                        <Button variant="contained" onClick={addItem}>Add Item</Button>
                    </div>
                    <div className="row">
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Product Ref</TableCell>
                                    <TableCell align="center">Line Description</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="center">Unit Price</TableCell>
                                    <TableCell align="center">Total Price</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.OrderLines?.map((row, i) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {renderProductRef(row, i)}
                                        </TableCell>
                                        <TableCell align="center">{row.Description}</TableCell>
                                        <TableCell align="center">
                                            <input  type="number" value={row.Quantity} onChange={(e) => handleLineItemQuantityChange(e, i)} />
                                        </TableCell>
                                        <TableCell align="center">{row.UnitPrice}</TableCell>
                                        <TableCell align="center">
                                            {totalPrice(row)}
                                        </TableCell>
                                        <TableCell align="center"><button onClick={(e) => deleteLineItem(i)} ><DeleteIcon  /></button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </div>

                </div>
            )
        }
    }

    function renderOrderLines() {
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
                                {products.find(product => product.Id == row.ProductId).Reference}
                            </TableCell>
                            <TableCell align="center">{row.Description}</TableCell>
                            <TableCell align="center">
                                {row.Quantity}
                            </TableCell>
                            <TableCell align="center">{row.UnitPrice}</TableCell>
                            <TableCell align="center">
                                {totalPrice(row)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    function renderOrderSummary() {
        let lines = order.OrderLines
        if (!lines || lines.length == 0) {
            return renderAlert("at Least one OrderLine is required. Go Back to Step 5");
        }
        let requiredFields = lines.some(line => {
            if (!line.ProductId) {
                return true
            } else {
                return false
            }
        })
        if (requiredFields) {
            return renderAlert("one of the item lines is missing required information. Go Back to Step 5");
        }
        return (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Order Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Review Order Information.</p>
                </div>
                <div className="border-t border-gray-200">
                        <div className="bg-gray-50 row" style={{ 'margin': '25px' }} >
                            <div className="row" >
                                <div className="col-4">
                                    <dt className="text-sm font-medium text-gray-500">Order Reference </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.Reference}</dd>
                                </div>
                                <div className="col-4">
                                    <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.Date }</dd>
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
                                    <TextField value={renderAddress(order.ShipAddress)} multiline />
                                </div>
                                <div className="col-2">
                                    <dt className="text-sm font-medium text-gray-500">Billing Addresses </dt>
                                    <TextField value={renderAddress(order.BillAddress)} multiline />
                                </div>
                                <div className="col-8">
                                    {renderOrderLines()}
                                </div>
                            </div>
                        </div>
                        <div hidden className="bg-gray-50 row" style={{ 'margin': '25px' }} >
                            <dt className="text-lg font-medium text-gray-500">Order Lines </dt>
                            <div className="row">
                                {renderOrderLines()}
                            </div>
                        </div>
                        
                </div>
            </div>
        )

    }

    function renderAddress(address) {
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


    const steps = ['Select a Warehouse', 'Select a Client', 'Order Information', 'Order Addresses', 'Order Items', 'Summary'];

    function renderStep() {
        if (activeStep === 0) {
            return renderWarehousePicker();
        } else if (activeStep === 1) {
            return renderClientPicker();
        } else if (activeStep === 2) {
            return renderOrderInformationForm();
        } else if (activeStep === 3) {
            return renderOrderAddressesForm();
        } else if (activeStep === 4) {
            return renderOrderItemsForm();
        } else if (activeStep === 5) {
            return renderOrderSummary();
        } else {
            return (<div> Something Went Wrong.</div>)
        }
    }
    return (
        <Box>
            {renderToast()}
            <br />
            <hr />
            <Stepper alternativeLabel activeStep={activeStep} >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Alert severity="success">
                        <FormControl fullWidth>
                            <InputLabel>Pick the Status of the Order</InputLabel>
                            <Select
                                id="status"
                                name="Status"
                                value={order.Status}
                                onChange={handleChange}
                            >
                                {
                                    statusMap.map((status) => (
                                        <MenuItem value={status.value}>{status.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Alert >
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />

                        <Button onClick={() => createOrUpdateOrder()}>Save Order</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <hr />
                    {renderStep()}
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}

                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    )
    
}

export default OrderDetails;