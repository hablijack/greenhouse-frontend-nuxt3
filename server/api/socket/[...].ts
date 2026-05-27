import { defineEventHandler } from 'h3'
import { createProxyMiddleware } from 'http-proxy-middleware';

const getWebSocketProxyMiddleware = () => createProxyMiddleware({
  target: process.env.WSS_TARGET_URL || 'ws://localhost:5550',
  changeOrigin: true,
  ws: true,
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  const config = useRuntimeConfig();
  
  await new Promise((resolve, reject) => {
    const next = (err?: unknown) => {
      if (err || !session.user) {
        reject(createError({ statusCode: 401, statusMessage: 'Unauthorized' }))
      } else {
        resolve(true)
      }
    }
    getWebSocketProxyMiddleware()(event.node.req, event.node.res, next)
  })
})
