import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly partSize = 200;
  title = 'outskirts';

  ngOnInit(): void {
    fromEvent(window, 'mousemove').subscribe((event: MouseEvent) => {
      const isInYCenter =
        event.screenY > document.documentElement.clientHeight / 2 - this.partSize &&
        event.screenY < document.documentElement.clientHeight / 2 + this.partSize;
      const isInXCenter =
        event.screenX > document.documentElement.clientWidth / 2 - this.partSize &&
        event.screenX < document.documentElement.clientWidth / 2 + this.partSize;
      const newTitle = isInYCenter && isInXCenter ? 'center' : 'outskirts';
      if (this.title !== newTitle) {
        this.title = newTitle;
      }
    });
  }
}
