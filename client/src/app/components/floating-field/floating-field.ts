import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-floating-field',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './floating-field.html',
  styleUrls: ['./floating-field.css'],
})
export class FloatingField {
  @Input() label = '';
  @Input() type: 'input' | 'select' = 'input';
  @Input() placeholder = '';
  @Input() icon?: string;

  @Input() options: string[] = [];

  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();

  updateValue(val: any) {
    this.model = val;
    this.modelChange.emit(val);
  }
}
