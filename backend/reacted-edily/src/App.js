import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from './Utils/NavBar';
import Orders from './Components/Orders/Orders';
import Products from './Components/Products/Products';
import Clients from './Components/Clients/Clients';
import Warehouses from './Components/Warehouses/Warehouses';
import WarehouseDetails from './Components/Warehouses/WarehouseDetails';
import ClientDetails from './Components/Clients/ClientDetails';
import ProductDetails from './Components/Products/ProductDetails';
import { useParams } from 'react-router-dom';
import OrderDetails from './Components/Orders/OrderDetails';

export default class App extends Component {
    static displayName = App.name;

    

    constructor(props) {
        super(props);
        const tokenJSON = JSON.parse(sessionStorage.getItem("token"));
        this.state = { forecasts: [], loading: true, token: tokenJSON?.token, setToken: this.propssetToken };
        this.setToken = this.setToken.bind(this);
        this.renderSingin = this.renderSingin.bind(this);
        this.renderApp = this.renderApp.bind(this);
        this.renderOrders = this.renderOrders.bind();
        this.renderWarehouses = this.renderWarehouses.bind(this);
    }

    componentDidMount() {
    }

    setToken() {
        this.setState({ token: 'hello' }, function () {
            sessionStorage.setItem('token', JSON.stringify({ token: 'hello' }));
        })
        
    }

    renderOrders() {
        return (
            <Orders />
            )
    }

    renderProducts() {
        return (
            <Products />
        )
    }

    renderClients() {
        return (
            <Clients />
        )
    }

    renderWarehouses() {
        return (
            <Warehouses />
            )
    }

    

    renderApp() {
        return (
            <Router>
                <div className="App">
                    <NavBar />
                    <Routes >
                        <Route path="/order-list" element={this.renderOrders()} />
                        <Route path="/product-list" element={this.renderProducts()} />
                        <Route path="/client-list" element={this.renderClients()} />
                        <Route path="/warehouse-list" element={this.renderWarehouses()} />
                        <Route exact path="/client/:id" element={<ClientDetails />} />
                        <Route exact path="/product/:id" element={<ProductDetails />} />
                        <Route exact path="/warehouse/:id" element={<WarehouseDetails />} />
                        <Route exact path="/order/:id" element={<OrderDetails />} />
                    </Routes>
                    
                </div>
            </Router>
        )
    }

    renderSingin() {
        return (
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <img className="mx-auto h-12 w-auto" src="https://lenet.com/wp-content/uploads/favicon.png" alt="Workflow" />
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to Edily</h2>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">
                        <input type="hidden" name="remember" value="true" />
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label for="email-address" className="sr-only">Email address</label>
                                    <input id="email-address" name="email" type="email" autocomplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                                </div>
                                <div>
                                    <label for="password" className="sr-only">Password</label>
                                    <input id="password" name="password" type="password" autocomplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                        <label for="remember-me" className="ml-2 block text-sm text-gray-900"> Remember me </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500"> Forgot your password? </a>
                                </div>
                            </div>

                            <div>
                                <button onClick={this.setToken} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                    Sign in
                                </button>
                            </div>
                    </form>
                </div>
            </div>
        )
    }

    static renderForecastsTable(forecasts) {
        return (
            <table classNameName='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
            : App.renderForecastsTable(this.state.forecasts);

        return (
            <div >
                <div hidden>
                    <h1 id="tabelLabel" >Weather forecast</h1>
                    <h1 classNameName="text-3xl font-bold underline">
                        Hello world!
                    </h1>
                    <span classNameName="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-pink-600 bg-pink-200 uppercase last:mr-0 mr-1">
                        pink
                    </span>
                    <p>This component demonstrates fetching data from the server.</p>
                    {contents}
                </div>

                <div >
                    {this.state.token ? this.renderApp() : this.renderSingin()}
                </div>
            </div>
        );
    }
}
