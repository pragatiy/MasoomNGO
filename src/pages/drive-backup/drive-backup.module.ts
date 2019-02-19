import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriveBackupPage } from './drive-backup';

@NgModule({
  declarations: [
    DriveBackupPage,
  ],
  imports: [
    IonicPageModule.forChild(DriveBackupPage),
  ],
})
export class DriveBackupPageModule {}
