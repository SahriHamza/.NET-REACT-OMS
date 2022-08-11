async function _updateOrCreateWarehouse(httpRequest, data) {
    let request = {
        method: httpRequest,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api/warehouses', request);
    return response
}

export async function updateWarehouse(data) {
    return await _updateOrCreateWarehouse('PUT', data)
}

export async function createWarehouse(data) {
    return await _updateOrCreateWarehouse('POST', data)
}

export async function getWarehouses() {
    const response = await fetch('/api/warehouses');
    return await response.json();
}