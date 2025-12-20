import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  imports: [],
  templateUrl: './loading-skeleton.html',
  styleUrl: './loading-skeleton.css',
})
export class LoadingSkeleton {
  @Input() variant: 'card' | 'list' = 'card';

  @Input() items = 3;
}
