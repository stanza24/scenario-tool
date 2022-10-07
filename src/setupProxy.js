const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    'https://koronapay.com/*',
    createProxyMiddleware({
      target: `https://koronapay.com/`,
      changeOrigin: true,
    })
  );
};
