
import { Component, ViewChild } from '@angular/core';
import { NavController, App, ModalController, NavParams, Navbar, IonicPage, LoadingController, AlertController } from 'ionic-angular';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { HomePage } from '../home/home';
import { ActionSheetController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";
import { File } from '@ionic-native/file';
import { PasswordPolicyPage } from '../password-policy/password-policy';
import { UserProfilePage } from "../user-profile/user-profile";
import { commonString } from "../.././app/commonString";

/**
 * Generated class for the UnlockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-unlock',
    templateUrl: 'unlock.html',
})
export class UnlockPage {

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
    pageTitle: any = "";
    isDisable: boolean = false;
    pushYes: boolean = false;
    timer: number = 10;
    intervalId: any;
    timerCss: any = 100;
    actionSheet: any;
    isSliderTxt: boolean = true;
    companyLogo: any;
    Accepted: string;
    Rejected: string;
    BackColor: any;
    loading: any;
    isUserRegister: Boolean = false;
    cNane: any;
    islock: String = 'lockGreenIcon';
    ConfirmColor: string;
    cancelBtn: Boolean = true;
    sheetOpen: Boolean = false;
    isTimeOut: Boolean = false;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        public restProvider: A2cApiProvider,
        public loadingCtrl: LoadingController,
        public mdlctrl: ModalController,
        public app: App,
        private toast: Toast,
        private alertCtrl: AlertController,
        private file: File
    ) {

        this.loading = this.loadingCtrl.create({
            content: commonString.unlockPage.waitMsg
        });

        this.notification = navParams.get("notification");
        this.PushFlag = navParams.get("PushFlag");
        let UserInfoStorage = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        this.companyLogo = UserInfoStorage.imageSrc;
        this.cNane = UserInfoStorage.CN;

        if (this.notification) {
            if (this.notification.responseUrl) {
                localStorage.setItem('dataResponseUrl', this.notification.responseUrl);
            }

            this.firstName = this.notification.additionalData.firstName;
            this.lastName = this.notification.additionalData.lastName;
            this.companyName = UserInfoStorage.CN;
            this.appName = this.notification.title;
            this.companyName = this.notification.additionalData.companyName;
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

        if (this.PageName == "ResetPassword") {
            this.pageTitle = "Reset Password";
        }
        else {
            this.pageTitle = "Unlock Account";
        }
        let date = new Date();
        this.timeStamp = date.getTime();
    }



    ionViewWillEnter() {
        this.intervalId = Observable.interval(1000).subscribe(x => {
            this.timerClick();
        });

        let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        } else {
            this.isUserRegister = false;
        }

    }

    userProfileClick() {
        this.navCtrl.push(UserProfilePage);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    public backLogoClick() {
        try {
            this.navCtrl.popToRoot();
        } catch (error) {
            console.log('error');
        }
    }

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

            if (this.actionSheet) {
                this.actionSheet.dismiss();
            }
            this.intervalId.unsubscribe();


        }
        this.timerCss = Math.round((this.timer) * 10);
          } catch (error) { console.log("Error occured"); }
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = (e: UIEvent) => {
            this.navCtrl.popToRoot();
        }
        console.log('ionViewDidLoad ConfirmationScreenPage');
    }

    ionViewDidLeave() {
        this.intervalId.unsubscribe();
    }

    // slider click

    logDrag(item) {
        try{
        this.cancelBtn = false;
        this.Rejected = '';
        this.Accepted = '';
        this.isSliderTxt = true;
        this.islock = 'lockGreenIcon';
        let percent = item.getSlidingPercent();

        if (percent === -1) {
            this.isTimeOut = true;
            if (this.sheetOpen == false) {
                this.sheetOpen = true;
                this.cancelBtn = false;
                console.log("negetive", this.Accepted);
                this.BackColor = "Red";
                this.Accepted = 'ACCEPTED';
                this.isSliderTxt = false;
                this.islock = 'unlockGreenIcon';
                this.ConfirmColor = 'GreenColor';
                // positive
                setTimeout(() => { this.RequestMethodforYes(); }, 3000);
            }
        } else if (percent === 1) {
            this.cancelBtn = false;
            this.BackColor = "Green";
            console.log("positive");
            this.Rejected = 'Rejected';
            this.isSliderTxt = false;
            this.islock = 'lockGreenIcon';
            this.ConfirmColor = 'RedColor';
            console.log("negetive", this.Accepted);
            // negative
            setTimeout(() => { this.cancelActionSheet(); }, 3000);


        } else if (percent >= -0.03199837424538352 && percent <= 0.03199837424538352) {
            console.log("middle");
        }

        else {
            console.log("else");
        }

        console.log('percent' + percent);

        if (Math.abs(percent) > 1) {
            console.log('overscroll');
        }
     } catch (error) { console.log("Error occured"); }
   }

    // Call Method

    RequestMethodforYes() {
        this.intervalId.unsubscribe();
        if (this.PushFlag == "RsetPasswordPush") {
            this.ResetPasswordYes();
        }
        else if (this.PushFlag == "UnlockAccountPush") {
            debugger;
            this.unlockAccountYes();
        }
        else {
            this.LoginAccountYes();
        }
    }

    //Call API for Reset Password Yes

    ResetPasswordYes() {
        this.intervalId.unsubscribe();
        clearInterval(this.intervalId);
        this.navCtrl.push(PasswordPolicyPage);

    }

    //Call API for Unlock Account Yes

    unlockAccountYes() {
        debugger;
        try{
        this.intervalId.unsubscribe();
        this.loading.present();
        let sessionid = localStorage.getItem('sessionId');
        this.restProvider.unlockAccountYes(sessionid).subscribe(
            (result) => {
                console.log(JSON.stringify(result));
                let resultObj = JSON.stringify(result);
                let resultData = JSON.parse(resultObj);
                let sucessCode = resultData.Result.SuccessCode;
                if (sucessCode == 200) {
                    this.loading.dismiss();
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    localStorage.setItem('PushFlag', '');
                    this.toast.show(`Success`, '500', 'bottom').subscribe(
                        toast => {
                            console.log(toast);
                        }
                    );
                    this.navCtrl.popToRoot();
                }
                else if (sucessCode == 100) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.errRegistrationKey,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.requestFailed,
                        buttons: ['Ok']
                    });
                    alert.present();

                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.userIdMsg,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.connectivityErr,
                        buttons: ['Ok']
                    });
                    alert.present();
                    console.log("Sucess data" + JSON.stringify(result));
                }

            },
            (error) => {
                console.log("error api" + JSON.stringify(error));

            }
        );
      } catch (error) { console.log("Error occured"); }
    }

    //Call API for Push To Phone Yes

    LoginAccountYes() {
        try{
        this.intervalId.unsubscribe();
        this.loading.present();
        this.restProvider.pushToPhoneYes().subscribe(
            (result) => {
                let resultObj = JSON.stringify(result);
                let resultData = JSON.parse(resultObj);
                let sucessCode = resultData.Result.SuccessCode;
                if (sucessCode == 200) {
                    this.loading.dismiss();
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    localStorage.setItem('PushFlag', '');
                    this.toast.show(`Success`, '500', 'bottom').subscribe(
                        toast => {
                            console.log(toast);
                        }
                    );

                    this.navCtrl.popToRoot();
                }
                else if (sucessCode == 100) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.errRegistrationKey,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.requestFailed,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.userIdMsg,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.connectivityErr,
                        buttons: ['Ok']
                    });
                    alert.present();
                    console.log("Sucess data" + JSON.stringify(result));
                }

            },
            (error) => {
                console.log("error api" + JSON.stringify(error));

            }
        );
       } catch (error) { console.log("Error occured"); }
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
            }
        }
      } catch (error) { console.log("Error occured"); }
    }

    //Fraud Api Request

    fraudClick() {
        try{
        this.intervalId.unsubscribe();
        this.loading.present();

        this.intervalId.unsubscribe();
        let sessionid = localStorage.getItem('sessionId');
        this.restProvider.fraudRequest(sessionid, this.PushFlag).subscribe(
            (result) => {
                let resultObj = JSON.stringify(result);
                let resultData = JSON.parse(resultObj);
                let sucessCode = resultData.Result.SuccessCode;
                if (sucessCode == 500) {
                    this.loading.dismiss();
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    localStorage.setItem('PushFlag', '');
                    this.toast.show(`Success`, '500', 'bottom').subscribe(
                        toast => {
                            console.log(toast);
                        }
                    );

                    this.navCtrl.popToRoot();
                }
                else if (sucessCode == 100) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.errRegistrationKey,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.requestFailed,
                        buttons: ['Ok']
                    });
                    alert.present();

                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.userIdMsg,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.connectivityErr,
                        buttons: ['Ok']
                    });
                    alert.present();
                    console.log("Sucess data" + JSON.stringify(result));
                }

            },
            (error) => {
                console.log('error');
            }
        );
       } catch (error) { console.log("Error occured"); }
    }

    //Mistake API Request

    mistakeClick() {
        try{
        this.intervalId.unsubscribe();
        this.loading.present();
        this.intervalId.unsubscribe();
        let sessionid = localStorage.getItem('sessionId');
        this.restProvider.mistakeRequest(sessionid, this.PushFlag).subscribe(
            (result) => {
                let resultObj = JSON.stringify(result);
                let resultData = JSON.parse(resultObj);
                let sucessCode = resultData.Result.SuccessCode;
                if (sucessCode == 500) {
                    this.loading.dismiss();
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    localStorage.setItem('PushFlag', '');
                    this.toast.show(`Success`, '500', 'bottom').subscribe(
                        toast => {
                            console.log(toast);
                        }
                    );

                    this.navCtrl.popToRoot();
                }
                else if (sucessCode == 100) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.errRegistrationKey,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.requestFailed,
                        buttons: ['Ok']
                    });
                    alert.present();

                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.userIdMsg,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.connectivityErr,
                        buttons: ['Ok']
                    });
                    alert.present();
                    console.log("Sucess data" + JSON.stringify(result));
                }
            },
            (error) => {
                console.log('error');

            }
        );
       } catch (error) { console.log("Error occured"); }
    }

    timeoutClick() {
        debugger;
        try{
        this.intervalId.unsubscribe();
        this.loading.present();

        this.intervalId.unsubscribe();
        let sessionid = localStorage.getItem('sessionId');
        this.restProvider.timeoutRequest(sessionid, this.PushFlag).subscribe(
            (result) => {
                let resultObj = JSON.stringify(result);
                let resultData = JSON.parse(resultObj);
                let sucessCode = resultData.Result.SuccessCode;
                if (sucessCode == 500) {
                    this.loading.dismiss();
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    localStorage.setItem('PushFlag', '');
                    this.toast.show(`Success`, '500', 'bottom').subscribe(
                        toast => {
                            console.log(toast);
                        }
                    );
                    this.navCtrl.popToRoot();
                }
                else if (sucessCode == 100) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.errRegistrationKey,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.requestFailed,
                        buttons: ['Ok']
                    });
                    alert.present();

                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.userIdMsg,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: commonString.unlockPage.connectivityErr,
                        buttons: ['Ok']
                    });
                    alert.present();
                    console.log('connectivity error');
                }

            },
            (error) => {
                console.log('error');

            }
        );
        } catch (error) { console.log("Error occured"); }
    }

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


}


