import SshClient from 'node-ssh';
import sleep from './sleep.js';

export async function createClient() {
  const ssh = new SshClient();

  while (true) {
    try {
      await ssh.connect({
        host: 'localhost',
        port: process.GLUSTER_SSH_PORT || 2222,
        username: 'root',
        password: 'password',
      });
      break;
    } catch(err) {
      console.error(err.stack);
      await sleep(5000);
      continue;
    }
  }

  return ssh;
}
