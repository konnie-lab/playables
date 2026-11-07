import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.startsWith('/playables/')) pathname = pathname.slice('/playables'.length);
    let filename = path.resolve(root, '.' + pathname);
    const relative = path.relative(root, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(part => part.startsWith('.'))) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
    const body = await readFile(filename);
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

let port = 4178;
server.on('error', error => {
  if (error.code === 'EADDRINUSE' && port < 65535) {
    console.log(`Port ${port} is busy, trying ${port + 1}...`);
    server.listen(++port, '127.0.0.1');
    return;
  }
  console.error(`Preview failed: ${error.message}`);
  process.exitCode = 1;
});
server.once('listening', () => console.log(`Portfolio: http://127.0.0.1:${server.address().port}/playables/`));
server.listen(port, '127.0.0.1');
