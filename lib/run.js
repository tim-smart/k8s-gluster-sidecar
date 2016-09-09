'use strict';

let main = (() => {
  var _ref = _asyncToGenerator(function* () {

    while (true) {
      const pods = yield k8s.getPodsThatMatchLabels(podLabels);

      if (!pods.length) {
        (0, _sleep2.default)(1000);
        continue;
      }
      break;
    }

    while (true) {
      // Poll every 10s
      yield (0, _sleep2.default)(10000);

      const pods = yield k8s.getPodsThatMatchLabels(podLabels);
      if (pods.length <= 1) {
        continue;
      }

      // Make sure we have probed all the peers
      const podIps = pods.map(function (pod) {
        return pod.status.podIP;
      });

      try {
        const nonPeers = yield gluster.notYetPeers(podIps);

        for (const podIp of nonPeers) {
          if (podIp === env.myIp) {
            continue;
          }
          yield gluster.run('peer', 'probe', podIp);
        }
      } catch (err) {
        console.error(err.stack);
        continue;
      }

      // try {
      //   const peerIps = await gluster.peerStatusIps();
      //   if (!peerIps.length) {
      //     continue;
      //   }
      //   console.error(peerIps);

      //   const nonBrickIps = await gluster.notYetBrickIps(env.volumeName, peerIps);
      //   if (nonBrickIps.length) {
      //     const nonBricks = nonBrickIps.map(ip => `${ip}:${env.brickPath}`);
      //     await gluster.run('volume', 'add-brick', env.volumeName, ...nonBricks);
      //   }
      // } catch (err) {
      //   console.error(err.stack);
      // }
    }
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

var _k8s = require('./lib/k8s.js');

var k8s = _interopRequireWildcard(_k8s);

var _gluster = require('./lib/gluster.js');

var gluster = _interopRequireWildcard(_gluster);

var _env = require('./lib/env.js');

var env = _interopRequireWildcard(_env);

var _sleep = require('./lib/sleep.js');

var _sleep2 = _interopRequireDefault(_sleep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const podLabels = k8s.labelStringToObject(env.podLabels);

;

main().catch(function (err) {
  console.error(err.stack);
});