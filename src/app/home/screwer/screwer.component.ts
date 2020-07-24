import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { windowClick$ } from '../../shared/global-events/window-click.event';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-screwer',
  templateUrl: './screwer.component.html',
  styleUrls: ['./screwer.component.scss'],
})
export class ScrewerComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();

  ngOnInit(): void {
    windowClick$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      console.log('click');
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
