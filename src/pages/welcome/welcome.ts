import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from 'ionic-angular';
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { GeneratePinPage } from '../generate-pin/generate-pin';
import { commonString } from "../.././app/commonString";
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  companyName: any;
  licenceId: any;
  A2CapiUrl: any;
  defaultimageSrc: any;
  accountArr: any = [];
  accountArr1: any = [];
  accountProtectionName: string = 'Not Set';
  protectionPin: any;
  accountProtection: any = 0;
  newdeviceId: any;
  fingerprint: boolean;
  constructor(public restProvider: LicenceAgreementProvider, public androidFingerprintAuth: AndroidFingerprintAuth, private device: Device, private transfer: FileTransfer, private file: File, public navCtrl: NavController, public platform: Platform, private appVersion: AppVersion, private loadingCtrl: LoadingController, private alertCtrl: AlertController, public navParams: NavParams) {
    platform.ready().then(() => {
      this.androidFingerprintAuth.isAvailable()
        .then((result) => {
          if (result.isAvailable) {
            this.fingerprint = true;
          } else {
            this.fingerprint = false;
          }
        })
      this.newdeviceId = localStorage.getItem('deviceId');
      platform.registerBackButtonAction(() => {

      });
    })
  }


  ionViewDidLoad() {
    this.newdeviceId = localStorage.getItem('deviceId');
    console.log('ionViewDidLoad WelcomePage');
  }


  redirectToApp() {
    localStorage.setItem('isFirstAppLaunch', 'Yes');
    this.navCtrl.popToRoot();
  }
  
  RestoreBackup() {
    try{
    debugger;
    let loading = this.loadingCtrl.create({
      content: commonString.welcomePage.restoreMsg,
    });
    loading.present();
    this.appVersion.getVersionCode().then(driveData => {
      loading.dismiss();
      localStorage.setItem('isFirstAppLaunch', 'Yes');
      let decryptedData = window.atob(driveData)
      console.log('decrypted data' + window.atob(driveData));
      let splittedBackup = decryptedData.split('splitSet', 2);
      console.log('splitted ' + splittedBackup);
      console.log('splitted 0 indexc  ' + splittedBackup[0]);
      console.log('splitted 1 indexc  ' + splittedBackup[1]);
      localStorage.setItem('accounts', splittedBackup[0]);
      let getAccountData = JSON.parse(localStorage.getItem('accounts'));
      if (getAccountData) {
        if (getAccountData.length > 0) {
          for (let i = 0; i < getAccountData.length; i++) {
            if (getAccountData[i].accountProtectionPin != 0) {
              this.protectionPin = getAccountData[i].accountProtectionPin;
              this.accountProtection = 2;
            } else {
              this.protectionPin = 0;
              this.accountProtection = 0;
            }
            if (getAccountData[i].imageSrc != null && getAccountData[i].imageSrc != '') {
              if (getAccountData[i].CompanyIcon != '' && getAccountData[i].CompanyIcon != undefined) {
                this.companyName = getAccountData[i].companyname;
                this.licenceId = getAccountData[i].licenseId;
                this.A2CapiUrl = getAccountData[i].A2CapiUrl;
                localStorage.setItem('apiUrlA2c', this.A2CapiUrl);
                this.getUsersData();
                let userAcc = {
                  pushPin: getAccountData[i].App_Push_Pin,
                  companyname: getAccountData[i].companyname,
                  SuccessCode: getAccountData[i].SuccessCode,
                  sessionId: getAccountData[i].sessionId,
                  tag: getAccountData[i].tag,
                  CN: getAccountData[i].CN,
                  CompanyIcon: getAccountData[i].CompanyIcon,
                  OTPSecretKey: getAccountData[i].OTPSecretKey,
                  email: getAccountData[i].email,
                  mobile: getAccountData[i].mobile,
                  name: getAccountData[i].name,
                  userName: getAccountData[i].userName,
                  accountName: getAccountData[i].CN,
                  imageSrc: getAccountData[i].imageSrc,
                  secretKey: getAccountData[i].OTPSecretKey,
                  isRegister: false,
                  accountIndex: 1,
                  accountProtectionEnable: getAccountData[i].PasswordProtected,
                  A2CapiUrl: getAccountData[i].A2CapiUrl,
                  licenseId: getAccountData[i].licenseId,
                  accountProtectionPin: getAccountData[i].accountProtectionPin,
                };
                localStorage.setItem('UserRegisterInfo', JSON.stringify(userAcc));
              }
            }
          }
        }
        localStorage.setItem('accounts', JSON.stringify(getAccountData));
        if (splittedBackup[1] == undefined) {
          let myObj = {
            appicationBackup: false,
            accountProtection: this.accountProtection,
            accountProtectionPin: this.protectionPin,
            notificationSound: 'default',
            vibration: true,
            userRegister: 'unregister',
            settingProtectionType: 0,
            isSettingProtect: false
          };
          localStorage.setItem('Appsetting', JSON.stringify(myObj));
          this.navCtrl.popToRoot();
        } else {
          localStorage.setItem('Appsetting', splittedBackup[1]);
          let settingBackup = JSON.parse(localStorage.getItem('Appsetting'));
          let oldDeviceId = settingBackup.deviceId;
          let newDeviceBackup = JSON.parse(localStorage.getItem('Appsetting'));
          if (this.newdeviceId != oldDeviceId) {
            console.log('new device');
            localStorage.setItem('ringtoneUrl', 'null');
            if (this.fingerprint == false) {
              if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin != 0) {
                let alert = this.alertCtrl.create({
                  title: '',
                  subTitle: commonString.welcomePage.biometricMsg,
                  buttons: ['OK']
                });
                alert.present();
                newDeviceBackup.accountProtection = 2;
                newDeviceBackup.settingProtectionType = 2;
                this.navCtrl.popToRoot();
              } else if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin == 0) {
                let alert = this.alertCtrl.create({
                  title: '',
                  subTitle: commonString.welcomePage.biometricNfourDigi,
                  buttons: ['OK']
                });
                alert.present();
                newDeviceBackup.accountProtection = 2;
                newDeviceBackup.settingProtectionType = 2;
                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 3 });
              }
              else if (newDeviceBackup.accountProtection == 2 && newDeviceBackup.accountProtectionPin != 0) {
                let alert = this.alertCtrl.create({
                  title: '',
                  subTitle: commonString.welcomePage.notificationMsg,
                  buttons: ['OK']
                });
                alert.present();
                newDeviceBackup.accountProtection = 2;
                this.navCtrl.popToRoot();
              } else {
                let alert = this.alertCtrl.create({
                  title: '',
                  subTitle: commonString.welcomePage.notificationMsg,
                  buttons: ['OK']
                });
                alert.present();
                newDeviceBackup.accountProtection = 0;
                this.navCtrl.popToRoot();
              }
              localStorage.setItem('Appsetting', JSON.stringify(newDeviceBackup));
            } else {
              let alert = this.alertCtrl.create({
                title: '',
                subTitle: commonString.welcomePage.notificationMsg,
                buttons: ['OK']
              });
              alert.present();
              localStorage.setItem('Appsetting', JSON.stringify(newDeviceBackup));
              this.navCtrl.popToRoot();
            }
          } else {
            if (settingBackup.notificationSound != 'default') {
              localStorage.setItem('ringtoneUrl', settingBackup.notificationSound);
            }
            console.log('old device');
            if (this.fingerprint == false) {
              if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin != 0) {
                newDeviceBackup.accountProtection = 2;
                newDeviceBackup.settingProtectionType = 2;
                this.navCtrl.popToRoot();
              } else if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin == 0) {
                newDeviceBackup.accountProtection = 2;
                newDeviceBackup.settingProtectionType = 2;
                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 3 });
              }
              else if (newDeviceBackup.accountProtection == 2 && newDeviceBackup.accountProtectionPin != 0) {
                newDeviceBackup.accountProtection = 2;
                this.navCtrl.popToRoot();
              } else {
                newDeviceBackup.accountProtection = 0;
                this.navCtrl.popToRoot();
              }
              localStorage.setItem('Appsetting', JSON.stringify(newDeviceBackup));
            } else {
              localStorage.setItem('Appsetting', JSON.stringify(newDeviceBackup));
              this.navCtrl.popToRoot();
            }
          }
        }
      }
    });
     } catch (error) { console.log("Error occured"); }
  }


  //get registered user data api respoonse
  getUsersData() {
    try{
    let fileTransfer: FileTransferObject = this.transfer.create();
    this.restProvider.getUsers(this.licenceId, this.companyName).subscribe(
      (result) => {
        let resultObj = JSON.stringify(result);
        let resultData = JSON.parse(resultObj);
        console.log(resultObj);
        let sucessCode = resultData.Result.SuccessCode;
        if (sucessCode == 200) {
          let url = resultData.Result.CompanyIcon;
          let passwordPolicy = JSON.stringify(resultData.Result.passwordPolicy);
          console.log('passwordPolicy' + passwordPolicy);
          localStorage.setItem('passwordPolicy', passwordPolicy);
          this.getDataUri(url, resultData);
        }
        else if (sucessCode == 100) {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.welcomePage.errRegistrationKey,
            buttons: ['OK']
          });
        }
        else if (sucessCode == 400) {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.welcomePage.requestFailed,
            buttons: ['OK']
          });
        }
        else if (sucessCode == 700) {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.welcomePage.userIdMsg,
            buttons: ['OK']
          });
        }
        else {
          console.log('Sucess data' + JSON.stringify(result));
        }
      },
      (error) => {
        console.log('error api' + JSON.stringify(error));
      });
      } catch (error) { console.log("Error occured"); }
  }

  getDataUri(url, resultData) {
    try{
    var image = new Image();
    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext('2d').drawImage(image, 0, 0);
      localStorage.setItem('defaultimageSrc', canvas.toDataURL('image/png'));
    };
    image.src = url;
      } catch (error) { console.log("Error occured"); }
  }
}
