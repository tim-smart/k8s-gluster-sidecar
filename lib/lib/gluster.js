'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.runMany = undefined;

let runMany = exports.runMany = (() => {
  var _ref = _asyncToGenerator(function* () {
    const client = yield ssh.createClient();
    const results = [];

    for (var _len = arguments.length, allArgs = Array(_len), _key = 0; _key < _len; _key++) {
      allArgs[_key] = arguments[_key];
    }

    for (const args of allArgs) {
      results.push((yield client.exec('gluster', args)));
    }

    if (results.length === 1) {
      return results[0];
    }

    return results;
  });

  return function runMany() {
    return _ref.apply(this, arguments);
  };
})();

let run = exports.run = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    const client = yield ssh.createClient();

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return yield client.exec('gluster', args);
  });

  return function run() {
    return _ref2.apply(this, arguments);
  };
})();

var _ssh = require('./ssh.js');

var ssh = _interopRequireWildcard(_ssh);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

;