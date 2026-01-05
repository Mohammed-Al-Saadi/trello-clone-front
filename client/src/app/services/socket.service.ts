import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket?: Socket;

  private readonly STORAGE_KEY = 'socket_messages';

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(environment.API_BASE_URL, {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket!', this.socket?.id);
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('❌ WebSocket connection error:', err?.message || err);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('⚠️ WebSocket disconnected:', reason);
    });

    this.socket.on('message', (data: any) => {
      this.saveMessage(data);
    });
  }

  registerUser(userId: string) {
    this.socket?.emit('register_user', { user_id: String(userId) });
  }

  onMessage(cb: (data: any) => void): () => void {
    this.socket?.on('message', cb);
    return () => this.socket?.off('message', cb);
  }

  private saveMessage(data: any) {
    const messages = this.getMessages();
    messages.unshift({ ...data, _ts: Date.now() });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
  }

  getMessages(): any[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  clearMessages() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = undefined;
  }
}
