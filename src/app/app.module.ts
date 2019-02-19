import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Toast } from '@ionic-native/toast';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';
import { Deeplinks } from '@ionic-native/deeplinks';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LicenceAgreementProvider } from '../providers/licence-agreement/licence-agreement';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Device } from '@ionic-native/device';
import { Push } from '@ionic-native/push';
import { A2cApiProvider } from '../providers/a2c-api/a2c-api';
import { AppVersion } from '@ionic-native/app-version';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AddAccountPageModule } from '../pages/add-account/add-account.module';
import { ConfirmationScreenPageModule } from '../pages/confirmation-screen/confirmation-screen.module';
import { EditAccountPageModule } from '../pages/edit-account/edit-account.module';
import { GeneratePasswordPageModule } from '../pages/generate-password/generate-password.module';
import { GeneratePinPageModule } from '../pages/generate-pin/generate-pin.module';
import { LicencePageModule } from '../pages/licence/licence.module';
import { ModifyOrderPageModule } from '../pages/modify-order/modify-order.module';
import { ResetPasswordPageModule } from '../pages/reset-password/reset-password.module';
import { SettingPageModule } from '../pages/setting/setting.module';
import { UnlockAccountPageModule } from '../pages/unlock-account/unlock-account.module';
import { UserProfilePageModule } from '../pages/user-profile/user-profile.module';
import { DriveBackupPageModule } from '../pages/drive-backup/drive-backup.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { IconlistPageModule } from '../pages/iconlist/iconlist.module';
import { DefaulticonPageModule } from '../pages/defaulticon/defaulticon.module';
import { ShowTotpPageModule } from '../pages/show-totp/show-totp.module';
import { PasswordPolicyPageModule } from '../pages/password-policy/password-policy.module';
import { UnlockPageModule } from '../pages/unlock/unlock.module';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { LongPressModule } from 'ionic-long-press';

@NgModule({
declarations: [ MyApp, HomePage ], imports: [ BrowserModule,LongPressModule, HttpClientModule, HttpModule, BrowserAnimationsModule,
AddAccountPageModule, ConfirmationScreenPageModule, EditAccountPageModule, GeneratePasswordPageModule, GeneratePinPageModule,
ModifyOrderPageModule, LicencePageModule, ResetPasswordPageModule, SettingPageModule, UnlockAccountPageModule,
UserProfilePageModule, DriveBackupPageModule, WelcomePageModule, UnlockPageModule, IconlistPageModule, DefaulticonPageModule, PasswordPolicyPageModule, ShowTotpPageModule, IonicModule.forRoot(MyApp) ], bootstrap: [IonicApp],
entryComponents: [ MyApp, HomePage ] ,	providers: [ StatusBar,	BarcodeScanner,	File, Camera, Toast, AndroidFingerprintAuth,
NativeAudio, Vibration, Deeplinks, LicenceAgreementProvider, HttpClient,
HttpModule, Device, Push, AppVersion, NativeRingtones, FileTransfer, UniqueDeviceID,
{ provide: ErrorHandler, useClass: IonicErrorHandler }, A2cApiProvider]
})
export class AppModule {


}
