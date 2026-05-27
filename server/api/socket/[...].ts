import { defineWebSocketHandler, unsealSession } from 'h3'
import WebSocket from 'ws'

const backendUrl = process.env.WSS_TARGET_URL || 'ws://localhost:5550'
const sessionPassword = process.env.NUXT_SESSION_PASSWORD || process.env.SESSION_PASSWORD || ''

export default defineWebSocketHandler({
  async upgrade(request) {
    const cookie = request.headers.get('cookie') || ''
    console.log('[WS] upgrade attempt:', request.url?.slice?.(0, 60))
    if (!cookie) {
      console.log('[WS] no cookie')
      throw new Response('Unauthorized', { status: 401 })
    }
    if (!sessionPassword) {
      console.log('[WS] no session password configured')
    }
    try {
      const cookies: Record<string, string> = {}
      cookie.split(';').forEach(c => {
        const i = c.indexOf('=')
        if (i > 0) cookies[c.slice(0, i).trim()] = c.slice(i + 1).trim()
      })
      const sealed = cookies['h3']
      if (!sealed) {
        console.log('[WS] no session cookie found, cookies keys:', Object.keys(cookies))
        console.log('[WS] raw cookie:', cookie.slice(0, 200))
        throw new Response('Unauthorized', { status: 401 })
      }
      const unsealed = await unsealSession(null as any, {
        password: sessionPassword,
        name: 'h3',
      }, sealed)
      const user = (unsealed as any)?.data?.user
      if (!user) {
        console.log('[WS] no user in session')
        throw new Response('Unauthorized', { status: 401 })
      }
      console.log('[WS] upgrade authorized for:', user.name || user.email)
    } catch (e: unknown) {
      if (e instanceof Response) throw e
      const msg = e instanceof Error ? e.message : String(e)
      console.log('[WS] session validation error:', msg)
      throw new Response('Unauthorized', { status: 401 })
    }
  },

  open(peer) {
    const rawUrl = typeof peer.request.url === 'string' ? peer.request.url : '/'
    const path = rawUrl.startsWith('http') ? new URL(rawUrl).pathname : rawUrl
    const backendUrlWithPath = backendUrl + path
    console.log('[WS] open, connecting backend:', backendUrlWithPath)

    const backend = new WebSocket(backendUrlWithPath)

    ;(peer.context as Record<string, unknown>).backend = backend

    backend.onopen = () => {
      console.log('[WS] backend connected')
    }
    backend.onmessage = (event: WebSocket.MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? event.data : event.data.toString()
        peer.send(data)
      } catch (e) {
        console.log('[WS] error forwarding to peer:', e)
      }
    }
    backend.onerror = (err) => {
      console.log('[WS] backend error:', err?.message || err?.type || 'unknown')
      try { peer.close(1011, 'Backend proxy error') } catch {}
    }
    backend.onclose = (ev) => {
      console.log('[WS] backend closed:', ev?.code, ev?.reason)
      try { peer.close() } catch {}
    }
  },

  message(peer, message) {
    const backend = (peer.context as Record<string, unknown>).backend as WebSocket | undefined
    if (backend?.readyState === WebSocket.OPEN) {
      backend.send(message.text())
    } else {
      console.log('[WS] cannot forward message, backend not open')
    }
  },

  close(peer) {
    console.log('[WS] client closed')
    const backend = (peer.context as Record<string, unknown>).backend as WebSocket | undefined
    if (backend) {
      try { backend.close(1000, 'Client closed') } catch {}
    }
  },

  error(peer, error) {
    console.log('[WS] peer error:', error?.message || error)
    const backend = (peer.context as Record<string, unknown>).backend as WebSocket | undefined
    if (backend) {
      try { backend.close(1011, 'Client error') } catch {}
    }
  }
})
