import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [NgIf],
  templateUrl: './confirm-delete.html',
  styleUrls: ['./confirm-delete.css'],
})
export class ConfirmDelete {
  @Input() show = false;
  @Input() title = '';
  @Input() message = '';
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Delete';

  @Input() loading = false;

  @Output() close = new EventEmitter<boolean>();

  cancel() {
    if (this.loading) return;
    this.close.emit(false);
  }

  confirm() {
    if (this.loading) return;
    this.close.emit(true);
  }
}
