'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClient = undefined;

let createClient = exports.createClient = (() => {
  var _ref = _asyncToGenerator(function* () {
    const ssh = new _nodeSsh2.default();

    while (true) {
      try {
        yield ssh.connect({
          host: 'localhost',
          port: process.GLUSTER_SSH_PORT || 2222,
          username: 'root',
          password: 'password'
        });
        break;
      } catch (err) {
        console.error(err.stack);
        yield (0, _sleep2.default)(5000);
        continue;
      }
    }

    return ssh;
  });

  return function createClient() {
    return _ref.apply(this, arguments);
  };
})();

var _nodeSsh = require('node-ssh');

var _nodeSsh2 = _interopRequireDefault(_nodeSsh);

var _sleep = require('./sleep.js');

var _sleep2 = _interopRequireDefault(_sleep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }