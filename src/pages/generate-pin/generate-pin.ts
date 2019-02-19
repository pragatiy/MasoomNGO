import { Component, NgZone } from '@angular/core';
import { IonicPage, App, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { EditAccountPage } from "../edit-account/edit-account";
import { ConfirmationScreenPage } from '../confirmation-screen/confirmation-screen';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { PasswordPolicyPage } from '../password-policy/password-policy';
import { ShowTotpPage } from '../show-totp/show-totp';
import { UserProfilePage } from '../user-profile/user-profile';
import { commonString } from "../.././app/commonString";
/**
 * Generated class for the GeneratePinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-generate-pin',
  templateUrl: 'generate-pin.html',
})
export class GeneratePinPage {
  image1: any = 'assets/imgs/EmptyDot.png';
  image2: any = 'assets/imgs/EmptyDot.png';
  image3: any = 'assets/imgs/EmptyDot.png';
  image4: any = 'assets/imgs/EmptyDot.png';
  num: any = '';
  newpin: any = '';
  oldPIN: any = '';
  repass: any = '';
  newUserPIN: any = '';
  confirmPIN: any = '';
  userType: any = '';
  numtype = '';
  accountProtectionIndex: number;
  settingProtectionIndex: number;
  pageTitle: string = 'Enter your user PIN';
  pageHeading: string = commonString.generatePinPage.pageHeading;
  accountIndex: number;
  index: number;
  accountProtection: number = 0;
  vibration: boolean = true;
  accountProtectionPin: number = 0;
  accountProtectionName: string = "None";
  editpage: number;
  notification: string;
  PushFlag: string;
  IsRegisterAcc: string;
  PushFlagTitle: String;
  resultDataGet: any = [];
  accountArr: any = [];
  accountArr1: any = [];
  defaultimageSrc: any;
  licenceId: any;
  selectedACCinObj: any;
  totpPageIndex: any;
  isUserRegister: Boolean = false;
  constructor(private zone: NgZone, private alertCtrl: AlertController, private Camera: Camera, public navCtrl: NavController, public app: App, public platform: Platform, public navParams: NavParams, private loadingCtrl: LoadingController, public restProvider: A2cApiProvider) {
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        this.navCtrl.pop({});
      });
    })
    this.selectedACCinObj = navParams.get("selectedACCinObj");
    this.totpPageIndex = navParams.get("index");
    this.accountIndex = navParams.get("accountIndex");
    this.index = navParams.get("index");
    this.notification = navParams.get("notification");
    this.resultDataGet = navParams.get("resultDataGet");
    this.PushFlag = navParams.get("PushFlag");
    this.IsRegisterAcc = navParams.get("IsRegisterAcc");
    this.editpage = navParams.get("editpage");
    this.PushFlagTitle = navParams.get("pushFlagTitle");
    if (this.PushFlagTitle == "ResetPassword") {
      this.pageHeading = 'Password Reset';
    } else if (this.PushFlagTitle == "UnlockAccount") {
      this.pageHeading = 'Unlock Account';
    } else if (this.PushFlagTitle == "settingPage") {
      this.pageHeading = 'Settings';
    } else if (this.PushFlagTitle == "editAccount") {
      this.pageHeading = 'Account Settings';
    }

    if (navParams.get("accountProtectionIndex") != undefined) {
      this.accountProtectionIndex = navParams.get("accountProtectionIndex");
    }
    else if (navParams.get("accountIndex") != null) {
      this.accountIndex = navParams.get("accountIndex");
    }
    else if (navParams.get("settingProtectionIndex") != undefined) {
      this.settingProtectionIndex = navParams.get("settingProtectionIndex");
    }
    let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
    if (registerUsered) {
      this.isUserRegister = true;
    }
    else {
      this.isUserRegister = false;
    }

    let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
    if (oldgetStorage) {
      let userProtectinPin = oldgetStorage.accountProtectionPin;
      this.oldPIN = "";
      if (userProtectinPin) {
        this.userType = 'old';
        this.numtype = 'oldpass';
      } else {
        this.userType = 'new';
        this.numtype = 'newpass';
        this.pageHeading = 'Configure PIN';
        this.pageTitle = 'Please setup a new PIN';
                
      }
    }
    else {
      let myObj = {
        appicationBackup: false,
        accountProtection: this.accountProtection,
        accountProtectionPin: 0,
        notificationSound: "default",
        vibration: this.vibration,
        userRegister: "unregister",
        settingProtectionType: 0,
        isSettingProtect: false
      };
      localStorage.setItem("Appsetting", JSON.stringify(myObj));
      let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
      let userProtectinPin = oldgetStorage.accountProtectionPin;
      this.oldPIN = "";
      if (userProtectinPin) {
        this.userType = 'old';
        this.numtype = 'oldpass';
      } else {
        this.userType = 'new';
        this.numtype = 'newpass';
        this.pageHeading = 'Configure PIN';
        this.pageTitle = 'Please setup a new PIN';               
      }
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad GeneratePinPage');
  }


  ionViewWillLeave() {
    console.log("page will leave ");
    this.enableGoogleDrive();
  }

  // check entered pin
  CheckNumber() {
    try{
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: commonString.generatePinPage.incorrectPIN,
      buttons: ['Try Again']
    });
    if (this.numtype == 'oldpass') {
      let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
      console.log(oldgetStorage.accountProtectionPin);
      if (oldgetStorage.accountProtectionPin == this.num) {
        let redirectTo = localStorage.getItem('redirectTo');
        if (redirectTo == 'HomePage') {
          this.navCtrl.popToRoot();
        } else if (redirectTo == 'settingPage') {
          this.navCtrl.push(SettingPage);
        }
        else if (redirectTo == 'HomeEditFunc') {
          this.navCtrl.push(EditAccountPage, { accountIndex: this.accountIndex });
        }
        else if (redirectTo == 'ResetPassword') {
          this.CallResetAPI(redirectTo);
        }
        else if (redirectTo == 'UnlockAccount') {
          this.CallResetAPI(redirectTo);
        }
        else if (redirectTo == 'ConfirmationScreen') {
          this.navCtrl.push(ConfirmationScreenPage, { notification: this.notification, PushFlag: this.PushFlag });
        }
        // PageName
        else if (redirectTo == 'HomePageTOTP') {
          // localStorage.setItem('redirectTo', 'TOTPprotection');
          this.navCtrl.push(ShowTotpPage, { 'selectedACCinObj': this.selectedACCinObj, 'index': this.totpPageIndex });
          // this.navCtrl.pop();
        }
        else {
          this.numtype = 'newpass';
          this.num = '';
          this.pageHeading = 'Configure PIN';
          this.pageTitle = 'Enter the new PIN';
          this.btn1Click('');
        }
      } else {
        alert.present();
        this.num = '';
        this.btn1Click('');
      }
    }
    else if (this.numtype == 'newpass') {
      this.newpin = this.num;
      this.numtype = 'repass';
      this.num = '';
       this.pageHeading = 'Confirm PIN'
       this.pageTitle = 'Re-enter the new PIN';
      this.btn1Click('');
    }
    else if (this.numtype == 'repass') {
      this.repass = this.num;
      if (this.repass == this.newpin) {
        if (this.accountProtectionIndex != undefined) {
          let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
          oldgetStorageNew.accountProtectionPin = this.repass;
          oldgetStorageNew.accountProtection = 2;
          localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
          if ((this.IsRegisterAcc == 'YES') && (this.resultDataGet != undefined)) {
            this.defaultimageSrc = localStorage.getItem('defaultimageSrc');
            this.licenceId = localStorage.getItem("licenseId");
            let apiUrlA2c = localStorage.getItem("apiUrlA2c");
            localStorage.setItem('isRegister', 'Yes');
            let userAcc = {
              pushPin: this.resultDataGet.Result.App_Push_Pin,
              companyname: this.resultDataGet.Result.companyname,
              SuccessCode: this.resultDataGet.Result.SuccessCode,
              sessionId: this.resultDataGet.Result.sessionId,
              tag: this.resultDataGet.Result.tag,
              CN: this.resultDataGet.Result.CN,
              CompanyIcon: this.resultDataGet.Result.CompanyIcon,
              OTPSecretKey: this.resultDataGet.Result.OTPSecretKey,
              email: this.resultDataGet.Result.data.email,
              mobile: this.resultDataGet.Result.data.mobile,
              name: this.resultDataGet.Result.data.name,
              userName: this.resultDataGet.Result.userName,
              accountName: this.resultDataGet.Result.CN,
              imageSrc: this.defaultimageSrc,
              secretKey: this.resultDataGet.Result.OTPSecretKey,
              isRegister: false,
              accountIndex: 1,
              accountProtectionEnable: this.resultDataGet.Result.PasswordProtected,
              A2CapiUrl: apiUrlA2c,
              licenseId: this.licenceId,
              accountProtectionPin: this.repass,
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
            this.navCtrl.popToRoot();
          }
          else {
            this.enableGoogleDrive();
            this.navCtrl.push(SettingPage);

          }
        } else if (this.settingProtectionIndex == 3) {
          let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
          oldgetStorageNew.accountProtectionPin = this.repass;
          oldgetStorageNew.accountProtection = 2;
          localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
          this.navCtrl.popToRoot();
        }
        else if (this.settingProtectionIndex == 1) {
          let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
          oldgetStorageNew.accountProtectionPin = this.repass;
          oldgetStorageNew.accountProtection = 2;
          localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
          this.navCtrl.push(SettingPage);

        }
        else if (this.settingProtectionIndex == 5) {

          let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
          oldgetStorageNew.accountProtectionPin = this.repass;
          oldgetStorageNew.accountProtection = 1;
          localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
          this.navCtrl.push(SettingPage);

        }
        else if (this.settingProtectionIndex == 2) {
          let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
          oldgetStorageNew.accountProtectionPin = this.repass;
          oldgetStorageNew.settingProtectionType = 2;
          oldgetStorageNew.isSettingProtect = true;
          oldgetStorageNew.accountProtection = 2;
          localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
          this.navCtrl.push(SettingPage);

        }
        else {
          let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
          oldgetStorageNew.accountProtectionPin = this.repass;
          if (this.accountIndex != null) {
            oldgetStorageNew.accountProtection = 2;
            localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
            this.navCtrl.push(EditAccountPage, { accountIndex: this.accountIndex });

          }
          else {
            localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
            this.navCtrl.push(SettingPage);
          }
        }

      }
      else {
        alert.present();
        this.num = '';
        this.btn1Click('');
      }
    }

       } catch (error) { console.log("Error occured"); }
  }


  //account backup function 
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
                console.log(err)
              });
        }
      } else {
        localStorage.setItem('isEnable', 'Disabled');
      }

    }
     } catch (error) { console.log("Error occured",error); }
  }

  //end

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
     } catch (error) { console.log("Error occured",error); }
  }


  //Call Reset Password API 
  CallResetAPI(PageName) {
    if (PageName == "ResetPassword") {
      //  this.navCtrl.push(PasswordPolicyPage);
      let loading = this.loadingCtrl.create({
        content: commonString.generatePinPage.waitMsg,
        duration: 5000
      });
      this.restProvider.resetPassword().subscribe(
        (result) => {
          let resultObj = JSON.stringify(result);
          let resultData = JSON.parse(resultObj);
          if (resultData.Result.SuccessCode == 200) {
            localStorage.setItem('sessionId', resultData.Result.sessionId);
            loading.dismiss();
            console.log(resultData.Result.sessionId);
            localStorage.setItem('resetPassKey', result.Result.resetPasswordKey);
            let passwordPolicy = JSON.stringify(resultData.Result.passwordPolicy);
            console.log('passwordPolicy' + passwordPolicy);
            localStorage.setItem('passwordPolicy', passwordPolicy);
          }
          else if (resultData.Result.SuccessCode == 100) {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: '',
              subTitle: commonString.generatePinPage.errRegistrationKey,
              buttons: ['Ok']
            });
            alert.present();
          }
          else if (resultData.Result.SuccessCode == 400) {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: '',
              subTitle: commonString.generatePinPage.requestFailed,
              buttons: ['Ok']
            });
            alert.present();
          }
          else if (resultData.Result.SuccessCode == 700) {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: '',
              subTitle: commonString.generatePinPage.userIdMsg,
              buttons: ['Ok']
            });
            alert.present();
          }
          else {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: '',
              subTitle: commonString.generatePinPage.connectivityErr,
              buttons: ['Ok']
            });
            alert.present();
          }
        },
        (error) => {
          loading.dismiss();
          console.log("error api" + JSON.stringify(error));
        });
      loading.present();
    }
    else {
      let loading = this.loadingCtrl.create({
        content: commonString.generatePinPage.waitMsg,
        duration: 5000
      });
      this.restProvider.unlockAccount().subscribe(
        (result) => {
          let resultObj = JSON.stringify(result);
          let resultData = JSON.parse(resultObj);
          if (resultData.Result.SuccessCode == 200) {
            localStorage.setItem('sessionId', resultData.Result.sessionId);
            loading.dismiss();
            console.log(resultData.Result.sessionId);
            this.app.getRootNav().setRoot(HomePage);
          }
          else if (resultData.Result.SuccessCode == 100) {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: '',
              subTitle: commonString.generatePinPage.errRegistrationKey,
              buttons: ['Ok']
            });
            alert.present();
          }
          else if (resultData.Result.SuccessCode == 400) {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: '',
              subTitle: commonString.generatePinPage.requestFailed,
              buttons: ['Ok']
            });
            alert.present();
          }

          else if (resultData.Result.SuccessCode == 700) {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: '',
              subTitle: commonString.generatePinPage.userIdMsg,
              buttons: ['Ok']
            });
            alert.present();
          }
          else {
            loading.dismiss();
          }
        },
        (error) => {
          loading.dismiss();
          console.log("error api" + JSON.stringify(error));
        }
      );
      loading.present();
    }
  }
  //end

  // enter pin click 
  btn1Click(num) {
    try{
    if (num == 'delete') {
      this.num = this.num.substring(0, this.num.length - 1); // "12345.0"
    }
    else {
      if (this.num.length >= 4) {
        return;
      } else {
        this.num += num;
      }
    }
    this.zone.run(() => {
      this.image1 = 'assets/imgs/EmptyDot.png';
      this.image2 = 'assets/imgs/EmptyDot.png';
      this.image3 = 'assets/imgs/EmptyDot.png';
      this.image4 = 'assets/imgs/EmptyDot.png';
    });

    if (this.num.length > 3) {
      this.zone.run(() => {
        this.image1 = 'assets/imgs/BlackDot.png';
        this.image2 = 'assets/imgs/BlackDot.png';
        this.image3 = 'assets/imgs/BlackDot.png';
        this.image4 = 'assets/imgs/BlackDot.png';
      });
    }
    else if (this.num.length > 2) {
      this.zone.run(() => {
        this.image1 = 'assets/imgs/BlackDot.png';
        this.image2 = 'assets/imgs/BlackDot.png';
        this.image3 = 'assets/imgs/BlackDot.png';
      });
    }
    else if (this.num.length > 1) {
      this.zone.run(() => {
        this.image1 = 'assets/imgs/BlackDot.png';
        this.image2 = 'assets/imgs/BlackDot.png';
      });
    }
    else if (this.num.length > 0) {
      this.zone.run(() => {
       this.image1 = 'assets/imgs/BlackDot.png';
        })
    }
    if (this.num.length == 4) {
      setTimeout(() => {
        this.CheckNumber();
      }, 500);

    }
      } catch (error) { console.log("Error occured"); }

  }

  backLogoClick() {
    debugger;
    console.log("logo called");
    this.zone.run(() => {
       console.log("logo zone called");
     this.app.getRootNav().setRoot(HomePage);
   })
  }


  userProfileClick() {
    debugger;
     this.zone.run(() => {
    this.navCtrl.push(UserProfilePage);
     })
  }


}











