import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectProjectIds, selectUser } from '../../store/selectors';

import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs/operators';
import { NotificationService } from './app-notifications-service';
import { DatePipe } from '@angular/common';
export interface NotificationItem {
  id: number;
  title?: string;
  message: string;
  type: string;
  created_at?: string;
  is_read?: boolean;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  templateUrl: './app-notification.html',
  styleUrl: './app-notification.css',
  imports: [DatePipe],
})
export class AppNotification {
  @Input() title: string = 'Notification';
  @Input() type: string = 'general';
  @Output() close = new EventEmitter<void>();

  private store = inject(Store);
  private notifService = inject(NotificationService);
  projectIds = signal<any[]>([]);

  user = this.store.selectSignal(selectUser);

  notifications: NotificationItem[] = [];
  loading = false;

  async ngOnInit() {
    this.store.select(selectProjectIds).subscribe((ids) => {
      this.projectIds.set(ids);
    });
    console.log(this.projectIds());

    const user = this.user();
    if (!user?.id) return;

    this.loading = true;
    const data = await this.notifService.getNotificationsByProjects(this.projectIds(), [
      'project',
      'projectMembership',
      'Board',
      'boardMember',
    ]);
    this.notifications = data ?? [];
    this.loading = false;
  }

  onBackdropClick() {
    this.close.emit();
  }

  stopClick(e: MouseEvent) {
    e.stopPropagation();
  }
}
