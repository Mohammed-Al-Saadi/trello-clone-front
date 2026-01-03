import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  templateUrl: './app-notification.html',
  styleUrl: './app-notification.css',
})
export class AppNotification {
  @Input() title: string = 'Notification';
  @Output() close = new EventEmitter<void>();

  onBackdropClick() {
    this.close.emit();
  }

  stopClick(e: MouseEvent) {
    e.stopPropagation();
  }
}
