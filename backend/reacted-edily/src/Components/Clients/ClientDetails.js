import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import { updateClient, createClient } from './ClientService';
import Toast from 'react-bootstrap/Toast';
import 'bootstrap/dist/css/bootstrap.min.css';

function ClientDetails() {
    const [isLoading, setLoading] = useState(true); // Loading state
    const [client, setClient] = useState({});
    const { id } = useParams();
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("success");
    const [title, setTitle] = useState();
    const [message, setMessage] = useState();
    let navigate = useNavigate();
    useEffect(() => { // useEffect hook
        if (id != 0) {
            setTimeout(async () => { // simulate a delay
                const response = await fetch('/api/clients/' + id);
                const data = await response.json();
                setClient(data);
                setLoading(false);
            }, 3000);
        } else {
            setLoading(false);
        }
    }, []);

    function renderToast() {
        return (
            <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide bg={variant}
                animation={true} style={{ 'position': 'absolute', 'right': '0', 'opacity': '0.7'}}>
                    <Toast.Header closeButton={true}>
                        <strong className="me-auto">{title }</strong>
                    </Toast.Header>
                    <Toast.Body>{message}</Toast.Body>
                </Toast>
        )
    }

    if (isLoading) {
        return (
            <div> loading data ... </div>
        )
    }

    function showToast(title, message, variant) {
        setTitle(title);
        setMessage(message);
        setVariant(variant);
        setShow(true);
    }

    async function updateOrCreateClient() {
        let data;
        if (id == 0) {
            data = await createClient(client);
        } else {
            data = await updateClient(client);
        }
        if (data.status == 200) {

            showToast("Updated", "Client Updated !", "success");
            navigate("/client-list", { replace: true });
        } else {
            showToast("Error", "Client Not Updated !", "danger");
        }
    }

    function onClientChange(event) {
        let field = event.target.name
        let value = event.target.value
        setClient(current => {
            return {
                ...current,
                [field]: value
            }
        })
    }
    function onClientAddressChange(event) {
        let field = event.target.name
        let value = event.target.value
        let address = client.Address
        if (!address) {
            address = {}
        }
        address[field] = value
        setClient(current => {
            return {
                ...current,
                Address: address
            }
        })
    }
    return (
        <div>
            {renderToast()}
            <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
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
                                value={client.Name}
                                onChange={onClientChange}
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                Customer #
                            </label>
                            <input
                                type="text"
                                name="CustomerNumber"
                                id="customerNumber"
                                autoComplete="family-name"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={client.CustomerNumber}
                                onChange={onClientChange}
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                Payment Method
                            </label>
                            <input
                                type="text"
                                name="PaymentMethod"
                                id="paymentMethod"
                                autoComplete="email"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={client.PaymentMethod}
                                onChange={onClientChange}
                            />
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                Address Name
                            </label>
                            <input
                                type="text"
                                name="Name"
                                id="street-address"
                                autoComplete="street-address"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={client.Address?.Name}
                                onChange={onClientAddressChange}
                            />
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                Street address
                            </label>
                            <input
                                type="text"
                                name="Street"
                                id="street-address"
                                autoComplete="street-address"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={client.Address?.Street}
                                onChange={onClientAddressChange}
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
                                value={client.Address?.City}
                                onChange={onClientAddressChange}
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
                                value={client.Address?.State}
                                onChange={onClientAddressChange}
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
                                value={client.Address?.Zip}
                                onChange={onClientAddressChange}
                            />
                        </div>
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
                            value={client.Address?.Country}
                            onChange={onClientAddressChange}
                        >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Mexico</option>
                            <option>France</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                        style={{ 'marginRight': '15px' }}
                        className="text-left inline-flex justify-center py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >

                        <Link to="/client-list"> Back To Clients</Link>
                    </button>
                    <button onClick={updateOrCreateClient}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
    

export default ClientDetails;