import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularTiltModule } from '../angular-tilt/angular-tilt.module';
import 'hammerjs';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

// Components

// Services
import { UIService } from '../../services/ui.service';
import { DataService } from '../../services/data.service';

@NgModule({
  imports: [
    CommonModule,
    AngularTiltModule,
    MatButtonModule,
    MatRippleModule
  ],
  declarations: [],
  entryComponents: [],
  exports: [
    MatButtonModule,
    AngularTiltModule,
    MatRippleModule
  ],
  providers: []
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [UIService, DataService]
    };
  }
}
