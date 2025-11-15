import { io, Socket } from 'socket.io-client';
import type { StockPrice } from './stockDataService';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

export interface StockUpdate {
  symbol: string;
  data: StockPrice;
  timestamp: string;
}

export interface StockError {
  symbol: string;
  error: string;
  timestamp: string;
}

type StockUpdateCallback = (update: StockUpdate) => void;
type StockErrorCallback = (error: StockError) => void;
type ConnectionCallback = () => void;

/**
 * WebSocket service for real-time stock price updates
 */
class WebSocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;
  private subscriptions: Map<string, Set<StockUpdateCallback>> = new Map();
  private errorHandlers: Map<string, Set<StockErrorCallback>> = new Map();
  private connectionHandlers: {
    onConnect: Set<ConnectionCallback>;
    onDisconnect: Set<ConnectionCallback>;
  } = {
    onConnect: new Set(),
    onDisconnect: new Set()
  };
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  /**
   * Initialize WebSocket connection
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    console.log('Connecting to WebSocket server...');

    this.socket = io(WS_URL, {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connected = true;
      this.reconnectAttempts = 0;
      
      // Re-subscribe to all active subscriptions
      for (const symbol of this.subscriptions.keys()) {
        this.socket?.emit('subscribe-stock', symbol);
      }

      // Call connection handlers
      this.connectionHandlers.onConnect.forEach(handler => handler());
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connected = false;
      
      // Call disconnection handlers
      this.connectionHandlers.onDisconnect.forEach(handler => handler());
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('Max reconnection attempts reached. Using polling fallback.');
      }
    });

    this.socket.on('stock-update', (update: StockUpdate) => {
      const callbacks = this.subscriptions.get(update.symbol);
      if (callbacks) {
        callbacks.forEach(callback => callback(update));
      }
    });

    this.socket.on('stock-error', (error: StockError) => {
      const callbacks = this.errorHandlers.get(error.symbol);
      if (callbacks) {
        callbacks.forEach(callback => callback(error));
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Subscribe to stock updates
   */
  subscribe(symbol: string, callback: StockUpdateCallback, onError?: StockErrorCallback): () => void {
    const normalizedSymbol = symbol.toUpperCase();

    if (!this.subscriptions.has(normalizedSymbol)) {
      this.subscriptions.set(normalizedSymbol, new Set());
      this.errorHandlers.set(normalizedSymbol, new Set());
      
      // Send subscription to server if connected
      if (this.socket?.connected) {
        this.socket.emit('subscribe-stock', normalizedSymbol);
      }
    }

    this.subscriptions.get(normalizedSymbol)!.add(callback);
    
    if (onError) {
      this.errorHandlers.get(normalizedSymbol)!.add(onError);
    }

    // Return unsubscribe function
    return () => this.unsubscribe(normalizedSymbol, callback, onError);
  }

  /**
   * Unsubscribe from stock updates
   */
  unsubscribe(symbol: string, callback: StockUpdateCallback, onError?: StockErrorCallback): void {
    const normalizedSymbol = symbol.toUpperCase();
    const callbacks = this.subscriptions.get(normalizedSymbol);
    
    if (callbacks) {
      callbacks.delete(callback);
      
      if (onError) {
        const errorCallbacks = this.errorHandlers.get(normalizedSymbol);
        errorCallbacks?.delete(onError);
      }

      // If no more callbacks, unsubscribe from server
      if (callbacks.size === 0) {
        this.subscriptions.delete(normalizedSymbol);
        this.errorHandlers.delete(normalizedSymbol);
        
        if (this.socket?.connected) {
          this.socket.emit('unsubscribe-stock', normalizedSymbol);
        }
      }
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get active subscriptions
   */
  getSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Add connection event handlers
   */
  onConnect(callback: ConnectionCallback): () => void {
    this.connectionHandlers.onConnect.add(callback);
    return () => this.connectionHandlers.onConnect.delete(callback);
  }

  onDisconnect(callback: ConnectionCallback): () => void {
    this.connectionHandlers.onDisconnect.add(callback);
    return () => this.connectionHandlers.onDisconnect.delete(callback);
  }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
