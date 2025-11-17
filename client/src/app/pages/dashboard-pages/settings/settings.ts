import { Component } from '@angular/core';
import { DashboardInfoPanel } from '../../../components/dashboard-info-panel/dashboard-info-panel';

@Component({
  selector: 'app-settings',
  imports: [DashboardInfoPanel],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {}
