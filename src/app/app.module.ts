import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgZone } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

declare const Zone: any;

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private ngZone: NgZone) {
    const stable$ = this.ngZone.onStable;
    const cdZoneSpec = Zone.current.get('ChangeDetectionTrackingZone');
    cdZoneSpec.startTracking(stable$);
  }
}
