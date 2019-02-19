import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneratePasswordPage } from './generate-password';

@NgModule({
  declarations: [
    GeneratePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(GeneratePasswordPage),
  ],
})
export class GeneratePasswordPageModule {}
