'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start() {
  const server = _http2.default.createServer(function (req, res) {
    res.end('OK');
  });
  server.listen(8080);
  return server;
};