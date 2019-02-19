var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
import { ShowTotpPage } from '../show-totp/show-totp';
import { UserProfilePage } from '../user-profile/user-profile';
/**
 * Generated class for the GeneratePinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var GeneratePinPage = /** @class */ (function () {
    function GeneratePinPage(zone, alertCtrl, Camera, navCtrl, app, platform, navParams, loadingCtrl, restProvider) {
        var _this = this;
        this.zone = zone;
        this.alertCtrl = alertCtrl;
        this.Camera = Camera;
        this.navCtrl = navCtrl;
        this.app = app;
        this.platform = platform;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.restProvider = restProvider;
        this.image1 = 'assets/imgs/EmptyDot.png';
        this.image2 = 'assets/imgs/EmptyDot.png';
        this.image3 = 'assets/imgs/EmptyDot.png';
        this.image4 = 'assets/imgs/EmptyDot.png';
        this.num = '';
        this.newpin = '';
        this.oldPIN = '';
        this.repass = '';
        this.newUserPIN = '';
        this.confirmPIN = '';
        this.userType = '';
        this.numtype = '';
        this.pageTitle = 'Enter Your User PIN';
        this.pageHeading = 'Verify PIN';
        this.accountProtection = 0;
        this.vibration = true;
        this.accountProtectionPin = 0;
        this.accountProtectionName = "None";
        this.resultDataGet = [];
        this.accountArr = [];
        this.accountArr1 = [];
        this.isUserRegister = false;
        platform.ready().then(function () {
            platform.registerBackButtonAction(function () {
                _this.navCtrl.pop({});
            });
        });
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
        }
        else if (this.PushFlagTitle == "UnlockAccount") {
            this.pageHeading = 'Unlock Account';
        }
        else if (this.PushFlagTitle == "settingPage") {
            this.pageHeading = 'Settings';
        }
        else if (this.PushFlagTitle == "editAccount") {
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
        var registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldgetStorage) {
            var userProtectinPin = oldgetStorage.accountProtectionPin;
            this.oldPIN = "";
            if (userProtectinPin) {
                this.userType = 'old';
                this.numtype = 'oldpass';
            }
            else {
                this.userType = 'new';
                this.numtype = 'newpass';
                this.pageHeading = 'Configure PIN';
            }
        }
        else {
            var myObj = {
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
            var oldgetStorage_1 = JSON.parse(localStorage.getItem("Appsetting"));
            var userProtectinPin = oldgetStorage_1.accountProtectionPin;
            this.oldPIN = "";
            if (userProtectinPin) {
                this.userType = 'old';
                this.numtype = 'oldpass';
            }
            else {
                this.userType = 'new';
                this.numtype = 'newpass';
                this.pageHeading = 'Configure PIN';
            }
        }
    }
    GeneratePinPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad GeneratePinPage');
    };
    GeneratePinPage.prototype.ionViewWillLeave = function () {
        console.log("page will leave ");
        this.enableGoogleDrive();
    };
    // check entered pin
    GeneratePinPage.prototype.CheckNumber = function () {
        var alert = this.alertCtrl.create({
            title: '',
            subTitle: 'Incorrect PIN Entered',
            buttons: ['Try Again']
        });
        if (this.numtype == 'oldpass') {
            var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            console.log(oldgetStorage.accountProtectionPin);
            if (oldgetStorage.accountProtectionPin == this.num) {
                var redirectTo = localStorage.getItem('redirectTo');
                if (redirectTo == 'HomePage') {
                    this.navCtrl.popToRoot();
                }
                else if (redirectTo == 'settingPage') {
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
            }
            else {
                alert.present();
                this.num = '';
                this.btn1Click('');
            }
        }
        else if (this.numtype == 'newpass') {
            this.newpin = this.num;
            this.numtype = 'repass';
            this.num = '';
            this.pageHeading = 'Confirm PIN';
            this.pageTitle = 'Re-enter the new PIN';
            this.btn1Click('');
        }
        else if (this.numtype == 'repass') {
            this.repass = this.num;
            if (this.repass == this.newpin) {
                if (this.accountProtectionIndex != undefined) {
                    var oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                    oldgetStorageNew.accountProtectionPin = this.repass;
                    oldgetStorageNew.accountProtection = 2;
                    localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                    if ((this.IsRegisterAcc == 'YES') && (this.resultDataGet != undefined)) {
                        this.defaultimageSrc = localStorage.getItem('defaultimageSrc');
                        this.licenceId = localStorage.getItem("licenseId");
                        var apiUrlA2c = localStorage.getItem("apiUrlA2c");
                        localStorage.setItem('isRegister', 'Yes');
                        var userAcc = {
                            pushPin: this.resultDataGet.Result.App_Push_Pin,
                            companyname: this.resultDataGet.Result.CN,
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
                        var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                        if (oldgetStorage) {
                            if (oldgetStorage.length > 0) {
                                var index = oldgetStorage.findIndex(function (obj) { return obj.accountIndex == 1; });
                                if (index == -1) {
                                }
                                else {
                                    var oldAccount = oldgetStorage[index].pushPin;
                                    if (oldAccount) {
                                        oldgetStorage.splice(index, 1);
                                    }
                                }
                                var newarr = JSON.stringify(oldgetStorage);
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
                }
                else if (this.settingProtectionIndex == 3) {
                    var oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                    oldgetStorageNew.accountProtectionPin = this.repass;
                    oldgetStorageNew.accountProtection = 2;
                    localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                    this.navCtrl.popToRoot();
                }
                else if (this.settingProtectionIndex == 1) {
                    var oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                    oldgetStorageNew.accountProtectionPin = this.repass;
                    oldgetStorageNew.accountProtection = 2;
                    localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                    this.navCtrl.push(SettingPage);
                }
                else if (this.settingProtectionIndex == 5) {
                    var oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                    oldgetStorageNew.accountProtectionPin = this.repass;
                    oldgetStorageNew.accountProtection = 1;
                    localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                    this.navCtrl.push(SettingPage);
                }
                else if (this.settingProtectionIndex == 2) {
                    var oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                    oldgetStorageNew.accountProtectionPin = this.repass;
                    oldgetStorageNew.settingProtectionType = 2;
                    oldgetStorageNew.isSettingProtect = true;
                    oldgetStorageNew.accountProtection = 2;
                    localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                    this.navCtrl.push(SettingPage);
                }
                else {
                    var oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
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
    };
    //account backup function 
    GeneratePinPage.prototype.enableGoogleDrive = function () {
        var _this = this;
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            if (enableTxt == 'Enabled') {
                localStorage.setItem('isEnable', 'Enabled');
                var getAccountData = JSON.parse(localStorage.getItem("accounts"));
                var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                if (totpProtection) {
                    this.accountProtectionPin = totpProtection.accountProtectionPin;
                }
                if (getAccountData) {
                    if (getAccountData.length > 0) {
                        for (var i = 0; i < getAccountData.length; i++) {
                            getAccountData[i].accountProtectionPin = this.accountProtectionPin;
                        }
                    }
                }
                localStorage.setItem("accounts", JSON.stringify(getAccountData));
                var accountsString = localStorage.getItem("accounts");
                var settingsString = localStorage.getItem("Appsetting");
                var backupString = accountsString.concat('splitSet' + settingsString);
                console.log('accounts ' + accountsString);
                console.log('settings' + settingsString);
                console.log('backkup' + backupString);
                var encryptAccData = window.btoa(backupString);
                if (encryptAccData) {
                    var cameraOptions = { data: encryptAccData };
                    this.Camera.getPicture(cameraOptions)
                        .then(function (Response) {
                        var lastbackupdateTime = _this.formatDateTime();
                        localStorage.setItem('lastBackupTime', lastbackupdateTime);
                    }, function (err) {
                        console.log(err);
                    });
                }
            }
            else {
                localStorage.setItem('isEnable', 'Disabled');
            }
        }
    };
    //end
    GeneratePinPage.prototype.formatDateTime = function () {
        var minutes;
        var date = new Date();
        var monthNames = ["January", "February", "March", "April", "May", "June",
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
    };
    //Call Reset Password API 
    GeneratePinPage.prototype.CallResetAPI = function (PageName) {
        var _this = this;
        if (PageName == "ResetPassword") {
            //  this.navCtrl.push(PasswordPolicyPage);
            var loading_1 = this.loadingCtrl.create({
                content: 'Please wait...',
                duration: 5000
            });
            this.restProvider.resetPassword().subscribe(function (result) {
                var resultObj = JSON.stringify(result);
                var resultData = JSON.parse(resultObj);
                if (resultData.Result.SuccessCode == 200) {
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    loading_1.dismiss();
                    console.log(resultData.Result.sessionId);
                    localStorage.setItem('resetPassKey', result.Result.resetPasswordKey);
                    var passwordPolicy = JSON.stringify(resultData.Result.passwordPolicy);
                    console.log('passwordPolicy' + passwordPolicy);
                    localStorage.setItem('passwordPolicy', passwordPolicy);
                }
                else if (resultData.Result.SuccessCode == 100) {
                    loading_1.dismiss();
                    var alert_1 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['Ok']
                    });
                    alert_1.present();
                }
                else if (resultData.Result.SuccessCode == 400) {
                    loading_1.dismiss();
                    var alert_2 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Request Failed.',
                        buttons: ['Ok']
                    });
                    alert_2.present();
                }
                else if (resultData.Result.SuccessCode == 700) {
                    loading_1.dismiss();
                    var alert_3 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'User ID not found.',
                        buttons: ['Ok']
                    });
                    alert_3.present();
                }
                else {
                    loading_1.dismiss();
                    var alert_4 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Unknown error occured',
                        buttons: ['Ok']
                    });
                    alert_4.present();
                }
            }, function (error) {
                loading_1.dismiss();
                console.log("error api" + JSON.stringify(error));
            });
            loading_1.present();
        }
        else {
            var loading_2 = this.loadingCtrl.create({
                content: 'Please wait...',
                duration: 5000
            });
            this.restProvider.unlockAccount().subscribe(function (result) {
                var resultObj = JSON.stringify(result);
                var resultData = JSON.parse(resultObj);
                if (resultData.Result.SuccessCode == 200) {
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    loading_2.dismiss();
                    console.log(resultData.Result.sessionId);
                    _this.app.getRootNav().setRoot(HomePage);
                }
                else if (resultData.Result.SuccessCode == 100) {
                    loading_2.dismiss();
                    var alert_5 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['Ok']
                    });
                    alert_5.present();
                }
                else if (resultData.Result.SuccessCode == 400) {
                    loading_2.dismiss();
                    var alert_6 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Request Failed.',
                        buttons: ['Ok']
                    });
                    alert_6.present();
                }
                else if (resultData.Result.SuccessCode == 700) {
                    loading_2.dismiss();
                    var alert_7 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'User ID not found.',
                        buttons: ['Ok']
                    });
                    alert_7.present();
                }
                else {
                    loading_2.dismiss();
                }
            }, function (error) {
                loading_2.dismiss();
                console.log("error api" + JSON.stringify(error));
            });
            loading_2.present();
        }
    };
    //end
    // enter pin click 
    GeneratePinPage.prototype.btn1Click = function (num) {
        var _this = this;
        if (num == 'delete') {
            this.num = this.num.substring(0, this.num.length - 1); // "12345.0"
        }
        else {
            if (this.num.length >= 4) {
                return;
            }
            else {
                this.num += num;
            }
        }
        this.zone.run(function () {
            _this.image1 = 'assets/imgs/EmptyDot.png';
            _this.image2 = 'assets/imgs/EmptyDot.png';
            _this.image3 = 'assets/imgs/EmptyDot.png';
            _this.image4 = 'assets/imgs/EmptyDot.png';
        });
        if (this.num.length > 3) {
            this.zone.run(function () {
                _this.image1 = 'assets/imgs/BlackDot.png';
                _this.image2 = 'assets/imgs/BlackDot.png';
                _this.image3 = 'assets/imgs/BlackDot.png';
                _this.image4 = 'assets/imgs/BlackDot.png';
            });
        }
        else if (this.num.length > 2) {
            this.zone.run(function () {
                _this.image1 = 'assets/imgs/BlackDot.png';
                _this.image2 = 'assets/imgs/BlackDot.png';
                _this.image3 = 'assets/imgs/BlackDot.png';
            });
        }
        else if (this.num.length > 1) {
            this.zone.run(function () {
                _this.image1 = 'assets/imgs/BlackDot.png';
                _this.image2 = 'assets/imgs/BlackDot.png';
            });
        }
        else if (this.num.length > 0) {
            this.zone.run(function () { _this.image1 = 'assets/imgs/BlackDot.png'; });
        }
        if (this.num.length == 4) {
            setTimeout(function () {
                _this.CheckNumber();
            }, 500);
        }
    };
    GeneratePinPage.prototype.backLogoClick = function () {
        this.navCtrl.popToRoot();
    };
    GeneratePinPage.prototype.userProfileClick = function () {
        this.navCtrl.push(UserProfilePage);
    };
    GeneratePinPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-generate-pin',
            templateUrl: 'generate-pin.html',
        }),
        __metadata("design:paramtypes", [NgZone, AlertController, Camera, NavController, App, Platform, NavParams, LoadingController, A2cApiProvider])
    ], GeneratePinPage);
    return GeneratePinPage;
}());
export { GeneratePinPage };
//# sourceMappingURL=generate-pin.js.map