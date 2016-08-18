'use strict';

let main = (() => {
  var _ref = _asyncToGenerator(function* () {
    const pods = yield k8s.getGlusterPods();
    const status = yield gluster.run('peer', 'status');

    if (pods.length === 1) {
      // We are the first pod alive
      console.error('FIRST', status);
    } else {
      // We are not the first pod
      console.error('NOT FIRST', status);
    }

    k8s.getGlusterPodsStream().on('data', function (pod) {
      console.error('New peer', pod);
    });

    _readiness2.default.start();
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

var _readiness = require('./lib/readiness.js');

var _readiness2 = _interopRequireDefault(_readiness);

var _k8s = require('./lib/k8s.js');

var k8s = _interopRequireWildcard(_k8s);

var _gluster = require('./lib/gluster.js');

var gluster = _interopRequireWildcard(_gluster);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

;

main().catch(function (err) {
  throw err;
});