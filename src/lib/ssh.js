import SshClient from 'node-ssh';

export async function createClient() {
  const ssh = new SshClient();

  while (true) {
    try {
      await ssh.connect({
        host: 'localhost',
        username: 'root',
        password: 'password',
      });
      break;
    } catch(err) {
      console.error(err.stack);
      continue;
    }
  }

  return ssh;
}
