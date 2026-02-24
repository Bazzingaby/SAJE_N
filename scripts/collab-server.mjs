#!/usr/bin/env node
/**
 * Yjs WebSocket collaboration server (S2.2).
 * Listens on port 1234 (or COLLAB_PORT) and broadcasts messages per room.
 * Use with y-websocket client: ws://localhost:1234
 *
 * Run: node scripts/collab-server.mjs
 * Or: pnpm run collab:server (if added to package.json)
 */
import { WebSocketServer } from 'ws';

const PORT = Number(process.env.COLLAB_PORT) || 1234;
const wss = new WebSocketServer({ port: PORT });

const rooms = new Map(); // roomId -> Set<WebSocket>

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const roomId = url.pathname.slice(1) || 'default';
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  rooms.get(roomId).add(ws);

  ws.on('message', (data) => {
    const set = rooms.get(roomId);
    if (!set) return;
    set.forEach((client) => {
      if (client !== ws && client.readyState === 1) client.send(data);
    });
  });

  ws.on('close', () => {
    const set = rooms.get(roomId);
    if (set) {
      set.delete(ws);
      if (set.size === 0) rooms.delete(roomId);
    }
  });
});

wss.on('listening', () => {
  console.log(`Yjs collab server listening on ws://localhost:${PORT}`);
});
