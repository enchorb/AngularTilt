import { NgModule } from '@angular/core';
import { AngularTiltDirective } from './angular-tilt.directive';
import 'hammerjs';

@NgModule({
  declarations: [AngularTiltDirective],
  imports: [],
  exports: [AngularTiltDirective]
})

export class AngularTiltModule {}
