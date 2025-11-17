import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-model-view',
  imports: [],
  templateUrl: './model-view.html',
  styleUrl: './model-view.css',
})
export class ModelView {
  @Output() closeModel = new EventEmitter();

  onClick() {
    this.closeModel.emit();
  }
}
