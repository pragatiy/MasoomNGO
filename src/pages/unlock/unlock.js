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
var UnlockPage = /** @class */ (function () {
    function UnlockPage(navCtrl, navParams, actionSheetCtrl, restProvider, loadingCtrl, mdlctrl, app, toast, alertCtrl, file) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.actionSheetCtrl = actionSheetCtrl;
        this.restProvider = restProvider;
        this.loadingCtrl = loadingCtrl;
        this.mdlctrl = mdlctrl;
        this.app = app;
        this.toast = toast;
        this.alertCtrl = alertCtrl;
        this.file = file;
        this.pageTitle = "";
        this.isDisable = false;
        this.pushYes = false;
        this.timer = 10;
        this.timerCss = 100;
        this.isSliderTxt = true;
        this.isUserRegister = false;
        this.islock = 'lockGreenIcon';
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.notification = navParams.get("notification");
        this.PushFlag = navParams.get("PushFlag");
        var UserInfoStorage = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        this.companyLogo = UserInfoStorage.imageSrc;
        this.cNane = UserInfoStorage.CN;
        /* if (this.notification) {
           
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
         }*/
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
        if (this.PageName == "ResetPassword") {
            this.pageTitle = "Reset Password";
        }
        else {
            this.pageTitle = "Unlock Account";
        }
        var date = new Date();
        this.timeStamp = date.getTime();
    }
    UnlockPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.intervalId = Observable.interval(1000).subscribe(function (x) {
            _this.timerClick();
        });
        var registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }
    };
    UnlockPage.prototype.userProfileClick = function () {
        this.navCtrl.push(UserProfilePage);
    };
    UnlockPage.prototype.ngOnDestroy = function () {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };
    UnlockPage.prototype.backLogoClick = function () {
        try {
            this.navCtrl.popToRoot();
        }
        catch (error) {
            console.log('error');
        }
    };
    UnlockPage.prototype.timerClick = function () {
        this.timer = this.timer - 1;
        if (this.timer == 0) {
            this.timeoutClick();
            if (this.actionSheet) {
                this.actionSheet.dismiss();
            }
            this.intervalId.unsubscribe();
            this.app.getRootNav().setRoot(HomePage);
        }
        this.timerCss = Math.round((this.timer) * 10);
    };
    UnlockPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.navBar.backButtonClick = function (e) {
            _this.navCtrl.popToRoot();
        };
        console.log('ionViewDidLoad ConfirmationScreenPage');
    };
    UnlockPage.prototype.ionViewDidLeave = function () {
        this.intervalId.unsubscribe();
    };
    // slider click
    UnlockPage.prototype.logDrag = function (item) {
        var _this = this;
        this.Rejected = '';
        this.Accepted = '';
        this.isSliderTxt = true;
        this.islock = 'lockGreenIcon';
        var percent = item.getSlidingPercent();
        if (percent === -1) {
            console.log("negetive");
            this.BackColor = "Red";
            this.Accepted = 'ACCEPTED';
            this.isSliderTxt = false;
            this.islock = 'unlockGreenIcon';
            // positive
            setTimeout(function () { _this.RequestMethodforYes(); }, 3000);
        }
        else if (percent === 1) {
            this.BackColor = "Green";
            console.log("positive");
            this.Rejected = 'REJECTED';
            this.isSliderTxt = false;
            this.islock = 'unlockGreenIcon';
            // negative
            setTimeout(function () { _this.cancelActionSheet(); }, 3000);
        }
        else if (percent >= -0.03199837424538352 && percent <= 0.03199837424538352) {
            console.log("middle");
        }
        else {
            console.log("else");
        }
        console.log('percent' + percent);
        if (Math.abs(percent) > 1) {
            console.log('overscroll');
        }
    };
    // Call Method
    UnlockPage.prototype.RequestMethodforYes = function () {
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
    };
    //Call API for Reset Password Yes
    UnlockPage.prototype.ResetPasswordYes = function () {
        this.intervalId.unsubscribe();
        clearInterval(this.intervalId);
        this.navCtrl.push(PasswordPolicyPage);
        // let sessionid = localStorage.getItem('sessionId');
        // this.restProvider.resetPasswordYes(sessionid).subscribe(
        //     (result) => {
        //         let resultObj = JSON.stringify(result);
        //         let resultData = JSON.parse(resultObj);
        //         let sucessCode = resultData.Result.SuccessCode;
        //         if (sucessCode == 200) {
        //             this.loading.dismiss();
        //             localStorage.setItem('sessionId', resultData.Result.sessionId);
        //             // Extra Code
        //             localStorage.setItem('PushFlag', '');
        //             this.toast.show(`Success`, '500', 'bottom').subscribe(
        //                 toast => {
        //                     console.log(toast);
        //                 }
        //             );
        //             this.navCtrl.popToRoot();
        //             // End
        //         }
        //         else if (sucessCode == 100) {
        //             this.loading.dismiss();
        //             let alert = this.alertCtrl.create({
        //                 subTitle: 'Registration key not found on the database.',
        //                 buttons: ['Ok']
        //             });
        //             alert.present();
        //         }
        //         else if (sucessCode == 400) {
        //             this.loading.dismiss();
        //             let alert = this.alertCtrl.create({
        //                 subTitle: 'Request Failed.',
        //                 buttons: ['Ok']
        //             });
        //             alert.present();
        //         }
        //         else if (sucessCode == 700) {
        //             this.loading.dismiss();
        //             let alert = this.alertCtrl.create({
        //                 subTitle: 'User ID not found.',
        //                 buttons: ['Ok']
        //             });
        //             alert.present();
        //         }
        //         else {
        //             this.loading.dismiss();
        //             let alert = this.alertCtrl.create({
        //                 subTitle: 'connectivity error.',
        //                 buttons: ['Ok']
        //             });
        //             alert.present();
        //             console.log("Sucess data" + JSON.stringify(result));
        //         }
        //     },
        //     (error) => {
        //         console.log("error api" + JSON.stringify(error));
        //     }
        // );
    };
    //Call API for Unlock Account Yes
    UnlockPage.prototype.unlockAccountYes = function () {
        var _this = this;
        debugger;
        this.intervalId.unsubscribe();
        this.loading.present();
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.unlockAccountYes(sessionid).subscribe(function (result) {
            console.log(JSON.stringify(result));
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 200) {
                _this.loading.dismiss();
                localStorage.setItem('sessionId', resultData.Result.sessionId);
                localStorage.setItem('PushFlag', '');
                _this.toast.show("Success", '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
                _this.navCtrl.popToRoot();
            }
            else if (sucessCode == 100) {
                _this.loading.dismiss();
                var alert_1 = _this.alertCtrl.create({
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['Ok']
                });
                alert_1.present();
            }
            else if (sucessCode == 400) {
                _this.loading.dismiss();
                var alert_2 = _this.alertCtrl.create({
                    subTitle: 'Request Failed.',
                    buttons: ['Ok']
                });
                alert_2.present();
            }
            else if (sucessCode == 700) {
                _this.loading.dismiss();
                var alert_3 = _this.alertCtrl.create({
                    subTitle: 'User ID not found.',
                    buttons: ['Ok']
                });
                alert_3.present();
            }
            else {
                _this.loading.dismiss();
                var alert_4 = _this.alertCtrl.create({
                    subTitle: 'connectivity error.',
                    buttons: ['Ok']
                });
                alert_4.present();
                console.log("Sucess data" + JSON.stringify(result));
            }
        }, function (error) {
            console.log("error api" + JSON.stringify(error));
        });
    };
    //Call API for Push To Phone Yes
    UnlockPage.prototype.LoginAccountYes = function () {
        var _this = this;
        this.intervalId.unsubscribe();
        this.loading.present();
        this.restProvider.pushToPhoneYes().subscribe(function (result) {
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 200) {
                _this.loading.dismiss();
                localStorage.setItem('sessionId', resultData.Result.sessionId);
                localStorage.setItem('PushFlag', '');
                _this.toast.show("Success", '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
                _this.navCtrl.popToRoot();
            }
            else if (sucessCode == 100) {
                _this.loading.dismiss();
                var alert_5 = _this.alertCtrl.create({
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['Ok']
                });
                alert_5.present();
            }
            else if (sucessCode == 400) {
                _this.loading.dismiss();
                var alert_6 = _this.alertCtrl.create({
                    subTitle: 'Request Failed.',
                    buttons: ['Ok']
                });
                alert_6.present();
            }
            else if (sucessCode == 700) {
                _this.loading.dismiss();
                var alert_7 = _this.alertCtrl.create({
                    subTitle: 'User ID not found.',
                    buttons: ['Ok']
                });
                alert_7.present();
            }
            else {
                _this.loading.dismiss();
                var alert_8 = _this.alertCtrl.create({
                    subTitle: 'connectivity error.',
                    buttons: ['Ok']
                });
                alert_8.present();
                console.log("Sucess data" + JSON.stringify(result));
            }
        }, function (error) {
            console.log("error api" + JSON.stringify(error));
        });
    };
    // POPUP for Cancel Button
    UnlockPage.prototype.cancelActionSheet = function () {
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
    //Fraud Api Request
    UnlockPage.prototype.fraudClick = function () {
        var _this = this;
        this.intervalId.unsubscribe();
        this.loading.present();
        this.intervalId.unsubscribe();
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.fraudRequest(sessionid, this.PushFlag).subscribe(function (result) {
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 500) {
                _this.loading.dismiss();
                localStorage.setItem('sessionId', resultData.Result.sessionId);
                localStorage.setItem('PushFlag', '');
                _this.toast.show("Success", '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
                _this.navCtrl.popToRoot();
            }
            else if (sucessCode == 100) {
                _this.loading.dismiss();
                var alert_9 = _this.alertCtrl.create({
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['Ok']
                });
                alert_9.present();
            }
            else if (sucessCode == 400) {
                _this.loading.dismiss();
                var alert_10 = _this.alertCtrl.create({
                    subTitle: 'Request Failed.',
                    buttons: ['Ok']
                });
                alert_10.present();
            }
            else if (sucessCode == 700) {
                _this.loading.dismiss();
                var alert_11 = _this.alertCtrl.create({
                    subTitle: 'User ID not found.',
                    buttons: ['Ok']
                });
                alert_11.present();
            }
            else {
                _this.loading.dismiss();
                var alert_12 = _this.alertCtrl.create({
                    subTitle: 'connectivity error.',
                    buttons: ['Ok']
                });
                alert_12.present();
                console.log("Sucess data" + JSON.stringify(result));
            }
        }, function (error) {
            console.log('error');
        });
    };
    //Mistake API Request
    UnlockPage.prototype.mistakeClick = function () {
        var _this = this;
        this.intervalId.unsubscribe();
        this.loading.present();
        this.intervalId.unsubscribe();
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.mistakeRequest(sessionid, this.PushFlag).subscribe(function (result) {
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 500) {
                _this.loading.dismiss();
                localStorage.setItem('sessionId', resultData.Result.sessionId);
                localStorage.setItem('PushFlag', '');
                _this.toast.show("Success", '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
                _this.navCtrl.popToRoot();
            }
            else if (sucessCode == 100) {
                _this.loading.dismiss();
                var alert_13 = _this.alertCtrl.create({
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['Ok']
                });
                alert_13.present();
            }
            else if (sucessCode == 400) {
                _this.loading.dismiss();
                var alert_14 = _this.alertCtrl.create({
                    subTitle: 'Request Failed.',
                    buttons: ['Ok']
                });
                alert_14.present();
            }
            else if (sucessCode == 700) {
                _this.loading.dismiss();
                var alert_15 = _this.alertCtrl.create({
                    subTitle: 'User ID not found.',
                    buttons: ['Ok']
                });
                alert_15.present();
            }
            else {
                _this.loading.dismiss();
                var alert_16 = _this.alertCtrl.create({
                    subTitle: 'connectivity error.',
                    buttons: ['Ok']
                });
                alert_16.present();
                console.log("Sucess data" + JSON.stringify(result));
            }
        }, function (error) {
            console.log('error');
        });
    };
    UnlockPage.prototype.timeoutClick = function () {
        var _this = this;
        this.intervalId.unsubscribe();
        this.loading.present();
        this.intervalId.unsubscribe();
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.timeoutRequest(sessionid, this.PushFlag).subscribe(function (result) {
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 500) {
                _this.loading.dismiss();
                localStorage.setItem('sessionId', resultData.Result.sessionId);
                localStorage.setItem('PushFlag', '');
                _this.toast.show("Success", '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
                _this.navCtrl.popToRoot();
            }
            else if (sucessCode == 100) {
                _this.loading.dismiss();
                var alert_17 = _this.alertCtrl.create({
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['Ok']
                });
                alert_17.present();
            }
            else if (sucessCode == 400) {
                _this.loading.dismiss();
                var alert_18 = _this.alertCtrl.create({
                    subTitle: 'Request Failed.',
                    buttons: ['Ok']
                });
                alert_18.present();
            }
            else if (sucessCode == 700) {
                _this.loading.dismiss();
                var alert_19 = _this.alertCtrl.create({
                    subTitle: 'User ID not found.',
                    buttons: ['Ok']
                });
                alert_19.present();
            }
            else {
                _this.loading.dismiss();
                var alert_20 = _this.alertCtrl.create({
                    subTitle: 'connectivity error.',
                    buttons: ['Ok']
                });
                alert_20.present();
                console.log('connectivity error');
            }
        }, function (error) {
            console.log('error');
        });
    };
    UnlockPage.prototype.toggleClick = function () {
        this.intervalId.unsubscribe();
        if (this.pushYes == true) {
            this.RequestMethodforYes();
        }
        else {
            this.cancelActionSheet();
        }
    };
    // Cancel Button 
    UnlockPage.prototype.CancelButton = function () {
        this.navCtrl.popToRoot();
    };
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], UnlockPage.prototype, "navBar", void 0);
    UnlockPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-unlock',
            templateUrl: 'unlock.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ActionSheetController,
            A2cApiProvider,
            LoadingController,
            ModalController,
            App,
            Toast,
            AlertController,
            File])
    ], UnlockPage);
    return UnlockPage;
}());
export { UnlockPage };
//# sourceMappingURL=unlock.js.map