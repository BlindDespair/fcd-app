import { Component, NgZone, TrackByFunction } from '@angular/core';
import { scan, switchMap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare const Zone: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  tasks$;
  children = [
    { id: 1, visible: true, name: 'LALALALA' },
    { id: 2, visible: true, name: 'LALALALA' },
    { id: 3, visible: true, name: 'LALALALA' },
    { id: 4, visible: true, name: 'LALALALA' },
    { id: 5, visible: true, name: 'LALALALA' },
    { id: 6, visible: true, name: 'LALALALA' },
    { id: 7, visible: true, name: 'LALALALA' },
    // { id: 8, visible: true, name: 'LALALALA' },
    // { id: 9, visible: true, name: 'LALALALA' },
    // { id: 10, visible: true, name: 'LALALALA' },
    // { id: 11, visible: true, name: 'LALALALA' },
    // { id: 12, visible: true, name: 'LALALALA' },
    // { id: 13, visible: true, name: 'LALALALA' },
    // { id: 14, visible: true, name: 'LALALALA' },
    // { id: 15, visible: true, name: 'LALALALA' },
    // { id: 16, visible: true, name: 'LALALALA' },
  ];

  public readonly trackChildById: TrackByFunction<number> = (_, child: any) => child.id;

  constructor(private readonly http: HttpClient, private readonly zone: NgZone) {
    interval(1000)
      .pipe(switchMap((v) => this.http.get(`https://jsonplaceholder.typicode.com/todos/${v + 1}`)))
      .subscribe((res: any) => {
        if (res.id % 2 === 0) {
          const changeIndex = Math.floor(Math.random() * this.children.length);
          this.children = this.children.map((child, index) => (index === changeIndex ? { ...child, name: child.name + res.id } : child));
        }
      });

    const cdZoneSpec = Zone.current.get('ChangeDetectionTrackingZone');
    this.tasks$ = cdZoneSpec.performance$.pipe(
      scan((acc: any, t: any) => {
        return acc.concat([t]);
      }, [])
    );
  }
}
