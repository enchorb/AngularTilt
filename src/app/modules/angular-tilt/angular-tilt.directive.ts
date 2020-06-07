import { TiltSettings } from './angular-tilt-settings.model';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Tilt } from './angular-tilt';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[tilt]'
})
export class AngularTiltDirective {
  tilt: any;
  // tslint:disable-next-line:no-input-rename
  @Input('tiltSettings') tiltSettings: TiltSettings;

  constructor(private el: ElementRef) {}

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit(){
    this.tilt = new Tilt(this.el.nativeElement, this.tiltSettings);
  }
}
