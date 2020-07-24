import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[noop]',
})
export class NoopDirective {
  @Input() noop: any;
}
