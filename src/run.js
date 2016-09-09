import * as readiness from './lib/readiness.js';
import * as k8s from './lib/k8s.js';
import * as gluster from './lib/gluster.js';
import * as env from './lib/env.js';
import sleep from './lib/sleep.js';

const podLabels = k8s.labelStringToObject(env.podLabels);

async function main() {

  while (true) {
    const pods = await k8s.getPodsThatMatchLabels(podLabels);

    if (!pods.length) {
      sleep(1000);
      continue;
    }
    break;
  }

  readiness.start();

  while (true) {
    // Poll every 10s
    await sleep(10000);

    const pods = await k8s.getPodsThatMatchLabels(podLabels);
    if (pods.length <= 1) {
      continue;
    }

    // Make sure we have probed all the peers
    const podIps = pods.map(pod => pod.status.podIP);

    try {
      const nonPeers = await gluster.notYetPeers(podIps);

      for (const podIp of nonPeers) {
        if (podIp === env.myIp) {
          continue;
        }
        await gluster.run('peer', 'probe', podIp);
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
};

main().catch(function(err) {
  console.error(err.stack);
});
