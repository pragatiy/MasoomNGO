import { Component, ViewChild } from '@angular/core';
import { NavController, App, ModalController, NavParams, Navbar, IonicPage, LoadingController } from 'ionic-angular';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { HomePage } from '../home/home';
import { ActionSheetController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Observable } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { PasswordPolicyPage } from '../password-policy/password-policy';
import { UserProfilePage } from "../user-profile/user-profile";
import { commonString } from "../.././app/commonString";
/**
 * Generated class for the ConfirmationScreenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirmation-screen',
  templateUrl: 'confirmation-screen.html',
})
export class ConfirmationScreenPage {
  @ViewChild(Navbar) navBar: Navbar;
  userName: String;
  firstName: String;
  lastName: String;
  appName: String;
  companyName: String;
  IPaddress: any;
  countryCityState: String;
  dateTime: any;
  date: any;
  timeStamp: any;
  PageName: String;
  notification: any;
  PushFlag: any;
  pageTitle: any = '';
  isDisable: boolean = false;
  pushYes: boolean = false;
  timer: number = 10;
  intervalId: any;
  timerCss: any = 100;
  actionSheet: any;
  isSliderTxt: boolean = true;
  companyLogo: any;
  islock: String = 'lockGreenIcon';
  Accepted: String;
  Rejected: String;
  ConfirmColor: string;
  cancelBtn: Boolean = true;
  sheetOpen: Boolean = false;
  isTimeOut: Boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public actionSheetCtrl: ActionSheetController,
    public restProvider: A2cApiProvider,
    public loadingCtrl: LoadingController,
    public mdlctrl: ModalController,
    public platform: Platform,
    private alertCtrl: AlertController,
    private toast: Toast) {
    // when click on cancel option from sheet then go back by device back button to home page 
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        this.app.getRootNav().setRoot(HomePage);
      });
    })

    this.notification = navParams.get('notification');
    this.PushFlag = navParams.get('PushFlag');
    debugger;
    let UserInfoStorage = JSON.parse(localStorage.getItem('UserRegisterInfo'));
    this.companyLogo = UserInfoStorage.CompanyIcon;
    if (this.notification) {
      if (this.notification.additionalData.responseUrl) {
        localStorage.setItem('dataResponseUrl', this.notification.additionalData.responseUrl);
      }


      this.firstName = this.notification.additionalData.firstName;
      this.lastName = this.notification.additionalData.lastName;
      this.companyName = UserInfoStorage.CN;
      this.appName = this.notification.title;
      //  this.companyName = this.notification.additionalData.companyName;
      this.IPaddress = this.notification.additionalData.IP;
      this.userName = this.notification.additionalData.UID;
      if (this.notification.additionalData.CT == ' ' && this.notification.additionalData.S == ' ') {
        this.countryCityState = '';
      } else {
        this.countryCityState = this.notification.additionalData.CT + ',' + this.notification.additionalData.S;
      }
      this.dateTime = this.notification.additionalData.T;
    }
    else {
      this.appName = '';
      this.companyName = '';
      this.IPaddress = '';
      this.userName = '';
      this.countryCityState = '';
      this.dateTime = '';
    }
    if (this.PageName == 'ResetPassword') {
      this.pageTitle = 'Reset Password';
    }
    else {
      this.pageTitle = 'Unlock Account';
    }
    let date = new Date();
    this.timeStamp = date.getTime();
  }


  ionViewWillEnter() {
try{    
    this.intervalId = Observable.interval(1000).subscribe(x => {
      this.timerClick();
    });
  }catch(error){
       console.log("Error occured",error);
  }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // timer counter
  timerClick() {
try{
    this.timer = this.timer - 1;
    if (this.timer == 0) {
      if (this.isTimeOut == false) {
        if (this.actionSheet) {
          this.actionSheet.dismiss();
        }
        this.timeoutClick();
        this.app.getRootNav().setRoot(HomePage);
      }
      this.intervalId.unsubscribe();
      if (this.actionSheet) {
        this.actionSheet.dismiss();
      }

    }
    this.timerCss = Math.round((this.timer) * 10);
     } catch (error) { console.log("Error occured",error); }
  }




  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmationScreenPage');
  }


  ionViewDidEnter() {
    // when click on cancel option from sheet then go back by page back arrow button to home page 
    this.navBar.backButtonClick = () => {
      this.app.getRootNav().setRoot(HomePage);
    };
  }

  ionViewDidLeave() {
    this.intervalId.unsubscribe();
  }

  // slider click
  logDrag(item) {
try{

    this.Rejected = '';
    this.Accepted = '';
    this.isSliderTxt = true;
    this.islock = 'lockGreenIcon';
    let percent = item.getSlidingPercent();
    if (percent == -1) {
      this.isTimeOut = true;
      if (this.sheetOpen == false) {
        this.sheetOpen = true;
        this.cancelBtn = false;
        console.log('negetive');
        this.Accepted = 'Accepted';
        this.isSliderTxt = false;
        this.islock = 'unlockGreenIcon';
        // positive
        this.ConfirmColor = 'GreenColor';
        setTimeout(() => {
          console.log('timeout');
          this.RequestMethodforYes();
        }, 3000);
      }
    } else if (percent == 1) {
      this.cancelBtn = false;
      console.log('positive');
      this.Rejected = 'Rejected';
      this.isSliderTxt = false;
      this.islock = 'lockGreenIcon';
      // negative
      this.ConfirmColor = 'RedColor';
      setTimeout(() => {
        console.log('timeout');
        this.cancelActionSheet();
      }, 3000);

    } else if (percent >= -0.03199837424538352 && percent <= 0.03199837424538352) {
      console.log('middle');
    }
    else {
      console.log('else');
    }
    console.log('percent' + percent);
    if (Math.abs(percent) > 1) {
      console.log('overscroll');
    }
    console.log('percent' + percent);
  }catch(error){
         console.log("Error occured",error);
  }

  }


  // Call Method

  RequestMethodforYes() {
    try{
    this.intervalId.unsubscribe();
    clearInterval(this.intervalId);
    if (this.PushFlag == 'RsetPasswordPush') {
      this.ResetPasswordYes();
    }
    else if (this.PushFlag == 'UnlockAccountPush') {
      this.unlockAccountYes();
    }
    else {
      this.LoginAccountYes();
    }
     } catch (error) { console.log("Error occured",error); }
  }
  // Call API for Reset Password Yes


  ResetPasswordYes() {
    this.navCtrl.push(PasswordPolicyPage);
    debugger;
    this.intervalId.unsubscribe();
    clearInterval(this.intervalId);


  }


  // Call API for Unlock Account Yes
  unlockAccountYes() {
    try {
    this.intervalId.unsubscribe();
    clearInterval(this.intervalId);
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 5000
    });
    let sessionid = localStorage.getItem('sessionId');
    this.restProvider.unlockAccountYes(sessionid).subscribe(
      (result) => {
        console.log(JSON.stringify(result));
        let resultObj = JSON.stringify(result);
        let resultData = JSON.parse(resultObj);
        let sucessCode = resultData.Result.SuccessCode;
        if (sucessCode == 200) {
          loading.dismiss();
          localStorage.setItem('sessionId', resultData.Result.sessionId);
          localStorage.setItem('PushFlag', '');
          this.toast.show(`Success`, '500', 'bottom').subscribe(
            toast => {
              console.log(toast);
            }
          );
          this.app.getRootNav().setRoot(HomePage);
        }
        else if (sucessCode == 100) {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.regKeyErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else if (sucessCode == 400) {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.reqFailedErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else if (sucessCode == 700) {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.userIdErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          console.log('Sucess data' + JSON.stringify(result));
        }
      },
      (error) => {
        console.log('error api' + JSON.stringify(error));
      }
    );
    loading.present();
  }
  catch (error) { console.log("Error occured",error); }
  }

  // Call API for Push To Phone Yes
  LoginAccountYes() {
    try{
    this.intervalId.unsubscribe();
    clearInterval(this.intervalId);
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 5000
    });
    this.restProvider.pushToPhoneYes().subscribe(
      (result) => {
        let resultObj = JSON.stringify(result);
        let resultData = JSON.parse(resultObj);
        let sucessCode = resultData.Result.SuccessCode;
        if (sucessCode == 200) {
          loading.dismiss();
          localStorage.setItem('sessionId', resultData.Result.sessionId);
          localStorage.setItem('PushFlag', '');
          this.toast.show(`Success`, '500', 'bottom').subscribe(
            toast => {
              console.log(toast);
            }
          );
          this.app.getRootNav().setRoot(HomePage);
        }
        else if (sucessCode == 100) {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.regKeyErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else if (sucessCode == 400) {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.reqFailedErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else if (sucessCode == 700) {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.userIdErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          console.log('Sucess data' + JSON.stringify(result));
        }
      },
      (error) => {
        console.log('error api' + JSON.stringify(error));
      }
    );
    loading.present();
  }catch(error)
  {
    console.log("Error occured",error);
  }
  }


  // POPUP for Cancel Button
  cancelActionSheet() {
    try{
    if (this.timer == 0) {
    } else {
      if (this.sheetOpen == false) {
        this.sheetOpen = true;
        this.actionSheet = this.actionSheetCtrl.create({
          title: 'Message',
          buttons: [
            {
              text: 'Fraud',
              role: 'destructive',
              handler: () => {
                this.isTimeOut = true;
                this.fraudClick();
              }
            },
            {
              text: 'Mistake',
              handler: () => {
                console.log('Archive clicked');
                this.isTimeOut = true;
                this.mistakeClick();
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
                this.isTimeOut = true;
                this.app.getRootNav().setRoot(HomePage);
              }
            }
          ]
        });
        this.actionSheet.present();
      } else {

      }
    }
  }catch(error){
    console.log("Error occured",error);
  }
  }

  // Fraud Api Request

  fraudClick() {
    try{
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.intervalId.unsubscribe();
    clearInterval(this.intervalId);
    let sessionid = localStorage.getItem('sessionId');
    this.restProvider.fraudRequest(sessionid, this.PushFlag).subscribe(
      (result) => {
        let resultObj = JSON.stringify(result);
        let resultData = JSON.parse(resultObj);
        let sucessCode = resultData.Result.SuccessCode;
        if (sucessCode == 500) {
          console.log('fraud success');
          loading.dismiss();
          localStorage.setItem('sessionId', resultData.Result.sessionId);
          localStorage.setItem('PushFlag', '');
          this.toast.show(`Success`, '500', 'bottom').subscribe(
            toast => {
              console.log(toast);
            }
          );
          this.app.getRootNav().setRoot(HomePage);
        }
        else if (sucessCode == 100) {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.regKeyErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else if (sucessCode == 400) {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.reqFailedErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else if (sucessCode == 700) {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.userIdErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          loading.dismiss();
          console.log('Sucess data' + JSON.stringify(result));
        }
      },
      (error) => {
        console.log('error api' + JSON.stringify(error));
      }
    );
    loading.present();
}catch(error){
  console.log("Error occured",error);
}
  }

  // Mistake API Request


  mistakeClick() {
    try{
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.intervalId.unsubscribe();
    clearInterval(this.intervalId);
    let sessionid = localStorage.getItem('sessionId');
    this.restProvider.mistakeRequest(sessionid, this.PushFlag).subscribe(
      (result) => {
        let resultObj = JSON.stringify(result);
        let resultData = JSON.parse(resultObj);
        let sucessCode = resultData.Result.SuccessCode;

        if (sucessCode == 500) {
          console.log('mistake success');
          loading.dismiss();
          localStorage.setItem('sessionId', resultData.Result.sessionId);
          localStorage.setItem('PushFlag', '');
          this.toast.show(`Success`, '500', 'bottom').subscribe(
            toast => {
              console.log(toast);
            }
          );
          this.app.getRootNav().setRoot(HomePage);
        }
        else if (sucessCode == 100) {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.regKeyErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else if (sucessCode == 400) {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.reqFailedErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else if (sucessCode == 700) {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: commonString.pushConfirmPage.userIdErr,
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          loading.dismiss();
          console.log('Sucess data' + JSON.stringify(result));
        }
      },
      (error) => {
        console.log('error api' + JSON.stringify(error));
        this.app.getRootNav().setRoot(HomePage);
      }
    );
    loading.present();
}catch(error){
  console.log("Error occured",error);
}
  }

  // timout click 
  timeoutClick() {
    try{
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.intervalId.unsubscribe();
    clearInterval(this.intervalId);
    let sessionid = localStorage.getItem('sessionId');
    this.restProvider.timeoutRequest(sessionid, this.PushFlag).subscribe(
      (result) => {
        let resultObj = JSON.stringify(result);
        let resultData = JSON.parse(resultObj);
        let sucessCode = resultData.Result.SuccessCode;
        if (sucessCode == 500) {
          console.log('timeout success');
          loading.dismiss();
          localStorage.setItem('sessionId', resultData.Result.sessionId);
          localStorage.setItem('PushFlag', '');
          this.toast.show(`Success`, '500', 'bottom').subscribe(
            toast => {
              console.log(toast);
            }
          );
        }
        else {
          loading.dismiss();
          console.log('api failed');
        }
      },
      (error) => {
        console.log('error api' + JSON.stringify(error));
      }
    );
    loading.present();
  }catch(error){
    console.log("Error occured",error);
  }
  }

  // slider click
  toggleClick() {
    this.intervalId.unsubscribe();
    if (this.pushYes == true) {
      this.RequestMethodforYes();
    } else {
      this.cancelActionSheet();
    }
  }

  // Cancel Button 

  CancelButton() {
    this.navCtrl.popToRoot();
  }

  userProfileClick() {
    this.navCtrl.push(UserProfilePage);
  }

}

