const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/clients"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware('/api', {
        target: 'https://localhost:7087',
        changeOrigin: true,
        secure: false
        
    });

    app.use(appProxy);
};
