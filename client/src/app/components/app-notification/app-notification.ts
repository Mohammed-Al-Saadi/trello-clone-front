import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  templateUrl: './app-notification.html',
  styleUrls: ['./app-notification.css'],
  imports: [DatePipe, NgFor, NgIf],
})
export class AppNotification implements OnInit, OnDestroy {
  @Input() title: string = 'Notification';
  @Output() close = new EventEmitter<void>();

  messages: any[] = [];
  private unsubscribe?: () => void;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.messages = this.socketService.getMessages();
  }
  clearAll(e?: MouseEvent) {
    e?.stopPropagation();
    this.socketService.clearMessages();
    this.messages = [];
  }

  ngOnDestroy() {
    this.unsubscribe?.();
  }

  onBackdropClick() {
    this.close.emit();
  }

  stopClick(e: MouseEvent) {
    e.stopPropagation();
  }
}
