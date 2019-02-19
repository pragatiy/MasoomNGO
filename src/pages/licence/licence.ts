import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
import { ActionSheetController } from 'ionic-angular';
import { GeneratePinPage } from '../generate-pin/generate-pin';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { LoadingController } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import { commonString } from "../.././app/commonString";
import { SettingPage } from '../setting/setting';
import { Platform } from 'ionic-angular';
/**
* Generated class for the LicencePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-licence',
  templateUrl: 'licence.html',
})
export class LicencePage {
  users: any;
  licenceId: any;
  companyName: any;
  isRegister: any;
  viewLicence: boolean = true;
  accountArr: any = [];
  accountArr1: any = [];
  isAccountProtectionEnable: boolean = true;
  vibration: boolean = true;
  accountProtection: number = 0;
  accountProtectionName: string = "Not Set";
  accountProtectionPin: number = 0;
  defaultimageSrc: any;
  isUserRegister: any;
  loading: any;
  doneBtn:boolean;
  removeSpan:boolean;
  readMore:boolean = true;
  readLess:boolean = false;
  constructor(private ngzone: NgZone, public platform: Platform, public navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private Camera: Camera, public actionSheetCtrl: ActionSheetController, public navParams: NavParams, public restProvider: LicenceAgreementProvider, private transfer: FileTransfer, private file: File) {
   debugger;
   platform.ready().then(() => {

    this.licenceId = navParams.get("licenceId");
    this.companyName = navParams.get("companyName");
    let status = navParams.get("status");
    if (status == 'no') {
       this.viewLicence = false;     
       this.doneBtn = true;
    }else{     
       this.viewLicence = true;
       this.doneBtn = false;
    }
    localStorage.setItem("licenseId", this.licenceId);
    localStorage.setItem("companyName", this.companyName);
    let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
    if (registerUsered) {
      this.isUserRegister = true;
    }
    else {
      this.isUserRegister = false;
    }

    this.loading = this.loadingCtrl.create({
      content: commonString.licensePage.waitMsg,
      });
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LicencePage');
  }

  LicenceAccept() {
    this.getUsersData();
  }

  // Show More Click

  showMore() {  
    debugger;
      this.ngzone.run(() => {
       this.removeSpan = true;
       this.readMore = false;
       this.readLess = true;  
        });
   }

  // show less click
  showLess() {
    debugger;
      this.ngzone.run(() => {
    this.removeSpan = false;
    this.readMore = true;
    this.readLess = false;   
      });
    }


  // get registered user data api respoonse
  getUsersData() {
    try{
    this.loading.present();
    let fileTransfer: FileTransferObject = this.transfer.create();
    this.restProvider.getUsers(this.licenceId, this.companyName).subscribe(
      (result) => {
        debugger;
        let resultObj = JSON.stringify(result);
        let resultData = JSON.parse(resultObj);
        console.log(resultObj);
        let sucessCode = resultData.Result.SuccessCode;
        if (sucessCode == 200) {
          let url = resultData.Result.CompanyIcon;
          this.getDataUri(url, resultData);
        }
        else if (sucessCode == 100) {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.licensePage.errRegistrationKey,
            buttons: ['OK']
          });
          alert.present();
          // alert("Registration key not found on the database.");
        }
        else if (sucessCode == 400) {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.licensePage.requestFailed,
            buttons: ['OK']
          });
          alert.present();
          // alert("Request Failed.");

        }
        else if (sucessCode == 700) {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.licensePage.userIdMsg,
            buttons: ['OK']
          });
          alert.present();
          // alert("User ID not found.");
        }
        else {
          this.loading.dismiss();
          // alert("Unknown error occurred.");
          console.log("Sucess data" + JSON.stringify(result));
        }
      },
      (error) => {
        this.loading.dismiss();
        console.log("error api" + JSON.stringify(error));

      }
    );
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
      localStorage.setItem('defaultimageSrc',
        canvas.toDataURL('image/png'));
    };
    image.src = url;
    setTimeout(() => {
      this.loading.dismiss();
      this.SaveUserData(resultData);
    }, 3000);
   } catch (error) { console.log("Error occured"); }
  }



  SaveUserData(resultData) {
    try{
    if (resultData.Result.PasswordProtected == true) {
      this.AccountProtectionClick(resultData);
    } else {
      this.saveDataUser(resultData);
      this.navCtrl.popToRoot();
    }
      } catch (error) { console.log("Error occured"); }
  }



  // registered user account protection
  AccountProtectionClick(resultData) {
    try{
    let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
    if (totpProtection) {
      if (totpProtection.accountProtectionPin != 0) {
        this.saveDataUser(resultData);
        this.navCtrl.popToRoot();
      } else {
        this.navCtrl.push(GeneratePinPage, { accountProtectionIndex: 2, IsRegisterAcc: 'YES', resultDataGet: resultData });
      }
    } else {
      this.accountProtectionName = commonString.licensePage.PINtxt;
      this.navCtrl.push(GeneratePinPage, { accountProtectionIndex: 2, IsRegisterAcc: 'YES', resultDataGet: resultData });
    }
      } catch (error) { console.log("Error occured"); }
  }

  saveDataUser(resultData) {
    try{
    let apiUrlA2c = localStorage.getItem("apiUrlA2c");
    let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
    this.defaultimageSrc = localStorage.getItem('defaultimageSrc');
    localStorage.setItem('isRegister', 'Yes');
    let userAcc = {
      pushPin: resultData.Result.App_Push_Pin,
      companyname: resultData.Result.companyname,
      SuccessCode: resultData.Result.SuccessCode,
      sessionId: resultData.Result.sessionId,
      tag: resultData.Result.tag,
      CN: resultData.Result.CN,
      CompanyIcon: resultData.Result.CompanyIcon,
      OTPSecretKey: resultData.Result.OTPSecretKey,
      email: resultData.Result.data.email,
      mobile: resultData.Result.data.mobile,
      name: resultData.Result.data.name,
      userName: resultData.Result.userName,
      accountName: resultData.Result.CN,
      imageSrc: this.defaultimageSrc,
      secretKey: resultData.Result.OTPSecretKey,
      isRegister: false,
      accountIndex: 1,
      accountProtectionEnable: resultData.Result.PasswordProtected,
      A2CapiUrl: apiUrlA2c,
      licenseId: this.licenceId,
      accountProtectionPin: totpProtection.accountProtectionPin,
    };
    localStorage.setItem("UserRegisterInfo", JSON.stringify(userAcc));
    let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
    if (oldgetStorage) {
      if (oldgetStorage.length > 0) {
        let index = oldgetStorage.findIndex(obj => obj.accountIndex == 1);
        if (index == -1) {
        }
        else {
          let oldAccount = oldgetStorage[index].pushPin;
          if (oldAccount) {
            oldgetStorage.splice(index, 1);
          }
        }
        let newarr = JSON.stringify(oldgetStorage);
        this.accountArr1 = JSON.parse(newarr);
        oldgetStorage.splice(0, 0, userAcc);
        localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
        this.enableGoogleDrive();
      }
      else {
        userAcc.accountIndex = 1;
        this.accountArr.push(userAcc);
        localStorage.setItem("accounts", JSON.stringify(this.accountArr));
        this.enableGoogleDrive();
      }
    }
    else {
      this.accountArr.push(userAcc);
      userAcc.accountIndex = 1;
      localStorage.setItem("accounts", JSON.stringify(this.accountArr));
      this.enableGoogleDrive();
    }
      } catch (error) { console.log("Error occured"); }
  }


  enableGoogleDrive() {
    try{
    let enableTxt = localStorage.getItem('isEnable');
    if (enableTxt) {
      if (enableTxt == 'Enabled') {
        localStorage.setItem('isEnable', 'Enabled');
        let getAccountData = JSON.parse(localStorage.getItem("accounts"));
        let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
        if (totpProtection) {
          this.accountProtectionPin = totpProtection.accountProtectionPin;
        }
        if (getAccountData) {
          if (getAccountData.length > 0) {
            for (let i = 0; i < getAccountData.length; i++) {
              getAccountData[i].accountProtectionPin = this.accountProtectionPin;
            }
          }
        }
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
                console.log(err);
              });
        }
      } else {
        localStorage.setItem('isEnable', 'Disabled');
      }
    }
      } catch (error) { console.log("Error occured"); }
  }

  // end

  formatDateTime() {
    try{
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

  userProfileClick() {
    this.navCtrl.push(UserProfilePage, { 'backTo': 'license' });
  }

  CancelButton() {
    this.navCtrl.popToRoot();
  }

 doneClick(){
   this.navCtrl.push(SettingPage);
 }

}