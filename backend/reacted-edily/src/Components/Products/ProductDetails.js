import React, { Component, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { createProduct, updateProduct } from './ProductService';
import Toast from 'react-bootstrap/Toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

function ProductDetails() {
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true); // Loading state
    const [product, setProduct] = useState({});
    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("success");
    const [title, setTitle] = useState();
    const [message, setMessage] = useState();
    let navigate = useNavigate();

    
    useEffect(() => { // useEffect hook
        if (id != 0) {
            setTimeout(async () => { // simulate a delay
                const response = await fetch('/api/products/' + id);
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            }, 3000);
        } else {
            setLoading(false);
        }
    }, []);
    

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
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

    function onProductChange(event) {
        let field = event.target.name
        let value = event.target.value
        if (field == "Active") {
            value = event.target.checked
        }
        setProduct(current => {
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

    async function updateOrCreateProduct() {
        let data;
        console.log(product)
        if (id == 0) {
            data = await createProduct(product);
        } else {
            data = await updateProduct(product);
        }
        if (data.status == 200) {

            showToast("Updated", "Product Updated !", "success");
            navigate("/product-list", { replace: true });
        } else {
            showToast("Error", "Product Not Updated !", "danger");
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
                                SKU
                            </label>
                            <input
                                type="text"
                                name="Reference"
                                id="name"
                                autoComplete="given-name"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={product.Reference}
                                onChange={onProductChange}
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">

                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                name="Title"
                                id="name"
                                autoComplete="given-name"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={product.Title}
                                onChange={onProductChange}
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">

                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <ToggleButton
                                className="mb-2"
                                id="toggle-check"
                                type="checkbox"
                                variant="outline-primary"
                                name= "Active"
                                checked={product.Active}
                                value={true}
                                onChange={onProductChange}
                            >
                                {product.Active ? 'Active' : 'Inactive' }
                            </ToggleButton>
                        </div>
                        <div className="col-span-10 sm:col-span-10">

                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                type="text"
                                name="Description"
                                rows="2"
                                id="name"
                                autoComplete="given-name"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={product.Description}
                                onChange={onProductChange}
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">

                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                Price
                            </label>
                            <input
                                type="number"
                                name="Price"
                                id="name"
                                autoComplete="given-name"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={product.Price}
                                onChange={onProductChange}
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">

                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                Cost
                            </label>
                            <input
                                type="number"
                                name="Cost"
                                id="name"
                                autoComplete="given-name"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={product.Cost}
                                onChange={onProductChange}
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">

                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                UPC
                            </label>
                            <input
                                type="text"
                                name="upc"
                                id="name"
                                autoComplete="given-name"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={product.UPC}
                                onChange={onProductChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                        style={{ 'marginRight': '15px' }}
                        className="text-left inline-flex justify-center py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >

                        <Link to="/product-list"> Back To Products</Link>
                    </button>
                    <button onClick={updateOrCreateProduct}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>)
}

export default ProductDetails;