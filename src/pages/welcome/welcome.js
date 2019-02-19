var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from 'ionic-angular';
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { GeneratePinPage } from '../generate-pin/generate-pin';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var WelcomePage = /** @class */ (function () {
    function WelcomePage(restProvider, androidFingerprintAuth, device, transfer, file, navCtrl, platform, appVersion, loadingCtrl, alertCtrl, navParams) {
        var _this = this;
        this.restProvider = restProvider;
        this.androidFingerprintAuth = androidFingerprintAuth;
        this.device = device;
        this.transfer = transfer;
        this.file = file;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.appVersion = appVersion;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.navParams = navParams;
        this.accountArr = [];
        this.accountArr1 = [];
        this.accountProtectionName = 'Not Set';
        this.accountProtection = 0;
        platform.ready().then(function () {
            _this.androidFingerprintAuth.isAvailable()
                .then(function (result) {
                if (result.isAvailable) {
                    _this.fingerprint = true;
                }
                else {
                    _this.fingerprint = false;
                }
            });
            _this.newdeviceId = localStorage.getItem('deviceId');
            platform.registerBackButtonAction(function () {
            });
        });
    }
    WelcomePage.prototype.ionViewDidLoad = function () {
        this.newdeviceId = localStorage.getItem('deviceId');
        console.log('ionViewDidLoad WelcomePage');
    };
    WelcomePage.prototype.redirectToApp = function () {
        localStorage.setItem('isFirstAppLaunch', 'Yes');
        this.navCtrl.popToRoot();
    };
    WelcomePage.prototype.RestoreBackup = function () {
        var _this = this;
        debugger;
        var loading = this.loadingCtrl.create({
            content: 'Please wait while restoring data from Google Drive',
        });
        loading.present();
        this.appVersion.getVersionCode().then(function (driveData) {
            loading.dismiss();
            localStorage.setItem('isFirstAppLaunch', 'Yes');
            var decryptedData = window.atob(driveData);
            console.log('decrypted data' + window.atob(driveData));
            var splittedBackup = decryptedData.split('splitSet', 2);
            console.log('splitted ' + splittedBackup);
            console.log('splitted 0 indexc  ' + splittedBackup[0]);
            console.log('splitted 1 indexc  ' + splittedBackup[1]);
            localStorage.setItem('accounts', splittedBackup[0]);
            var getAccountData = JSON.parse(localStorage.getItem('accounts'));
            if (getAccountData) {
                if (getAccountData.length > 0) {
                    for (var i = 0; i < getAccountData.length; i++) {
                        if (getAccountData[i].accountProtectionPin != 0) {
                            _this.protectionPin = getAccountData[i].accountProtectionPin;
                            _this.accountProtection = 2;
                        }
                        else {
                            _this.protectionPin = 0;
                            _this.accountProtection = 0;
                        }
                        if (getAccountData[i].imageSrc != null && getAccountData[i].imageSrc != '') {
                            if (getAccountData[i].CompanyIcon != '' && getAccountData[i].CompanyIcon != undefined) {
                                _this.companyName = getAccountData[i].companyname;
                                _this.licenceId = getAccountData[i].licenseId;
                                _this.A2CapiUrl = getAccountData[i].A2CapiUrl;
                                localStorage.setItem('apiUrlA2c', _this.A2CapiUrl);
                                _this.getUsersData();
                                var userAcc = {
                                    pushPin: getAccountData[i].App_Push_Pin,
                                    companyname: getAccountData[i].CN,
                                    SuccessCode: getAccountData[i].SuccessCode,
                                    sessionId: getAccountData[i].sessionId,
                                    tag: getAccountData[i].tag,
                                    CN: getAccountData[i].CN,
                                    CompanyIcon: getAccountData[i].CompanyIcon,
                                    OTPSecretKey: getAccountData[i].OTPSecretKey,
                                    email: getAccountData[i].email,
                                    mobile: getAccountData[i].mobile,
                                    name: getAccountData[i].name,
                                    userName: getAccountData[i].userName,
                                    accountName: getAccountData[i].CN,
                                    imageSrc: getAccountData[i].imageSrc,
                                    secretKey: getAccountData[i].OTPSecretKey,
                                    isRegister: false,
                                    accountIndex: 1,
                                    accountProtectionEnable: getAccountData[i].PasswordProtected,
                                    A2CapiUrl: getAccountData[i].A2CapiUrl,
                                    licenseId: getAccountData[i].licenseId,
                                    accountProtectionPin: getAccountData[i].accountProtectionPin,
                                };
                                localStorage.setItem('UserRegisterInfo', JSON.stringify(userAcc));
                            }
                        }
                    }
                }
                localStorage.setItem('accounts', JSON.stringify(getAccountData));
                if (splittedBackup[1] == undefined) {
                    var myObj = {
                        appicationBackup: false,
                        accountProtection: _this.accountProtection,
                        accountProtectionPin: _this.protectionPin,
                        notificationSound: 'default',
                        vibration: true,
                        userRegister: 'unregister',
                        settingProtectionType: 0,
                        isSettingProtect: false
                    };
                    localStorage.setItem('Appsetting', JSON.stringify(myObj));
                    _this.navCtrl.popToRoot();
                }
                else {
                    localStorage.setItem('Appsetting', splittedBackup[1]);
                    var settingBackup = JSON.parse(localStorage.getItem('Appsetting'));
                    var oldDeviceId = settingBackup.deviceId;
                    var newDeviceBackup = JSON.parse(localStorage.getItem('Appsetting'));
                    if (_this.newdeviceId != oldDeviceId) {
                        console.log('new device');
                        localStorage.setItem('ringtoneUrl', 'null');
                        if (_this.fingerprint == false) {
                            if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin != 0) {
                                var alert_1 = _this.alertCtrl.create({
                                    title: '',
                                    subTitle: 'Biometric protection and Notification sound is not restored.',
                                    buttons: ['OK']
                                });
                                alert_1.present();
                                newDeviceBackup.accountProtection = 2;
                                newDeviceBackup.settingProtectionType = 2;
                                _this.navCtrl.popToRoot();
                            }
                            else if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin == 0) {
                                var alert_2 = _this.alertCtrl.create({
                                    title: '',
                                    subTitle: 'Biometric protection and Notification sound is not restored, Please set 4 Digit Pin account protection!',
                                    buttons: ['OK']
                                });
                                alert_2.present();
                                newDeviceBackup.accountProtection = 2;
                                newDeviceBackup.settingProtectionType = 2;
                                _this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 3 });
                            }
                            else if (newDeviceBackup.accountProtection == 2 && newDeviceBackup.accountProtectionPin != 0) {
                                var alert_3 = _this.alertCtrl.create({
                                    title: '',
                                    subTitle: 'Notification sound is not restored.',
                                    buttons: ['OK']
                                });
                                alert_3.present();
                                newDeviceBackup.accountProtection = 2;
                                _this.navCtrl.popToRoot();
                            }
                            else {
                                var alert_4 = _this.alertCtrl.create({
                                    title: '',
                                    subTitle: 'Notification sound is not restored.',
                                    buttons: ['OK']
                                });
                                alert_4.present();
                                newDeviceBackup.accountProtection = 0;
                                _this.navCtrl.popToRoot();
                            }
                            localStorage.setItem('Appsetting', JSON.stringify(newDeviceBackup));
                        }
                        else {
                            var alert_5 = _this.alertCtrl.create({
                                title: '',
                                subTitle: 'Notification sound is not restored.',
                                buttons: ['OK']
                            });
                            alert_5.present();
                            localStorage.setItem('Appsetting', JSON.stringify(newDeviceBackup));
                            _this.navCtrl.popToRoot();
                        }
                    }
                    else {
                        if (settingBackup.notificationSound != 'default') {
                            localStorage.setItem('ringtoneUrl', settingBackup.notificationSound);
                        }
                        console.log('old device');
                        if (_this.fingerprint == false) {
                            if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin != 0) {
                                newDeviceBackup.accountProtection = 2;
                                newDeviceBackup.settingProtectionType = 2;
                                _this.navCtrl.popToRoot();
                            }
                            else if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin == 0) {
                                newDeviceBackup.accountProtection = 2;
                                newDeviceBackup.settingProtectionType = 2;
                                _this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 3 });
                            }
                            else if (newDeviceBackup.accountProtection == 2 && newDeviceBackup.accountProtectionPin != 0) {
                                newDeviceBackup.accountProtection = 2;
                                _this.navCtrl.popToRoot();
                            }
                            else {
                                newDeviceBackup.accountProtection = 0;
                                _this.navCtrl.popToRoot();
                            }
                            localStorage.setItem('Appsetting', JSON.stringify(newDeviceBackup));
                        }
                        else {
                            localStorage.setItem('Appsetting', JSON.stringify(newDeviceBackup));
                            _this.navCtrl.popToRoot();
                        }
                    }
                }
            }
        });
    };
    //get registered user data api respoonse
    WelcomePage.prototype.getUsersData = function () {
        var _this = this;
        var fileTransfer = this.transfer.create();
        this.restProvider.getUsers(this.licenceId, this.companyName).subscribe(function (result) {
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            console.log(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 200) {
                var url = resultData.Result.CompanyIcon;
                var passwordPolicy = JSON.stringify(resultData.Result.passwordPolicy);
                console.log('passwordPolicy' + passwordPolicy);
                localStorage.setItem('passwordPolicy', passwordPolicy);
                _this.getDataUri(url, resultData);
            }
            else if (sucessCode == 100) {
                var alert_6 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['OK']
                });
            }
            else if (sucessCode == 400) {
                var alert_7 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Request Failed.',
                    buttons: ['OK']
                });
            }
            else if (sucessCode == 700) {
                var alert_8 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'User ID not found.',
                    buttons: ['OK']
                });
            }
            else {
                console.log('Sucess data' + JSON.stringify(result));
            }
        }, function (error) {
            console.log('error api' + JSON.stringify(error));
        });
    };
    WelcomePage.prototype.getDataUri = function (url, resultData) {
        var image = new Image();
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            canvas.getContext('2d').drawImage(image, 0, 0);
            localStorage.setItem('defaultimageSrc', canvas.toDataURL('image/png'));
        };
        image.src = url;
    };
    WelcomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-welcome',
            templateUrl: 'welcome.html',
        }),
        __metadata("design:paramtypes", [LicenceAgreementProvider, AndroidFingerprintAuth, Device, FileTransfer, File, NavController, Platform, AppVersion, LoadingController, AlertController, NavParams])
    ], WelcomePage);
    return WelcomePage;
}());
export { WelcomePage };
//# sourceMappingURL=welcome.js.map