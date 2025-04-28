import { defineEventHandler } from 'h3'
import { createProxyMiddleware } from 'http-proxy-middleware';


const apiProxyMiddleware = createProxyMiddleware({
  target: 'ws://192.168.178.162:5550',
  changeOrigin: true,
  ws: true,
  logger: console
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  const config = useRuntimeConfig();
  
  await new Promise((resolve, reject) => {
    const next = (err?: unknown) => {
      if (err || !session.user) {
        reject(err)
      } else {
        resolve(true)
      }
    }
    apiProxyMiddleware(event.node.req, event.node.res, next)
  })
})
