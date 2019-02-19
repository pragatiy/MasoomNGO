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
    islock: string = 'SlideLock';
    Accepted: string;
    Rejected: string;
    BackColor: any;
    loading: any;
    isUserRegister: Boolean = false;
    cancelBtn:Boolean = true;
    cNane: any;
    ConfirmColor:string;
    sheetOpen:Boolean=false;
    isTimeout:Boolean=false;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        public restProvider: A2cApiProvider,
        public loadingCtrl: LoadingController,
        public mdlctrl: ModalController,
        public app: App,
        private toast: Toast,
        private alertCtrl: AlertController,
        private file: File) {

        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });



        this.notification = navParams.get("notification");
        this.PushFlag = navParams.get("PushFlag");
        let UserInfoStorage = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        this.companyLogo = UserInfoStorage.imageSrc;
        this.cNane = UserInfoStorage.CN;

        if (this.notification) {
            
            if(this.notification.responseUrl){
               localStorage.setItem('dataResponseUrl',this.notification.responseUrl);
            }

            this.firstName = this.notification.firstName;
            this.lastName = this.notification.lastName;
            this.companyName = UserInfoStorage.CN;
            this.appName = this.notification.aps.alert.title;
            this.IPaddress = this.notification.IP;
            this.userName = this.notification.UID;
            if (this.notification.CT == " " && this.notification.S == " ") {
                this.countryCityState = '';
            } else {
                this.countryCityState = this.notification.CT + "," + this.notification.S;
            }
            this.dateTime = this.notification.T;
        }
        else {
            this.appName = "";
            this.companyName = "";
            this.IPaddress = "";
            this.userName = "";
            this.countryCityState = "";
            this.dateTime = "";
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
        debugger;
        this.timer = this.timer - 1;
        if (this.timer == 0) {

            if(this.isTimeout==false){
                if (this.actionSheet) {
                    this.actionSheet.dismiss();
                }
                this.timeoutClick();  
             }
            if (this.actionSheet) {
                this.actionSheet.dismiss();
            }
            this.intervalId.unsubscribe();

             this.app.getRootNav().setRoot(HomePage);
        }
        this.timerCss = Math.round((this.timer) * 10);
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
       
        this.Rejected = '';
        this.Accepted = '';
        this.isSliderTxt = true;
        this.islock = 'SlideLock';
        let percent = item.getSlidingPercent();

        if (percent === -1) {
            this.isTimeout=true;
            if(this.sheetOpen == false){
            this.sheetOpen=true;
            this.cancelBtn = false;
            console.log("negetive");
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
            this.Rejected = 'REJECTED';
            this.isSliderTxt = false;
            this.islock = 'SlideLock';
            this.ConfirmColor = 'RedColor';
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
  

    }

    // Call Method

    RequestMethodforYes() {
        this.intervalId.unsubscribe();
        if (this.PushFlag == "RsetPasswordPush") {
            this.ResetPasswordYes();
        }
        else if (this.PushFlag == "UnlockAccountPush") {
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
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'Request Failed.',
                        buttons: ['Ok']
                    });
                    alert.present();

                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'User ID not found.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'connectivity error.',
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


    }

    //Call API for Push To Phone Yes

    LoginAccountYes() {
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
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'Request Failed.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'User ID not found.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'connectivity error.',
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


    }

    // POPUP for Cancel Button

    cancelActionSheet() {
        if (this.timer == 0) {
        }else{
        if(this.sheetOpen == false){
            this.sheetOpen=true;
        this.actionSheet = this.actionSheetCtrl.create({
            title: 'Message',
            buttons: [
                {
                    text: 'Fraud',
                    role: 'destructive',
                    handler: () => {
                        this.isTimeout=true;
                        this.fraudClick();
                    }
                },
                {
                    text: 'Mistake',
                    handler: () => {
                        console.log('Archive clicked');
                        this.isTimeout=true;
                        this.mistakeClick();
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                        this.isTimeout=true;
                        this.navCtrl.popToRoot();
                    }
                }
            ]
        });

        this.actionSheet.present();
    }else{

    }
}
    }

    //Fraud Api Request

    fraudClick() {
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
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'Request Failed.',
                        buttons: ['Ok']
                    });
                    alert.present();

                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'User ID not found.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'connectivity error.',
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


    }

    //Mistake API Request


    mistakeClick() {
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
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'Request Failed.',
                        buttons: ['Ok']
                    });
                    alert.present();

                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'User ID not found.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'connectivity error.',
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


    }

    timeoutClick() {
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
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else if (sucessCode == 400) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'Request Failed.',
                        buttons: ['Ok']
                    });
                    alert.present();

                }
                else if (sucessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'User ID not found.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
                else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'connectivity error.',
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
