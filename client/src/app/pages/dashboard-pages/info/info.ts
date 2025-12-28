import { Component } from '@angular/core';
import { DashboardInfoPanel } from '../../../components/dashboard-info-panel/dashboard-info-panel';

@Component({
  selector: 'app-info',
  imports: [DashboardInfoPanel],
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info {}
