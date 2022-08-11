async function _updateOrCreateProduct(httpRequest, data) {
    let request = {
        method: httpRequest,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api/products', request);
    return response
}

export async function updateProduct(data) {
    return await _updateOrCreateProduct('PUT', data)
}

export async function createProduct(data) {
    return await _updateOrCreateProduct('POST', data)
}

export async function getProducts() {
    const response = await fetch('/api/products');
    return await response.json();
}