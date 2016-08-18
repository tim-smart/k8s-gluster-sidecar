'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.labelStringToObject = labelStringToObject;
exports.getGlusterPods = getGlusterPods;

var _nodeKubernetesClient = require('node-kubernetes-client');

var _nodeKubernetesClient2 = _interopRequireDefault(_nodeKubernetesClient);

var _env = require('./env.js');

var env = _interopRequireWildcard(_env);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const podLabels = labelStringToObject(env.podLabels);

const readToken = _fs2.default.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token');
const k8s = new _nodeKubernetesClient2.default({
  host: `${ env.masterHost }:443`,
  protocol: 'https',
  version: 'v1',
  token: readToken.toString()
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

function podContainsLabels(pod, labels) {
  if (!pod.metadata || !pod.metadata.labels) {
    return false;
  }

  for (const key in labels) {
    if (!pod.metadata.labels[key] || pod.metadata.labels[key] !== labels[key]) {
      return false;
    }
  }

  return true;
}

function getGlusterPods() {
  return new Promise(function (resolve, reject) {
    k8s.pods.get(function (err, results) {
      if (err) {
        return reject(err);
      }

      let pods = [];
      for (const result of results) {
        pods = pods.concat(result.items);
      }

      const matchingPods = [];
      for (const pod of pods) {
        if (pod.status.phase !== 'Running') {
          continue;
        }

        if (!podLabels) {
          matchingPods.push(pod);
        } else if (podContainsLabels(pod, podLabels)) {
          matchingPods.push(pod);
        }
      }

      resolve(matchingPods);
    });
  });
};