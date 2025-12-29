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

  // ✅ supports password/tel/etc.
  @Input() inputType: 'text' | 'password' | 'email' | 'number' | 'tel' = 'text';

  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();

  // ✅ only used when inputType === 'password'
  showPassword = false;

  get resolvedInputType(): string {
    if (this.inputType !== 'password') return this.inputType;
    return this.showPassword ? 'text' : 'password';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  updateValue(val: any) {
    this.model = val;
    this.modelChange.emit(val);
  }
}
