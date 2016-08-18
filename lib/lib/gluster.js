'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notYetBrickIps = exports.volumeInfoBrickIps = exports.notYetPeers = exports.peerStatus = exports.run = exports.runMany = undefined;

let runMany = exports.runMany = (() => {
  var _ref = _asyncToGenerator(function* () {
    const client = yield ssh.createClient();
    const results = [];

    for (var _len = arguments.length, allArgs = Array(_len), _key = 0; _key < _len; _key++) {
      allArgs[_key] = arguments[_key];
    }

    for (const args of allArgs) {
      console.error('RUN MANY', 'gluster', ...args);
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

    console.error('RUN', 'gluster', ...args);
    return yield client.exec('gluster', args);
  });

  return function run() {
    return _ref2.apply(this, arguments);
  };
})();

let peerStatus = exports.peerStatus = (() => {
  var _ref3 = _asyncToGenerator(function* () {
    return yield parsePeerStatus((yield run('peer', 'status')));
  });

  return function peerStatus() {
    return _ref3.apply(this, arguments);
  };
})();

let notYetPeers = exports.notYetPeers = (() => {
  var _ref4 = _asyncToGenerator(function* (podIps) {
    const status = yield peerStatus();
    const peerIps = status.map(function (peer) {
      return peer.Hostname;
    });
    const ret = [];

    for (const podIp of podIps) {
      if (peerIps.indexOf(podIp) === -1) {
        ret.push(podIp);
      }
    }

    return ret;
  });

  return function notYetPeers(_x) {
    return _ref4.apply(this, arguments);
  };
})();

let volumeInfoBrickIps = exports.volumeInfoBrickIps = (() => {
  var _ref5 = _asyncToGenerator(function* (volume) {
    return yield parseVolumeInfoBrickIps((yield run('volume', 'info', volume)));
  });

  return function volumeInfoBrickIps(_x2) {
    return _ref5.apply(this, arguments);
  };
})();

let notYetBrickIps = exports.notYetBrickIps = (() => {
  var _ref6 = _asyncToGenerator(function* (volume, podIps) {
    const brickIps = yield volumeInfoBrickIps(volume);
    if (!brickIps.length) {
      return [];
    }

    const ret = [];
    for (const podIp of podIps) {
      if (brickIps.indexOf(podIp) === -1) {
        ret.push(podIp);
      }
    }

    return ret;
  });

  return function notYetBrickIps(_x3, _x4) {
    return _ref6.apply(this, arguments);
  };
})();

let parsePeerStatus = (() => {
  var _ref7 = _asyncToGenerator(function* (status) {
    const peers = status.split('\nHostname: ');
    const ret = [];

    for (let peer of peers) {
      const peerObj = {};

      peer = `Hostname: ${ peer }`;
      peer = peer.split('\n');

      for (let keyVal of peer) {
        keyVal = keyVal.split(': ');
        if (keyVal.length !== 2) {
          continue;
        }
        peerObj[keyVal[0].trim()] = keyVal[1].trim();
      }

      if (peerObj.Hostname && peerObj.Uuid && peerObj.State) {
        peerObj.Hostname = (yield _mz.dns.lookup(peerObj.Hostname))[0];
        ret.push(peerObj);
      }
    }

    return ret;
  });

  return function parsePeerStatus(_x5) {
    return _ref7.apply(this, arguments);
  };
})();

let parseVolumeInfoBrickIps = (() => {
  var _ref8 = _asyncToGenerator(function* (info) {
    const brickHosts = [];
    info.replace(/Brick\d+: (.+):/g, function (all, host) {
      brickHosts.push(host);
    });

    const brickIps = [];
    for (const host of brickHosts) {
      brickIps.push((yield _mz.dns.lookup(host))[0]);
    }

    return brickIps;
  });

  return function parseVolumeInfoBrickIps(_x6) {
    return _ref8.apply(this, arguments);
  };
})();

var _ssh = require('./ssh.js');

var ssh = _interopRequireWildcard(_ssh);

var _sleep = require('./sleep.js');

var _sleep2 = _interopRequireDefault(_sleep);

var _mz = require('mz');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

;