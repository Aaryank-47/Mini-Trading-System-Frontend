import { getAccessToken } from '../services/apiClient';

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const localWsBase = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`;
const WS_BASE = import.meta.env.VITE_WS_BASE_URL || (isLocal ? localWsBase : 'wss://mini-trading-system-backend.onrender.com');

class WebSocketManager {
  constructor() {
    this.ws = null
    this.userId = null
    this.listeners = new Map()
    this.subscriptions = new Set()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 15
    this.baseReconnectDelay = 1000
    this.maxReconnectDelay = 30000
    this.state = 'DISCONNECTED'
    this.reconnectTimer = null
  }

  connect(userId) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) && this.userId === userId) {
      return
    }

    this.disconnect()
    this.userId = userId
    this.state = 'CONNECTING'

    try {
      const token = getAccessToken();
      const wsUrl = token ? `${WS_BASE}/ws/${userId}?token=${token}` : `${WS_BASE}/ws/${userId}`;
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log(`[WS] Connected for user ${userId}`)
        this.reconnectAttempts = 0
        this.state = 'CONNECTED'
        this._emit('connection', { status: 'connected' })

        // Restore subscriptions
        this.subscriptions.forEach(channel => {
          this.ws.send(JSON.stringify({ action: 'subscribe', channel }))
        })
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const normalized = data && typeof data === 'object' && data.event
            ? { ...(data.data || {}), event: data.event, timestamp: data.timestamp }
            : data

          this._emit(normalized.event || 'message', normalized)
          this._emit('message', normalized)

          if (normalized.event === 'ping' && this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ event: 'pong', timestamp: new Date().toISOString() }))
          }
        } catch (e) {
          console.error('[WS] Parse error:', e)
        }
      }

      this.ws.onclose = (event) => {
        console.log(`[WS] Disconnected (code: ${event.code})`)
        this.state = 'DISCONNECTED'
        this._emit('connection', { status: 'disconnected', code: event.code })

        // 1008 is Policy Violation (used for auth failures like expired token)
        if (event.code === 1008) {
          console.error('[WS] Authentication failed (token expired/invalid). Stopping reconnect attempts.')
          return
        }

        if (this.userId && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++
          this.state = 'RECONNECTING'
          
          const backoff = Math.min(this.maxReconnectDelay, this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1))
          const jitter = Math.random() * 0.3 * backoff // up to 30% jitter
          const delay = backoff + jitter

          console.log(`[WS] Reconnecting in ${Math.round(delay)}ms (attempt ${this.reconnectAttempts})`)
          this.reconnectTimer = setTimeout(() => {
            if (this.state === 'RECONNECTING') {
              this.connect(this.userId)
            }
          }, delay)
        }
      }

      this.ws.onerror = (error) => {
        console.error('[WS] Error:', error)
        this.state = 'DISCONNECTED'
        this._emit('connection', { status: 'error' })
      }
    } catch (e) {
      console.error('[WS] Connection failed:', e)
      this.state = 'DISCONNECTED'
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.onclose = null
      this.ws.close()
      this.ws = null
    }
    this.userId = null
    this.reconnectAttempts = 0
    this.state = 'DISCONNECTED'
  }

  subscribe(channel) {
    this.subscriptions.add(channel)
    if (this.isConnected) {
      this.ws.send(JSON.stringify({ action: 'subscribe', channel }))
    }
  }

  unsubscribe(channel) {
    this.subscriptions.delete(channel)
    if (this.isConnected) {
      this.ws.send(JSON.stringify({ action: 'unsubscribe', channel }))
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
    return () => this.off(event, callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback)
    }
  }

  _emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try { cb(data) } catch (e) { console.error('[WS] Listener error:', e) }
      })
    }
  }

  get isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

export const wsManager = new WebSocketManager()
export default wsManager
