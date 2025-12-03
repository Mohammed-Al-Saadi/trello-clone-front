import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  imports: [NgIf],
  templateUrl: './confirm-delete.html',
  styleUrl: './confirm-delete.css',
})
export class ConfirmDelete {
  @Input() title = 'Confirm Delete';
  @Input() message = 'Are you sure you want to delete this item?';
  @Input() show = false;
  @Output() close = new EventEmitter<boolean>();

  confirm() {
    this.close.emit(true);
  }

  cancel() {
    this.close.emit(false);
  }
}
