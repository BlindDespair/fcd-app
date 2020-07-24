import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoopDirective } from './directives/noop.directive';

@NgModule({
  declarations: [NoopDirective],
  imports: [CommonModule],
  exports: [NoopDirective],
})
export class SharedModule {}
