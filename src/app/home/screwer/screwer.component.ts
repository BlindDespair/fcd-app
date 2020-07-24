import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-screwer',
  templateUrl: './screwer.component.html',
  styleUrls: ['./screwer.component.scss'],
})
export class ScrewerComponent {
  @HostListener('window:click')
  onMousemove(): void {}
}
