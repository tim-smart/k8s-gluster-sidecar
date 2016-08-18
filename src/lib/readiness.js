import http from 'http';

export function start() {
  const server = http.createServer(function(req, res) {
    res.end('OK');
  });
  server.listen(8080);
  return server;
};
