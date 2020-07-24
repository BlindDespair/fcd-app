import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentChecker } from '../component.checker';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildComponent extends ComponentChecker {
  @Input() child: any;

  get name(): string {
    return this.child.name;
  }

  get v(): any {
    this.highlight();
    return '';
  }
}
