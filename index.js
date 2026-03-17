import Fastify from 'fastify';
import { wisp } from '@mercuryworkshop/wisp-js/server';
import path from 'path';

const fastify = Fastify({ logger: true });

// this is the "magic" part that handles the proxy requests
fastify.addContentTypeParser('application/octet-stream', { parseAs: 'buffer' }, (req, body, done) => {
  done(null, body);
});

// the wisp endpoint - this is what scramjet talks to!
fastify.all('/wisp/*', (req, reply) => {
  wisp.handler(req.raw, req.raw.socket);
});

// health check so render knows your server is alive 🔋
fastify.get('/', async (request, reply) => {
  return { status: 'running', message: 'jaydexy engine is online 🚀' };
});

const start = async () => {
  try {
    // render uses port 10000 by default, don't change this!
    await fastify.listen({ port: 10000, host: '0.0.0.0' });
    console.log("engine is purring on port 10000... 🏎️💨");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
