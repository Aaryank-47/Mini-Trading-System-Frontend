import { getAccessToken } from '../services/apiClient';

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const WS_BASE = isLocal 
  ? 'ws://localhost:8000' 
  : 'wss://mini-trading-system-backend.onrender.com';

class WebSocketManager {
  constructor() {
    this.ws = null
    this.userId = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10
    this.reconnectDelay = 2000
    this.isConnecting = false
  }

  connect(userId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.userId === userId) {
      return
    }

    this.disconnect()
    this.userId = userId
    this.isConnecting = true

    try {
      const token = getAccessToken();
      const wsUrl = token ? `${WS_BASE}/ws/${userId}?token=${token}` : `${WS_BASE}/ws/${userId}`;
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log(`[WS] Connected for user ${userId}`)
        this.reconnectAttempts = 0
        this.isConnecting = false
        this._emit('connection', { status: 'connected' })
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this._emit(data.event, data)
          this._emit('message', data)
        } catch (e) {
          console.error('[WS] Parse error:', e)
        }
      }

      this.ws.onclose = (event) => {
        console.log(`[WS] Disconnected (code: ${event.code})`)
        this.isConnecting = false
        this._emit('connection', { status: 'disconnected' })

        if (this.userId && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++
          const delay = this.reconnectDelay * Math.min(this.reconnectAttempts, 5)
          console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)
          setTimeout(() => this.connect(this.userId), delay)
        }
      }

      this.ws.onerror = (error) => {
        console.error('[WS] Error:', error)
        this.isConnecting = false
        this._emit('connection', { status: 'error' })
      }
    } catch (e) {
      console.error('[WS] Connection failed:', e)
      this.isConnecting = false
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.onclose = null
      this.ws.close()
      this.ws = null
    }
    this.userId = null
    this.reconnectAttempts = 0
    this.isConnecting = false
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
