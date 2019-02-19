import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmationScreenPage } from './confirmation-screen';

@NgModule({
  declarations: [
    ConfirmationScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmationScreenPage),
  ],
})
export class ConfirmationScreenPageModule {}
