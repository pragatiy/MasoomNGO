import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { Toast } from '@ionic-native/toast';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
import { File } from '@ionic-native/file';
import { GeneratePinPage } from '../generate-pin/generate-pin';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var iCloudKV: any;


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  loading: any;
  companyName: any;
  licenceId: any;
  A2CapiUrl: any;
  defaultimageSrc: any;
  file: any;
  apiUrlA2c: any;
  protectionPin: any = 0;
  accountProtection: any = 0;

  constructor(public navCtrl: NavController, private transfer: FileTransfer, public restProvider: LicenceAgreementProvider, private toast: Toast, private appVersion: AppVersion, private loadingCtrl: LoadingController, private alertCtrl: AlertController, public navParams: NavParams) {

    navCtrlnew = navCtrl;
    toastdata = toast;
    alertdata = this.alertCtrl;
    loadingdata = this.loading;
    transferdata = this.transfer;
    filedata = this.file;
    restProviderdata = this.restProvider;
    loadingdata = this.loadingCtrl.create({
      content: 'Please wait while restoring data from iCloud.',
      duration: 5000
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad welcomePage');
    sessionStorage.setItem("AddEdit", "YES");
  }



  redirectToApp() {
    localStorage.setItem('isFirstAppLaunch', 'Yes');
    this.navCtrl.popToRoot();
  }

  RestoreBackup() {
    loadingdata.present();
    setTimeout(() => { iCloudKV.load("BaackupData", this.successCallback, this.failCallback); }, 5000);

  }

  successCallback(returnedJSON) {
    loadingdata.dismiss();

    console.log("called load sucess function");
    str_array = returnedJSON.split('NOSETTING');
    let newSetting = str_array[1];

    deviceId = localStorage.getItem('uuid');
    let isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');
    localStorage.setItem("accounts", str_array[0]);

    if(newSetting == undefined){

    SaveUserSucessData();
    let myObj = {
      appicationBackup: false,
      accountProtection: accountProtection,
      accountProtectionPin: protectionPin,
      notificationSound: "default",
      vibration: true,
      userRegister: "unregister",
      settingProtectionType: 0,
      isSettingProtect: false
    };
    localStorage.setItem("Appsetting", JSON.stringify(myObj));
    navCtrlnew.popToRoot();
  }
  else{

   
    localStorage.setItem("NewAppSetting", str_array[1]);
    let SettingStorage = JSON.parse(localStorage.getItem("NewAppSetting"));

    if (SettingStorage.uuid == deviceId) {

      if ((isFingerPrintEnable == 'no') && (SettingStorage.accountProtectionPin != 0)) {
        SettingStorage.accountProtection = 2;
        SettingStorage.settingProtectionType = 2;
        localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));
        localStorage.setItem("RingToneData", SettingStorage.notificationSound);
        SaveUserSucessData();
        navCtrlnew.popToRoot();
      }
      else if((isFingerPrintEnable == 'no') && (SettingStorage.accountProtectionPin == 0)){
        SettingStorage.accountProtection = 0;
        SettingStorage.settingProtectionType = 0;
        SettingStorage.isSettingProtect = false;
        
        localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));
        localStorage.setItem("RingToneData", SettingStorage.notificationSound);
        SaveUserSucessData();
        navCtrlnew.popToRoot();

      }
      else {
        console.log('Done Backup with same device id');
        localStorage.setItem("Appsetting", str_array[1]);
        localStorage.setItem("RingToneData", SettingStorage.notificationSound);
        SaveUserSucessData();
        navCtrlnew.popToRoot();
      }

    }
    else {

      if (SettingStorage.accountProtection == 2) {
        localStorage.setItem("Appsetting", str_array[1]);
        let alert = alertdata.create({
          subTitle: 'Notification sound is not restored.',
          buttons: ['Ok']
        });
        alert.present();
        SaveUserSucessData();

        navCtrlnew.popToRoot();
      }

      else if (SettingStorage.accountProtection == 1) {
        if ((isFingerPrintEnable == 'yes') && (SettingStorage.accountProtection == 1)) {
          let alert = alertdata.create({
            subTitle: 'Notification sound is not restored.',
            buttons: ['Ok']
          });
          alert.present();
          localStorage.setItem("Appsetting", str_array[1]);
          SaveUserSucessData();

          navCtrlnew.popToRoot();
        }
        else if ((isFingerPrintEnable == 'no') && (SettingStorage.accountProtectionPin != 0)) {
          let alert = alertdata.create({
            subTitle: 'Biometric protection and Notification sound is not restored.',
            buttons: ['Ok']
          });
          alert.present();
          SettingStorage.accountProtection = 2;
          SettingStorage.settingProtectionType = 2;
          localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));
          SaveUserSucessData();

          navCtrlnew.popToRoot();
        }

        else if ((isFingerPrintEnable == 'no') && (SettingStorage.accountProtectionPin == 0)) {
          try {
            let alert = alertdata.create({
              title: '',
              message: 'Biometric protection and Notification sound is not restored, Please set 4 Digit Pin account protection!',
              buttons: [
                {
                  text: 'No',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                    SettingStorage.accountProtection = 0;
                    SettingStorage.settingProtectionType = 0;
                    SettingStorage.isSettingProtect = false;
                    localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));
                    SaveUserSucessData();

                    navCtrlnew.popToRoot();

                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    console.log('Buy clicked');
                    if (SettingStorage.isSettingProtect == true) {
                      SettingStorage.settingProtectionType = 2;
                      localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));
                    }
                    SaveUserSucessData();

                    navCtrlnew.push(GeneratePinPage, { settingProtectionIndex: 1, redirectWelcome: 'YES' });


                  }
                }
              ]
            });
            alert.present();
          } catch (error) {
            console.log('Error occured');
          }
        }
        else {

          let alert = alertdata.create({
            subTitle: 'Notification sound is not restored.',
            buttons: ['Ok']
          });
          alert.present();
          localStorage.setItem("Appsetting", str_array[1]);
        }
      }

    }

  }


  }

  failCallback() {
    console.log("called load failCallback function");
    localStorage.setItem('isFirstAppLaunch', 'Yes');
    navCtrlnew.popToRoot();
  }
}


function SaveUserSucessData() {
  let getAccountData = JSON.parse(localStorage.getItem("accounts"));
  if (getAccountData) {
    if (getAccountData.length > 0) {
      for (let i = 0; i < getAccountData.length; i++) {

        if (getAccountData[i].accountProtectionPin != 0) {
          protectionPin = getAccountData[i].accountProtectionPin;
          accountProtection = 2;
        }
        else {
          protectionPin = 0;
          accountProtection = 0;
        }

       // localStorage.setItem('isEnable', 'Enable');
    

        if (getAccountData[i].imageSrc != null && getAccountData[i].imageSrc != "") {

          if ((getAccountData[i].CompanyIcon != '') && (getAccountData[i].CompanyIcon != undefined)) {

            /////
            companyNameset = getAccountData[i].companyname;
            licenceIdset = getAccountData[i].licenseId;
            apiUrlA2cset = getAccountData[i].apiUrlA2c;
            localStorage.setItem('apiUrlA2c', apiUrlA2cset);

            getUsersData();

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
              apiUrlA2c: getAccountData[i].apiUrlA2c,
              licenseId: getAccountData[i].licenseId,
            };
            localStorage.setItem("UserRegisterInfo", JSON.stringify(userAcc));
          }
          ////

        }

      }
    }
  }
  localStorage.setItem("accounts", JSON.stringify(getAccountData));
  localStorage.setItem('isFirstAppLaunch', 'Yes');
  sessionStorage.setItem("AddEdit", "YES");

  toastdata.show(`Successfully Restored`, '3000', 'bottom').subscribe(
    toast => {
      console.log(toast);

    }
  );


}

function getUsersData() {
  
  const fileTransfer: FileTransferObject = transferdata.create();
  restProviderdata.getUsers(licenceIdset, companyNameset).subscribe(
    (result) => {
      let resultObj = JSON.stringify(result);
      let resultData = JSON.parse(resultObj);
      let sucessCode = resultData.Result.SuccessCode;
      if (sucessCode == 200) {
        console.log('sucess');

      } else if (sucessCode == 100) {
        let alert = alertdata.create({
          subTitle: 'Registration key not found on the database.',
          buttons: ['Ok']
        });
        alert.present();
      } else if (sucessCode == 400) {
        let alert = alertdata.create({
          subTitle: 'Request Failed.',
          buttons: ['Ok']
        });
        alert.present();
      } else if (sucessCode == 700) {
        let alert = alertdata.create({
          subTitle: 'User ID not found.',
          buttons: ['Ok']
        });
        alert.present();
      } else {
        console.log('Sucess data' + JSON.stringify(result));
      }
    },
    (error) => {
      console.log('error api' + JSON.stringify(error));
    }
  );
}

var navCtrlnew;
var toastdata;
var loadingdata;
var companyNameset;
var licenceIdset;
var apiUrlA2cset;
var alertdata;
var transferdata;
var filedata;
var restProviderdata;
var deviceId;
var str_array;
var protectionPin;
var accountProtection;









