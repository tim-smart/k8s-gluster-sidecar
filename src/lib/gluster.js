import * as ssh from './ssh.js';

export async function runMany(...allArgs) {
  const client = await ssh.createClient();
  const results = [];

  for (const args of allArgs) {
    results.push(await client.exec('gluster', args));
  }

  if (results.length === 1) {
    return results[0];
  }

  return results;
};

export async function run(...args) {
  const client = await ssh.createClient();
  return await client.exec('gluster', args);
}
