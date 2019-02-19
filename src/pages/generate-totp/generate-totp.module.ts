import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenerateTotpPage } from './generate-totp';

@NgModule({
  declarations: [
    GenerateTotpPage,
  ],
  imports: [
    IonicPageModule.forChild(GenerateTotpPage),
  ],
})
export class GenerateTotpPageModule {}
