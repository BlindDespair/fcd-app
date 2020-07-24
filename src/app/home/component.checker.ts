import { ElementRef, NgZone, Component, HostBinding } from '@angular/core';

@Component({
  template: '',
})
// tslint:disable-next-line: component-class-suffix
export class ComponentChecker {
  @HostBinding('class.checking') checking = true;
  constructor(private readonly elem: ElementRef, private readonly zone: NgZone) {}

  private timeout?: any;

  highlight(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    const highlightCSS = 'changed';
    const elem = this.elem.nativeElement;
    elem.classList.add(highlightCSS);

    this.zone.runOutsideAngular(() => {
      this.timeout = setTimeout(() => elem.classList.remove(highlightCSS), 500);
    });
  }
}
