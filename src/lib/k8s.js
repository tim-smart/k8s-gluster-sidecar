import Client from 'kubernetes-client';
import * as env from './env.js';
import fs from 'fs';

const podLabels = labelStringToObject(env.podLabels);

const readToken = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token');
const k8s = new Client({
  url: `https://${process.env.KUBERNETES_SERVICE_HOST}`,
  auth: {
    bearer: readToken.toString(),
  },
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

export function getGlusterPods() {
  return new Promise(function(resolve, reject) {
    k8s.ns(env.myNamespace).po.matchLabels(podLabels).get(function(err, pods) {
      if (err) {
        return reject(err);
      }
      resolve(pods);
    });
  });
};

export function getGlusterPodsStream() {
  const stream = k8s.ns(env.myNamespace).pods.matchLabel(podLabels).get({ qs: { watch: true } });

  stream.on('error', function(err) {
    throw err;
  });

  return stream;
};
