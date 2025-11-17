import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-info-panel',
  imports: [],
  templateUrl: './dashboard-info-panel.html',
  styleUrl: './dashboard-info-panel.css',
})
export class DashboardInfoPanel {
  title = input<string>('');
  description = input<string>('');
}
