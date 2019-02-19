import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Toast } from '@ionic-native/toast';
import { TouchID } from '@ionic-native/touch-id';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Keyboard } from '@ionic-native/keyboard';



import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LicenceAgreementProvider } from '../providers/licence-agreement/licence-agreement';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FCM } from '@ionic-native/fcm';
import { Device } from '@ionic-native/device';
import { HTTP } from '@ionic-native/http';
import { AppVersion } from '@ionic-native/app-version';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { A2cApiProvider } from '../providers/a2c-api/a2c-api';
import { AddAccountPageModule } from '../pages/add-account/add-account.module';
import { EditAccountPageModule } from '../pages/edit-account/edit-account.module';
import { SettingPageModule } from '../pages/setting/setting.module';
import { LicencePageModule } from "../pages/licence/licence.module";
import { GeneratePinPageModule } from '../pages/generate-pin/generate-pin.module';
import { ModifyOrderPageModule } from '../pages/modify-order/modify-order.module';
import { UnlockPageModule } from "../pages/unlock/unlock.module";
import { UserProfilePageModule } from "../pages/user-profile/user-profile.module";
import { PasswordPolicyPageModule } from '../pages/password-policy/password-policy.module';
import { ConfirmationScreenPageModule } from '../pages/confirmation-screen/confirmation-screen.module';
import { GeneratePasswordPageModule } from '../pages/generate-password/generate-password.module';
import { DriveBackupPageModule } from '../pages/drive-backup/drive-backup.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { GenerateTotpPageModule } from '../pages/generate-totp/generate-totp.module';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { IconlistPageModule } from '../pages/iconlist/iconlist.module';
import { DefaulticonPageModule } from '../pages/defaulticon/defaulticon.module';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
    declarations: [
        MyApp,
        HomePage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpModule,
        BrowserAnimationsModule,
        AddAccountPageModule,
        EditAccountPageModule,
        SettingPageModule,
        GeneratePinPageModule,
        LicencePageModule,
        ModifyOrderPageModule,
        UserProfilePageModule,
        ConfirmationScreenPageModule,
        GeneratePasswordPageModule,
        DriveBackupPageModule,
        WelcomePageModule,
        IconlistPageModule,
        DefaulticonPageModule,
        PasswordPolicyPageModule,
        GenerateTotpPageModule,
        UnlockPageModule,
        IonicModule.forRoot(MyApp, {
            platforms: {
                ios: {
                    swipeBackEnabled: false
                },
            },
            scrollAssist: true,
            autoFocusAssist: true,
        }),

        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient]
            }
          })

    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        BarcodeScanner,
        File,
        Camera,
        Toast,
        NativeAudio,
        Vibration,
        TouchID,
        Deeplinks,
        HttpClient,
        HttpModule,
        FCM,
        Device,
        HTTP,
        A2cApiProvider,
        AppVersion,
        NativeRingtones,
        FileTransfer,
        Keyboard,
        UniqueDeviceID,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        LicenceAgreementProvider
    ]
})
export class AppModule { }
