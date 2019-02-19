import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordPolicyPage } from './password-policy';

@NgModule({
  declarations: [
    PasswordPolicyPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordPolicyPage),
  ],
})
export class PasswordPolicyPageModule {}
