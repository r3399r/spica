/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://bunnybill-test.celestialstudio.net/',
      changeOrigin: true,
    }),
  );
};
