import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentChecker } from '../component.checker';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent extends ComponentChecker {
  @Input() task: any;

  get t(): any {
    return this.task;
  }

  get v(): any {
    this.highlight();
    return '';
  }
}
