import * as ssh from './ssh.js';
import sleep from './sleep.js';
import { dns } from 'mz';

export async function runMany(...allArgs) {
  const client = await ssh.createClient();
  const results = [];

  for (const args of allArgs) {
    console.error('RUN MANY', 'gluster', ...args);
    results.push(await client.exec('gluster', args));
  }

  if (results.length === 1) {
    return results[0];
  }

  return results;
};

export async function run(...args) {
  const client = await ssh.createClient();
  console.error('RUN', 'gluster', ...args);
  return await client.exec('gluster', args);
}

export async function peerStatus() {
  return await parsePeerStatus(await run('peer', 'status'));
}

export async function peerStatusIps() {
  return (
    await parsePeerStatus(await run('peer', 'status'))
  ).map(peer => peer.Hostname);
}

export async function notYetPeers(podIps) {
  const status = await peerStatus();
  const peerIps = status.map(peer => peer.Hostname);
  const ret = [];

  for (const podIp of podIps) {
    if (peerIps.indexOf(podIp) === -1) {
      ret.push(podIp);
    }
  }

  return ret;
}

export async function volumeInfoBrickIps(volume) {
  return await parseVolumeInfoBrickIps(await run('volume', 'info', volume));
}

export async function notYetBrickIps(volume, podIps) {
  const brickIps = await volumeInfoBrickIps(volume);
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
}

async function parsePeerStatus(status) {
  const peers = status.split('\nHostname: ');
  const ret = [];

  for (let peer of peers) {
    const peerObj = {};

    peer = `Hostname: ${peer}`;
    peer = peer.split('\n');

    for (let keyVal of peer) {
      keyVal = keyVal.split(': ');
      if (keyVal.length !== 2) {
        continue;
      }
      peerObj[keyVal[0].trim()] = keyVal[1].trim();
    }

    if (peerObj.Hostname && peerObj.Uuid && peerObj.State) {
      peerObj.Hostname = (await dns.lookup(peerObj.Hostname))[0];
      ret.push(peerObj);
    }
  }

  return ret;
}

async function parseVolumeInfoBrickIps(info) {
  const brickHosts = [];
  info.replace(/Brick\d+: (.+):/g, function(all, host) {
    brickHosts.push(host);
  });

  const brickIps = [];
  for (const host of brickHosts) {
    brickIps.push((await dns.lookup(host))[0]);
  }

  return brickIps;
}
