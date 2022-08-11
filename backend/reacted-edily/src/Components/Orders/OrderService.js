async function _updateOrCreateOrder(httpRequest, data) {
    let request = {
        method: httpRequest,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api/orders', request);
    return response
}

export async function updateOrder(data) {
    return await _updateOrCreateOrder('PUT', data)
}

export async function createOrder(data) {
    return await _updateOrCreateOrder('POST', data)
}

export async function getOrders() {
    const response = await fetch('/api/orders');
    return await response.json();
}

export async function getOrder(id) {
    const response = await fetch('/api/orders/' + id);
    return await response.json();
}