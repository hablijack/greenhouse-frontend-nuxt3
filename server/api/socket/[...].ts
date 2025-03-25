import { defineEventHandler } from 'h3'
import { createProxyMiddleware } from 'http-proxy-middleware';

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const config = useRuntimeConfig();

  if (!config.public || !config.public.wssBaseUrl) {
    throw new Error('Missing `runtimeConfig.apiBaseUrl` configuration.');
  }
  const apiProxyMiddleware = createProxyMiddleware({
    target: config.public.wssBaseUrl,
    changeOrigin: true,
    ws: true,
    logger: console
}) 

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
