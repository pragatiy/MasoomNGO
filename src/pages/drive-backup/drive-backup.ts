import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
/**
 * Generated class for the DriveBackupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var iCloudKV: any;
@IonicPage()
@Component({
  selector: 'page-drive-backup',
  templateUrl: 'drive-backup.html',
})
export class DriveBackupPage {
  isEnable: boolean = false;
  isbackup: boolean = false;
  lastBackupTime: any;
  loading: any;
  isRegisterYes: boolean = false;
  protectionPin: number = 0;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public loadingCtrl: LoadingController, private Camera: Camera, public navParams: NavParams) {

    loadingdata = this.loading;
    loadingdata = this.loadingCtrl.create({
      content: 'Please wait while data is backed up on icloud',
      duration: 3000
    });

    let enableTxt = localStorage.getItem('isEnable');
    if (enableTxt == 'Enable') {
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
      this.lastBackupTime = backupdataTime;
    }

    let registerInfo = localStorage.getItem('isRegisterYes');

    if (registerInfo == 'true') {
      this.isRegisterYes = true;
    } else {
      this.isRegisterYes = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriveBackupPage');
    sessionStorage.setItem("AddEdit", "YES");
  }

  enableIcloud() {
    if (this.isEnable == true) {
      let getAccountData = localStorage.getItem("accounts");
      let oldgetStorageSetting = localStorage.getItem("Appsetting");
      let getStorageToDisplay = localStorage.getItem("accounts");
      if (getStorageToDisplay != 'null' && getStorageToDisplay != 'undefined') {
        loadingdata.present();
        let getStorageToDisplayval = getAccountData.concat('NOSETTING' + oldgetStorageSetting);
        setTimeout(() => { iCloudKV.save("BaackupData", getStorageToDisplayval, this.saveSuccess); }, 3000);
        localStorage.setItem('isEnable', 'Enable');
        this.isbackup = true;
        localStorage.setItem('isbackup', 'true');
        this.lastBackupTime = this.formatDateTime();
        localStorage.setItem('lastBackupTime', this.lastBackupTime);
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        if (userRegisterInfo) {
          this.isRegisterYes = true;
          localStorage.setItem('isRegisterYes', 'true');
        }
        else {
          this.isRegisterYes = false;
          localStorage.setItem('isRegisterYes', 'false');
        }

      }
      else {
        let alert = this.alertCtrl.create({
          title: '',
          message: 'There is no data to Sync.',
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
    }
    else {
      localStorage.setItem('isEnable', 'Disable');
    }
  }

  saveSuccess() {
    loadingdata.dismiss();
    console.log("save data sucessfully");
  }
  formatDateTime() {
    let minutes: any;
    var date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var hours = date.getHours();
    minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;

    return strTime;

  }
}
var loadingdata;
