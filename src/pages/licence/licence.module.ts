import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LicencePage } from './licence';

@NgModule({
  declarations: [
    LicencePage,
  ],
  imports: [
    IonicPageModule.forChild(LicencePage),
  ],
})
export class LicencePageModule {}
