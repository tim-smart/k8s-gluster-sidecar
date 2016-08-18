import readiness from './lib/readiness.js';
import * as k8s from './lib/k8s.js';
import * as gluster from './lib/gluster.js';

async function main() {
  const pods = await k8s.getGlusterPods();
  const status = await gluster.run('peer', 'status');

  if (pods.length === 1) {
    // We are the first pod alive
    console.error('FIRST', status);
  } else {
    // We are not the first pod
    console.error('NOT FIRST', status);
  }

  k8s.getGlusterPodsStream().on('data', function(pod) {
    console.error('New peer', pod);
  });

  readiness.start();
};

main().catch(function(err) {
  console.error(err.stack);
});
