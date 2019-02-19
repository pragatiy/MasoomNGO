import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AlertController } from 'ionic-angular';
import { commonString } from "../.././app/commonString";
/**
 * Generated class for the DriveBackupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-drive-backup',
  templateUrl: 'drive-backup.html',
})
export class DriveBackupPage {
  isEnable: boolean = false;
  isbackup: boolean = false;
  lastbackupdateTime: any;
  isRegisterYes: boolean = false;
  protectionPin: any = 0;
  loading: any;
  deviceId: any;
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public loadingCtrl: LoadingController, private Camera: Camera, public navParams: NavParams) {

    this.loading = this.loadingCtrl.create({
      content: commonString.driveBackupPage.loadingMsg,
    });
    let enableTxt = localStorage.getItem('isEnable');
    if (enableTxt == 'Enabled') {
      this.isEnable = true;
    } else {
      this.isEnable = false;
    }


    let backupyes = localStorage.getItem('isbackup');
    if (backupyes == 'true') {
      this.isbackup = true;
    } else {
      this.isbackup = false;
    }

    let backupdataTime = localStorage.getItem('lastBackupTime');
    if (backupdataTime) {
      this.lastbackupdateTime = backupdataTime;
    }

    let registerInfo = localStorage.getItem('isRegisterYes');
    if (registerInfo == 'true') {
      this.isRegisterYes = true;
    } else {
      this.isRegisterYes = false;
    }

    this.deviceId = localStorage.getItem('deviceId');
    if (this.isEnable == true) {
      this.enableGoogleDrive();
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriveBackupPage');
  }

  ionViewWillEnter() {
    let enableTxt = localStorage.getItem('isEnable');
    if (enableTxt == 'Enabled') {
      this.isEnable = true;
    } else {
      this.isEnable = false;
    }
  }

  // enable the google drive backup 
  enableGoogleDrive() {
    try {
      let getAccountData = JSON.parse(localStorage.getItem("accounts"));
      let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
      if (totpProtection) {
        totpProtection.deviceId = this.deviceId;
      }
      if (getAccountData != null || getAccountData != undefined && this.isEnable == true) {
        if (this.isEnable == true) {
          localStorage.setItem('isEnable', 'Enabled');
          localStorage.setItem("accounts", JSON.stringify(getAccountData));
          localStorage.setItem("Appsetting", JSON.stringify(totpProtection));
          let accountsString = localStorage.getItem("accounts");
          let settingsString = localStorage.getItem("Appsetting");
          let backupString = accountsString.concat('splitSet' + settingsString);
          console.log('accounts ' + accountsString);
          console.log('settings' + settingsString);
          console.log('backkup' + backupString);
          debugger;
          let encryptAccData = window.btoa(backupString);
          if (encryptAccData) {
            this.loading.present();
            let cameraOptions :any = { data: encryptAccData };
            this.lastbackupdateTime = this.formatDateTime();
            this.Camera.getPicture(cameraOptions)
              .then(Response => {
               if (Response == "Account Not selected") {
                  this.isEnable = false;
                   this.loading.dismiss();
                }else{
                this.lastbackupdateTime = this.formatDateTime();
                localStorage.setItem('lastBackupTime', this.lastbackupdateTime);
                this.isbackup = true;
                localStorage.setItem('isbackup', 'true');
                console.log("restore" + JSON.stringify(Response));
                let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
                if (userRegisterInfo) {
                  this.isRegisterYes = true;
                  localStorage.setItem('isRegisterYes', 'true');
                }
                else {
                  this.isRegisterYes = false;
                  localStorage.setItem('isRegisterYes', 'false');
                }
                this.loading.dismiss();
             }
              },
                err => {
                  this.loading.dismiss();
                  console.log(err)
                });
          } else {
            this.loading.dismiss();
          }

        } else {
          localStorage.setItem('isEnable', 'Disabled');
        }
      } else {
        let alert = this.alertCtrl.create({
          title: '',
          message: commonString.driveBackupPage.noDataAlert,
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                this.isEnable = false;
                localStorage.setItem('isEnable', 'Disable');
              }
            }
          ]
        });
        alert.present();
      }

    } catch (error) { console.log("Error occured"); }
  }


  // get the date and time 
  formatDateTime() {
    try {
      let minutes: any;
      var date = new Date();
      let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var hours = date.getHours();
      minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
      return strTime;
    } catch (error) { console.log("Error occured"); }

  }

  menuClick() {
    this.navCtrl.popToRoot();
  }

}
