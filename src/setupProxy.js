const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/new-api',
        createProxyMiddleware({
            target: 'https://api.oistigmes.com',
            changeOrigin: true,
            followRedirects: true,
            pathRewrite: {
                '^/': '/api/'
            }
        })
    );
    app.use(
        '/legacy-api',
        createProxyMiddleware({
            target: 'https://oistigmes.com',
            changeOrigin: true,
            followRedirects: true,
            pathRewrite: {
                '^/': '/api/'
            }
        })
    );
};
