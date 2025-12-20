import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rain-loader',
  imports: [],
  templateUrl: './rain-loader.html',
  styleUrl: './rain-loader.css',
})
export class RainLoader {
  @Input() title: string = 'Signing in… Please wait.';
}
