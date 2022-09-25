/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://bi-ll-test.celestialstudio.net/',
      changeOrigin: true,
    }),
  );
};
