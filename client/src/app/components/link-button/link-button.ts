import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-link-button',
  standalone: true,

  imports: [CommonModule],
  templateUrl: './link-button.html',
  styleUrls: ['./link-button.css'],
})
export class LinkButton {
  private router = inject(Router);
  buttonClass = input<string>('');
  title = input<string>('Get Started');
  route = input<string>('');
  icon = input<string>('');
  disabled = input<boolean>(false);
  @Output() action = new EventEmitter<void>();

  onClick() {
    if (this.disabled()) return;
    if (this.route()) {
      this.router.navigate([this.route()]);
    } else {
      this.action.emit();
    }
  }
}
