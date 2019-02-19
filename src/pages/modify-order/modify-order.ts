import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { reorderArray } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the ModifyOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modify-order',
  templateUrl: 'modify-order.html',

})

export class ModifyOrderPage {
  index: any;
  names: any;
  reorderIsEnabled: Boolean = true;
  accountName: string = "Account Details";
  protectionPin: any = 0;
  deviceId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private Camera: Camera) {
    this.deviceId = localStorage.getItem('deviceId');
  }

  ionViewWillEnter() {
    let getStorage = JSON.parse(localStorage.getItem("accounts"));
    this.names = getStorage;
  }

  // Modify Account Order and Redirect to Home Page
  modifyAccountOrder() {
    localStorage.setItem("accounts", JSON.stringify(this.names));
    this.enableGoogleDrive();
    this.navCtrl.popToRoot();
  }

  // set the position of the items
  reorderItems($event) {
    this.names = reorderArray(this.names, $event);
  }

  // account backup function 


  enableGoogleDrive() {
    let enableTxt = localStorage.getItem('isEnable');
    if (enableTxt) {
      if (enableTxt == 'Enabled') {
        localStorage.setItem('isEnable', 'Enabled');
        let getAccountData = JSON.parse(localStorage.getItem("accounts"));
        let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
        if (totpProtection) {
          totpProtection.deviceId = this.deviceId;
        }
        localStorage.setItem("Appsetting", JSON.stringify(totpProtection));
        localStorage.setItem("accounts", JSON.stringify(getAccountData));
        let accountsString = localStorage.getItem("accounts");
        let settingsString = localStorage.getItem("Appsetting");
        let backupString = accountsString.concat('splitSet' + settingsString);
        console.log('accounts ' + accountsString);
        console.log('settings' + settingsString);
        console.log('backkup' + backupString);
        let encryptAccData = window.btoa(backupString);
        if (encryptAccData) {
          let cameraOptions :any = { data: encryptAccData };
          this.Camera.getPicture(cameraOptions)
            .then(Response => {
              let lastbackupdateTime = this.formatDateTime();
              localStorage.setItem('lastBackupTime', lastbackupdateTime);
            },
              err => {
                console.log(err)
              });
        }
      } else {
        localStorage.setItem('isEnable', 'Disabled');
      }
    }
  }


  //end

  formatDateTime() {
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
  }
}

