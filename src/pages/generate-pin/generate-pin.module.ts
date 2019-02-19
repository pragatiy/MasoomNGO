import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneratePinPage } from './generate-pin';

@NgModule({
  declarations: [
    GeneratePinPage,
  ],
  imports: [
    IonicPageModule.forChild(GeneratePinPage),
  ],
})
export class GeneratePinPageModule {}
