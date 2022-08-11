export async function getClientData(id){
    const response = await fetch('/api/clients/' + id);
    const data = await response.json();
    console.log(data)
    return data
}

async function _updateOrCreateClient(httpRequest, data) {
    let request = {
        method: httpRequest,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api/clients', request);
    return response
}


export async function updateClient(data) {
    return await _updateOrCreateClient('PUT', data)
}

export async function createClient(data) {
    return await _updateOrCreateClient('POST', data)
}

export async function getClients() {
    const response = await fetch('/api/clients');
    return await response.json();
}