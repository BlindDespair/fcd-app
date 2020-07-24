import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ComponentChecker } from '../component.checker';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildComponent extends ComponentChecker implements OnInit, OnDestroy {
  @Input() child: any;

  get name(): string {
    return this.child.name;
  }

  get v(): any {
    this.highlight();
    return '';
  }

  ngOnInit(): void {
    console.log('child created');
  }

  ngOnDestroy(): void {
    console.log('child destroyed');
  }
}
