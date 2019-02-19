import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyOrderPage } from './modify-order';

@NgModule({
  declarations: [
    ModifyOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyOrderPage),
  ],
})
export class ModifyOrderPageModule {}
