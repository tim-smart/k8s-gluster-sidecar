import * as readiness from './lib/readiness.js';
import * as k8s from './lib/k8s.js';
import * as gluster from './lib/gluster.js';
import * as env from './lib/env.js';
import sleep from './lib/sleep.js';

async function main() {
  let leader = false;
  let pods = [];
  while (true) {
    pods = await k8s.getGlusterPods();

    if (!pods.length) {
      sleep(1000);
      continue;
    } else if (pods[0].status.podIP === env.myIp) {
      leader = true;
    }
    break;
  }

  readiness.start();

  while (true) {
    await sleep(5000);
    const pods = await k8s.getGlusterPods();
    if (pods.length <= 1) {
      continue;
    }

    // Make sure we have probed all the peers
    const podIps = pods.map(pod => pod.status.podIP);
    const nonPeers = await gluster.notYetPeers(podIps);

    for (const podIp of nonPeers) {
      if (podIp === env.myIp) {
        continue;
      }

      try {
        await gluster.run('peer', 'probe', podIp);
      } catch(err) {
        console.error(err.stack);
        break;
      }
    }

    const nonBrickIps = await gluster.notYetBrickIps(env.volumeName, podIps);
    const nonBricks = nonBrickIps.map(ip => `${ip}:${env.brickPath}`);

    try {
      await gluster.run('volume', 'add-brick', env.volumeName, ...nonBricks);
    } catch (err) {
      console.error(err.stack);
      break;
    }
  }
};

main().catch(function(err) {
  console.error(err.stack);
});
