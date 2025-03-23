import { defineEventHandler } from 'h3'
import { createProxyMiddleware } from 'http-proxy-middleware';


const apiProxyMiddleware = createProxyMiddleware({
    target: 'ws://localhost:8080',
    changeOrigin: true,
    ws: true,
    logger: console
}) 

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  await new Promise((resolve, reject) => {
    const next = (err?: unknown) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    }
    apiProxyMiddleware(event.node.req, event.node.res, next)
  })
})
