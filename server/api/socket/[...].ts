import { defineWebSocketHandler } from 'h3'
import WebSocket from 'ws'

const backendUrl = process.env.WSS_TARGET_URL || 'ws://localhost:5550'

export default defineWebSocketHandler({
  async upgrade(request) {
    const cookie = request.headers.get('cookie') || ''
    if (!cookie) {
      throw new Response('Unauthorized', { status: 401 })
    }
    try {
      const session = await $fetch('/api/_auth/session', { headers: { cookie } })
      if (!session?.user) {
        throw new Response('Unauthorized', { status: 401 })
      }
    } catch (e) {
      if (e instanceof Response) throw e
      throw new Response('Unauthorized', { status: 401 })
    }
  },

  open(peer) {
    const rawUrl = typeof peer.request.url === 'string' ? peer.request.url : '/'
    const path = rawUrl.startsWith('http') ? new URL(rawUrl).pathname : rawUrl
    const backend = new WebSocket(backendUrl + path)

    ;(peer.context as Record<string, unknown>).backend = backend

    backend.onopen = () => {}
    backend.onmessage = (event: WebSocket.MessageEvent) => {
      try { peer.send(typeof event.data === 'string' ? event.data : event.data.toString()) } catch {}
    }
    backend.onerror = () => {
      try { peer.close(1011, 'Backend proxy error') } catch {}
    }
    backend.onclose = () => {
      try { peer.close() } catch {}
    }
  },

  message(peer, message) {
    const backend = (peer.context as Record<string, unknown>).backend as WebSocket | undefined
    if (backend?.readyState === WebSocket.OPEN) {
      backend.send(message.text())
    }
  },

  close(peer) {
    const backend = (peer.context as Record<string, unknown>).backend as WebSocket | undefined
    if (backend) {
      try { backend.close(1000, 'Client closed') } catch {}
    }
  },

  error(peer) {
    const backend = (peer.context as Record<string, unknown>).backend as WebSocket | undefined
    if (backend) {
      try { backend.close(1011, 'Client error') } catch {}
    }
  }
})
