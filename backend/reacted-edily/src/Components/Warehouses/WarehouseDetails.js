import React, { Component, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { createWarehouse, updateWarehouse } from './WarehouseService';
import Toast from 'react-bootstrap/Toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

function WArehouseDetails() {
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true); // Loading state
    const [warehouse, setWarehouse] = useState({});
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("success");
    const [title, setTitle] = useState();
    const [message, setMessage] = useState();
    let navigate = useNavigate();

    useEffect(() => { // useEffect hook
        if (id != 0) {
            setTimeout(async () => { // simulate a delay
                const response = await fetch('/api/warehouses/' + id);
                const data = await response.json();
                setWarehouse(data);
                setLoading(false);
            }, 3000);
        } else {
            setLoading(false);
        }
    }, []);


    if (isLoading) {
        return (
            <div> loading data ... </div>
        )
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

    function onWarehouseChange(event) {
        let field = event.target.name
        let value = event.target.value
        setWarehouse(current => {
            return {
                ...current,
                [field]: value
            }
        })
    }

    function showToast(title, message, variant) {
        setTitle(title);
        setMessage(message);
        setVariant(variant);
        setShow(true);
    }

    async function updateOrCreateWarehouse() {
        let data;
        if (id == 0) {
            data = await createWarehouse(warehouse);
        } else {
            data = await updateWarehouse(warehouse);
        }
        if (data.status == 200) {

            showToast("Updated", "Warehouse Updated !", "success");
            navigate("/warehouse-list", { replace: true });
        } else {
            showToast("Error", "Warehouse Not Updated !", "danger");
        }
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
                                value={warehouse.Name}
                                onChange={onWarehouseChange}
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">

                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="text"
                                name="Phone"
                                id="name"
                                autoComplete="given-name"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={warehouse.Phone}
                                onChange={onWarehouseChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                        style={{ 'marginRight': '15px' }}
                        className="text-left inline-flex justify-center py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >

                        <Link to="/warehouse-list"> Back To Warehouses</Link>
                    </button>
                    <button onClick={updateOrCreateWarehouse}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>)
}

export default WArehouseDetails;