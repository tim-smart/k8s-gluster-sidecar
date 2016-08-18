import Client from 'node-kubernetes-client';
import fs from 'fs';
import * as env from './env.js';

const readToken = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token');
const k8s = new Client({
  host: `${env.masterHost}:443`,
  protocol: 'https',
  version: 'v1',
  token: readToken.toString(),
});
export default k8s;

export function labelStringToObject(labels) {
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

export function getPodsThatMatchLabels(labels) {
  return new Promise(function(resolve, reject) {
    k8s.pods.get(function(err, results) {
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

        if (!labels) {
          matchingPods.push(pod);
        } else if (podContainsLabels(pod, labels)) {
          matchingPods.push(pod);
        }
      }

      resolve(matchingPods);
    });
  });
}
