import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-info-panel',
  imports: [DatePipe],
  templateUrl: './dashboard-info-panel.html',
  styleUrl: './dashboard-info-panel.css',
})
export class DashboardInfoPanel {
  title = input<string>('');
  description = input<string>('');
  today = new Date();
  username = '';
}
