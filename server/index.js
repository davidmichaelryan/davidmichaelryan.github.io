import http from 'http';
import { waitForDebugger } from 'inspector';

function handleRequest(req, res) {
  res.writeHead(200);
  res.end('Hello, World!');
}

export default function startServer() {
  const server = http.createServer(handleRequest);

  server.listen(8000);
  // eslint-disable-next-line
  console.log('listening on http://localhost:8000/');


  return server;
}
