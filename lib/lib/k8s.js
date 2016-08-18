'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.labelStringToObject = labelStringToObject;
exports.getGlusterPods = getGlusterPods;
exports.getGlusterPodsStream = getGlusterPodsStream;

var _kubernetesClient = require('kubernetes-client');

var _kubernetesClient2 = _interopRequireDefault(_kubernetesClient);

var _env = require('./env.js');

var env = _interopRequireWildcard(_env);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const podLabels = labelStringToObject(env.podLabels);

const readToken = _fs2.default.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token');
const k8s = new _kubernetesClient2.default({
  url: `https://${ process.env.KUBERNETES_SERVICE_HOST }`
});
exports.default = k8s;
function labelStringToObject(labels) {
  labels = labels.split(',');
  const ret = {};

  for (let label of labels) {
    label = label.split('=');
    ret[label[0]] = label[1];
  }

  return ret;
}

function getGlusterPods() {
  return new Promise(function (resolve, reject) {
    k8s.ns(env.myNamespace).pods.matchLabel(podLabels).get(function (err, pods) {
      if (err) {
        return reject(err);
      }
      resolve(pods);
    });
  });
};

function getGlusterPodsStream() {
  const stream = k8s.ns(env.myNamespace).pods.matchLabel(podLabels).get({ qs: { watch: true } });

  stream.on('error', function (err) {
    throw err;
  });

  return stream;
};