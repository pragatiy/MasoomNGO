var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
/**
 * Generated class for the ConfirmationScreenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ConfirmationScreenPage = /** @class */ (function () {
    function ConfirmationScreenPage(navCtrl, navParams, app, actionSheetCtrl, restProvider, loadingCtrl, mdlctrl, platform, alertCtrl, toast) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.app = app;
        this.actionSheetCtrl = actionSheetCtrl;
        this.restProvider = restProvider;
        this.loadingCtrl = loadingCtrl;
        this.mdlctrl = mdlctrl;
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        this.toast = toast;
        this.pageTitle = '';
        this.isDisable = false;
        this.pushYes = false;
        this.timer = 10;
        this.timerCss = 100;
        this.isSliderTxt = true;
        this.islock = 'lockGreenIcon';
        // when click on cancel option from sheet then go back by device back button to home page 
        platform.ready().then(function () {
            platform.registerBackButtonAction(function () {
                _this.app.getRootNav().setRoot(HomePage);
            });
        });
        this.notification = navParams.get('notification');
        this.PushFlag = navParams.get('PushFlag');
        debugger;
        var UserInfoStorage = JSON.parse(localStorage.getItem('UserRegisterInfo'));
        this.companyLogo = UserInfoStorage.CompanyIcon;
        if (this.notification) {
            if (this.notification.responseUrl) {
                localStorage.setItem('dataResponseUrl', this.notification.responseUrl);
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
            }
            else {
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
        var date = new Date();
        this.timeStamp = date.getTime();
    }
    ConfirmationScreenPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.intervalId = Observable.interval(1000).subscribe(function (x) {
            _this.timerClick();
        });
    };
    ConfirmationScreenPage.prototype.ngOnDestroy = function () {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };
    // timer counter
    ConfirmationScreenPage.prototype.timerClick = function () {
        this.timer = this.timer - 1;
        if (this.timer == 0) {
            this.timeoutClick();
            this.intervalId.unsubscribe();
            if (this.actionSheet) {
                this.actionSheet.dismiss();
            }
            this.app.getRootNav().setRoot(HomePage);
        }
        this.timerCss = Math.round((this.timer) * 10);
    };
    ConfirmationScreenPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ConfirmationScreenPage');
    };
    ConfirmationScreenPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        // when click on cancel option from sheet then go back by page back arrow button to home page 
        this.navBar.backButtonClick = function () {
            _this.app.getRootNav().setRoot(HomePage);
        };
    };
    ConfirmationScreenPage.prototype.ionViewDidLeave = function () {
        this.intervalId.unsubscribe();
    };
    // slider click
    ConfirmationScreenPage.prototype.logDrag = function (item) {
        var _this = this;
        this.Rejected = '';
        this.Accepted = '';
        this.isSliderTxt = true;
        this.islock = 'lockGreenIcon';
        var percent = item.getSlidingPercent();
        if (percent == -1) {
            console.log('negetive');
            this.Accepted = 'Accepted';
            this.isSliderTxt = false;
            this.islock = 'unlockGreenIcon';
            // positive
            this.ConfirmColor = 'GreenColor';
            setTimeout(function () {
                console.log('timeout');
                _this.RequestMethodforYes();
            }, 3000);
        }
        else if (percent == 1) {
            console.log('positive');
            this.Rejected = 'Rejected';
            this.isSliderTxt = false;
            this.islock = 'unlockGreenIcon';
            // negative
            this.ConfirmColor = 'RedColor';
            setTimeout(function () {
                console.log('timeout');
                _this.cancelActionSheet();
            }, 3000);
        }
        else if (percent >= -0.03199837424538352 && percent <= 0.03199837424538352) {
            console.log('middle');
        }
        else {
            console.log('else');
        }
        console.log('percent' + percent);
        if (Math.abs(percent) > 1) {
            console.log('overscroll');
        }
    };
    // Call Method
    ConfirmationScreenPage.prototype.RequestMethodforYes = function () {
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
    };
    // Call API for Reset Password Yes
    ConfirmationScreenPage.prototype.ResetPasswordYes = function () {
        this.navCtrl.push(PasswordPolicyPage);
        debugger;
        this.intervalId.unsubscribe();
        clearInterval(this.intervalId);
        /*
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        let sessionid = localStorage.getItem('sessionId');
        this.restProvider.resetPasswordYes(sessionid).subscribe(
          (result) => {
            let resultObj = JSON.stringify(result);
            let resultData = JSON.parse(resultObj);
            let sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 200) {
              loading.dismiss();
              localStorage.setItem('sessionId', resultData.Result.sessionId);
                 this.app.getRootNav().setRoot(HomePage);
            }
            else {
              loading.dismiss();
              let alert = this.alertCtrl.create({
                title: '',
                subTitle: 'Connectivity error',
                buttons: ['OK']
              });
              alert.present();
               this.app.getRootNav().setRoot(HomePage);
            }
          },
          (error) => {
            console.log('error api' + JSON.stringify(error));
          }
        );
        loading.present();*/
    };
    // Call API for Unlock Account Yes
    ConfirmationScreenPage.prototype.unlockAccountYes = function () {
        var _this = this;
        this.intervalId.unsubscribe();
        clearInterval(this.intervalId);
        var loading = this.loadingCtrl.create({
            content: 'Please wait...',
            duration: 5000
        });
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.unlockAccountYes(sessionid).subscribe(function (result) {
            console.log(JSON.stringify(result));
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 200) {
                loading.dismiss();
                localStorage.setItem('sessionId', resultData.Result.sessionId);
                localStorage.setItem('PushFlag', '');
                _this.toast.show("Success", '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
                _this.app.getRootNav().setRoot(HomePage);
            }
            else if (sucessCode == 100) {
                var alert_1 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['OK']
                });
                alert_1.present();
            }
            else if (sucessCode == 400) {
                var alert_2 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Request Failed.',
                    buttons: ['OK']
                });
                alert_2.present();
            }
            else if (sucessCode == 700) {
                var alert_3 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'User ID not found.',
                    buttons: ['OK']
                });
                alert_3.present();
            }
            else {
                console.log('Sucess data' + JSON.stringify(result));
            }
        }, function (error) {
            console.log('error api' + JSON.stringify(error));
        });
        loading.present();
    };
    // Call API for Push To Phone Yes
    ConfirmationScreenPage.prototype.LoginAccountYes = function () {
        var _this = this;
        this.intervalId.unsubscribe();
        clearInterval(this.intervalId);
        var loading = this.loadingCtrl.create({
            content: 'Please wait...',
            duration: 5000
        });
        this.restProvider.pushToPhoneYes().subscribe(function (result) {
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 200) {
                loading.dismiss();
                localStorage.setItem('sessionId', resultData.Result.sessionId);
                localStorage.setItem('PushFlag', '');
                _this.toast.show("Success", '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
                _this.app.getRootNav().setRoot(HomePage);
            }
            else if (sucessCode == 100) {
                var alert_4 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['OK']
                });
                alert_4.present();
            }
            else if (sucessCode == 400) {
                var alert_5 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Request Failed.',
                    buttons: ['OK']
                });
                alert_5.present();
            }
            else if (sucessCode == 700) {
                var alert_6 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'User ID not found.',
                    buttons: ['OK']
                });
                alert_6.present();
            }
            else {
                console.log('Sucess data' + JSON.stringify(result));
            }
        }, function (error) {
            console.log('error api' + JSON.stringify(error));
        });
        loading.present();
    };
    // POPUP for Cancel Button
    ConfirmationScreenPage.prototype.cancelActionSheet = function () {
        var _this = this;
        this.actionSheet = this.actionSheetCtrl.create({
            title: 'Message',
            buttons: [
                {
                    text: 'Fraud',
                    role: 'destructive',
                    handler: function () {
                        _this.fraudClick();
                    }
                },
                {
                    text: 'Mistake',
                    handler: function () {
                        console.log('Archive clicked');
                        _this.mistakeClick();
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        this.actionSheet.present();
    };
    // Fraud Api Request
    ConfirmationScreenPage.prototype.fraudClick = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.intervalId.unsubscribe();
        clearInterval(this.intervalId);
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.fraudRequest(sessionid, this.PushFlag).subscribe(function (result) {
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 500) {
                loading.dismiss();
                _this.app.getRootNav().setRoot(HomePage);
            }
            else if (sucessCode == 100) {
                loading.dismiss();
                var alert_7 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['OK']
                });
                alert_7.present();
            }
            else if (sucessCode == 400) {
                loading.dismiss();
                var alert_8 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Request Failed.',
                    buttons: ['OK']
                });
                alert_8.present();
            }
            else if (sucessCode == 700) {
                loading.dismiss();
                var alert_9 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'User ID not found.',
                    buttons: ['OK']
                });
                alert_9.present();
            }
            else {
                loading.dismiss();
                console.log('Sucess data' + JSON.stringify(result));
            }
        }, function (error) {
            console.log('error api' + JSON.stringify(error));
        });
        loading.present();
    };
    // Mistake API Request
    ConfirmationScreenPage.prototype.mistakeClick = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.intervalId.unsubscribe();
        clearInterval(this.intervalId);
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.mistakeRequest(sessionid, this.PushFlag).subscribe(function (result) {
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 500) {
                loading.dismiss();
                _this.app.getRootNav().setRoot(HomePage);
            }
            else if (sucessCode == 100) {
                loading.dismiss();
                var alert_10 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['OK']
                });
                alert_10.present();
            }
            else if (sucessCode == 400) {
                loading.dismiss();
                var alert_11 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Request Failed.',
                    buttons: ['OK']
                });
                alert_11.present();
            }
            else if (sucessCode == 700) {
                loading.dismiss();
                var alert_12 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'User ID not found.',
                    buttons: ['OK']
                });
                alert_12.present();
            }
            else {
                loading.dismiss();
                console.log('Sucess data' + JSON.stringify(result));
            }
        }, function (error) {
            console.log('error api' + JSON.stringify(error));
            _this.app.getRootNav().setRoot(HomePage);
        });
        loading.present();
    };
    // timout click 
    ConfirmationScreenPage.prototype.timeoutClick = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.intervalId.unsubscribe();
        clearInterval(this.intervalId);
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.timeoutRequest(sessionid, this.PushFlag).subscribe(function (result) {
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 500) {
                loading.dismiss();
                localStorage.setItem('sessionId', resultData.Result.sessionId);
                localStorage.setItem('PushFlag', '');
                _this.toast.show("Success", '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
            }
            else {
                loading.dismiss();
                console.log('api failed');
            }
        }, function (error) {
            console.log('error api' + JSON.stringify(error));
        });
        loading.present();
    };
    // slider click
    ConfirmationScreenPage.prototype.toggleClick = function () {
        this.intervalId.unsubscribe();
        if (this.pushYes == true) {
            this.RequestMethodforYes();
        }
        else {
            this.cancelActionSheet();
        }
    };
    // Cancel Button 
    ConfirmationScreenPage.prototype.CancelButton = function () {
        this.navCtrl.popToRoot();
    };
    ConfirmationScreenPage.prototype.userProfileClick = function () {
        this.navCtrl.push(UserProfilePage);
    };
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], ConfirmationScreenPage.prototype, "navBar", void 0);
    ConfirmationScreenPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-confirmation-screen',
            templateUrl: 'confirmation-screen.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            App,
            ActionSheetController,
            A2cApiProvider,
            LoadingController,
            ModalController,
            Platform,
            AlertController,
            Toast])
    ], ConfirmationScreenPage);
    return ConfirmationScreenPage;
}());
export { ConfirmationScreenPage };
//# sourceMappingURL=confirmation-screen.js.map