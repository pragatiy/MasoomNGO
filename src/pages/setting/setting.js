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
import { IonicPage, NavController, LoadingController, NavParams, Navbar } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { GeneratePinPage } from '../generate-pin/generate-pin';
import { LicencePage } from '../licence/licence';
import { AppVersion } from '@ionic-native/app-version';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { Select } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DriveBackupPage } from '../drive-backup/drive-backup';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { UserProfilePage } from '../user-profile/user-profile';
/**
* Generated class for the SettingPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
var SettingPage = /** @class */ (function () {
    //   MobileAppVersion:any = commonString.settingPage.MobileAppVersion;
    function SettingPage(restProvider, androidFingerprintAuth, transfer, file, navCtrl, device, Camera, loadingCtrl, platform, navParams, appVersion, actionSheetCtrl, ringtones, alertCtrl) {
        var _this = this;
        this.restProvider = restProvider;
        this.androidFingerprintAuth = androidFingerprintAuth;
        this.transfer = transfer;
        this.file = file;
        this.navCtrl = navCtrl;
        this.device = device;
        this.Camera = Camera;
        this.loadingCtrl = loadingCtrl;
        this.platform = platform;
        this.navParams = navParams;
        this.appVersion = appVersion;
        this.actionSheetCtrl = actionSheetCtrl;
        this.ringtones = ringtones;
        this.alertCtrl = alertCtrl;
        this.accountProtection = 0;
        this.vibration = true;
        this.accountProtectionPin = 0;
        this.isSettingProtect = false;
        this.settingProtectionType = 0;
        this.accountProtectionName = "Not Set";
        this.PinButtonName = "Create";
        this.isRegisterYes = false;
        this.isDisable = false;
        this.isEnable = 'Disabled';
        this.isRestore = true;
        this.protectionPin = 0;
        this.isUserRegister = false;
        this.btnDisableBio = 'btnDisable';
        this.btnDisablePin = 'btnDisable';
        var registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        var isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');
        this.deviceId = localStorage.getItem('deviceId');
        this.newdeviceId = localStorage.getItem('deviceId');
        if (oldgetStorage != undefined && oldgetStorage != null) {
            oldgetStorage.deviceId = this.deviceId;
            localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
            if ((isFingerPrintEnable == 'yes') && (oldgetStorage.accountProtectionPin != 0)) {
                this.fingerYes = true;
            }
            else {
                this.fingerNo = true;
            }
        }
        else {
            this.fingerNo = true;
        }
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            this.isEnable = enableTxt;
        }
        localStorage.setItem('redirectTo', '');
        this.appVersion.getVersionNumber().then(function (version) {
            _this.MobileAppVersion = version;
            console.log(_this.MobileAppVersion);
        });
        this.ringtones.getRingtone().then(function (ringtones) {
            console.log(ringtones);
            _this.ring = ringtones;
        });
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
            debugger;
            platform.registerBackButtonAction(function () {
                _this.select.close();
                _this.navCtrl.popToRoot();
            });
        });
    }
    SettingPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            this.isEnable = enableTxt;
        }
        var ringtoneUrl = localStorage.getItem('ringtoneUrl');
        if (ringtoneUrl) {
            this.toppings = ringtoneUrl;
        }
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        if (userRegisterInfo) {
            this.isRegister = "Registered";
            this.isRegisterYes = true;
        }
        else {
            this.isRegister = "Not Registered";
            this.isRegisterYes = false;
        }
        this.navBar.backButtonClick = function (e) {
            _this.navCtrl.popToRoot();
        };
        console.log('ionViewDidLoad SettingPage');
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        console.log("oldstotrage" + JSON.stringify(oldgetStorage));
        debugger;
        if (oldgetStorage) {
            this.vibration = oldgetStorage.vibration;
            this.isSettingProtect = oldgetStorage.isSettingProtect;
            if (oldgetStorage.accountProtection == 1) {
                this.ISpeotection = 1;
                this.accountProtectionName = "Biometric";
                this.btnDisableBio = 'btnGreen';
                this.btnDisablePin = 'btnDisable';
            }
            else if (oldgetStorage.accountProtection == 0) {
                this.accountProtectionName = "Not Set ";
                this.ISpeotection = 0;
            }
            else {
                this.accountProtectionName = "4 Digit PIN";
                this.ISpeotection = 2;
                this.btnDisableBio = 'btnDisable';
                this.btnDisablePin = 'btnGreen';
            }
            if (oldgetStorage.accountProtectionPin != 0) {
                this.accountProtection = oldgetStorage.accountProtection;
                var myObj = {
                    appicationBackup: false,
                    accountProtection: this.accountProtection,
                    accountProtectionPin: oldgetStorage.accountProtectionPin,
                    notificationSound: oldgetStorage.notificationSound,
                    vibration: this.vibration,
                    userRegister: "unregister",
                    settingProtectionType: oldgetStorage.settingProtectionType,
                    isSettingProtect: oldgetStorage.isSettingProtect,
                    deviceId: oldgetStorage.deviceId
                };
                AccountSetting(myObj);
                this.PinButtonName = "Reset";
            }
            else if (oldgetStorage.accountProtectionPin == 0) {
            }
            else {
                var myObj = {
                    appicationBackup: false,
                    accountProtection: this.accountProtection,
                    accountProtectionPin: 0,
                    notificationSound: oldgetStorage.notificationSound,
                    vibration: this.vibration,
                    userRegister: "unregister",
                    settingProtectionType: oldgetStorage.settingProtectionType,
                    isSettingProtect: oldgetStorage.isSettingProtect,
                    deviceId: oldgetStorage.deviceId
                };
                AccountSetting(myObj);
                this.PinButtonName = "Create";
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
                settingProtectionType: this.settingProtectionType,
                isSettingProtect: this.isSettingProtect,
                deviceId: this.deviceId
            };
            AccountSetting(myObj);
            this.PinButtonName = "Create";
        }
        console.log('deviceid did load' + this.deviceId);
    };
    // ion will enter 
    SettingPage.prototype.ionViewWillEnter = function () {
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            this.isEnable = enableTxt;
        }
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldgetStorage.accountProtection == 1) {
            this.accountProtectionName = "Biometric";
            this.ISpeotection = 1;
        }
        else if (oldgetStorage.accountProtection == 0) {
            this.ISpeotection = 0;
            if (oldgetStorage.isSettingProtect == true) {
                this.isSettingProtect = oldgetStorage.isSettingProtect;
            }
            else {
                this.isSettingProtect = false;
            }
            this.accountProtectionName = "Not Set ";
        }
        else {
            this.ISpeotection = 2;
            if (oldgetStorage.isSettingProtect == true) {
                this.isSettingProtect = oldgetStorage.isSettingProtect;
            }
            else {
                this.isSettingProtect = false;
            }
            this.accountProtectionName = "4 Digit PIN";
        }
    };
    SettingPage.prototype.ionViewWillLeave = function () {
        console.log("page will leave ");
    };
    // get ringtone url for push notification 
    SettingPage.prototype.selectedRingtone = function (url) {
        localStorage.setItem('ringtoneUrl', url);
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        oldgetStorage.notificationSound = url;
        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        this.enableGoogleDrive();
    };
    SettingPage.prototype.AccountProtectionClick = function () {
        debugger;
        var oldtimeStamp = localStorage.getItem('oldtimeStamp');
        var actionSheet;
        this.accountProtection = 0;
        var isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (isFingerPrintEnable == 'yes' && oldgetStorage.accountProtectionPin != 0) {
        }
        else {
            var oldgetStorage_1 = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorage_1.accountProtectionPin != 0) {
                oldgetStorage_1.accountProtection = 2;
                oldgetStorage_1.settingProtectionType = 2;
                localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage_1));
                this.ISpeotection = 2;
                this.accountProtectionName = "4 Digit PIN";
            }
            else {
                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 1 });
            }
        }
        this.enableGoogleDrive();
    };
    SettingPage.prototype.SetProtectionClick = function (ISpeotection) {
        if (ISpeotection == 1) {
            this.btnDisablePin = 'btnGreen';
            this.btnDisableBio = 'btnDisable';
            var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorage.accountProtectionPin != 0) {
                this.AccountProtectionClickBIO();
            }
            else {
                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 5 });
            }
        }
        else if (ISpeotection == 2) {
            this.btnDisableBio = 'btnGreen';
            this.btnDisablePin = 'btnDisable';
            this.AccountProtectionClickPIN();
        }
        else {
            console.log('none');
        }
        this.enableGoogleDrive();
    };
    SettingPage.prototype.AccountProtectionClickPIN = function () {
        var oldtimeStamp = localStorage.getItem('oldtimeStamp');
        if (oldtimeStamp) {
            localStorage.setItem('oldtimeStamp', '');
        }
        console.log('Destructive clicked');
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldgetStorage.accountProtectionPin != 0) {
            oldgetStorage.accountProtection = 2;
            oldgetStorage.settingProtectionType = 2;
            localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
            this.accountProtectionName = "4 Digit PIN";
        }
        else {
            this.accountProtectionName = "4 Digit PIN";
            this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 1 });
        }
        this.enableGoogleDrive();
    };
    SettingPage.prototype.AccountProtectionClickBIO = function () {
        console.log('Biometric clicked');
        this.accountProtection = 1;
        this.accountProtectionName = "Biometric";
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        oldgetStorage.accountProtection = 1;
        oldgetStorage.settingProtectionType = 1;
        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        this.enableGoogleDrive();
    };
    // Protection Setting Set
    SettingPage.prototype.protectionSetting = function () {
        var oldtimeStamp = localStorage.getItem('oldtimeStamp');
        var seetingpronewstate = this.isSettingProtect;
        if (seetingpronewstate == true) {
            var oldgetStorageprotect = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorageprotect.accountProtection == 0) {
                debugger;
                if (oldgetStorageprotect.accountProtectionPin != 0) {
                    oldgetStorageprotect.isSettingProtect = true;
                    oldgetStorageprotect.settingProtectionType = 2;
                    localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageprotect));
                }
                else {
                    this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 2 });
                }
            }
            else {
                var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
                oldgetStorage.isSettingProtect = seetingpronewstate;
                oldgetStorage.settingProtectionType = oldgetStorage.accountProtection;
                localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
            }
        }
        else {
            var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            oldgetStorage.isSettingProtect = seetingpronewstate;
            oldgetStorage.settingProtectionType = 0;
            localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        }
        this.enableGoogleDrive();
    };
    // Update Vibration
    SettingPage.prototype.updateVibrationfun = function () {
        var newstate = this.vibration;
        this.vibration = newstate;
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        oldgetStorage.vibration = this.vibration;
        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        this.enableGoogleDrive();
    };
    // Update AppSettings
    SettingPage.prototype.clickfun = function () {
        this.navCtrl.push(GeneratePinPage);
    };
    // open license button click
    SettingPage.prototype.openLicence = function () {
        this.navCtrl.push(LicencePage, { status: false });
    };
    SettingPage.prototype.openBackUpPage = function () {
        this.navCtrl.push(DriveBackupPage);
    };
    SettingPage.prototype.restoreBackup = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait while restoring data from Google Drive',
        });
        loading.present();
        this.appVersion.getVersionCode().then(function (driveData) {
            loading.dismiss();
            localStorage.setItem('isFirstAppLaunch', 'Yes');
            localStorage.setItem('isEnable', 'Enabled');
            _this.isEnable = 'Enabled';
            var decryptedData = window.atob(driveData);
            console.log(window.atob(driveData));
            localStorage.removeItem("UserRegisterInfo");
            var splittedBackup = decryptedData.split("splitSet", 2);
            console.log('splitted ' + splittedBackup);
            console.log('splitted 0 indexc  ' + splittedBackup[0]);
            console.log('splitted 1 indexc  ' + splittedBackup[1]);
            localStorage.setItem("accounts", splittedBackup[0]);
            var getAccountData = JSON.parse(localStorage.getItem("accounts"));
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
                        if (getAccountData[i].imageSrc != null && getAccountData[i].imageSrc != "") {
                            if (getAccountData[i].CompanyIcon != '' && getAccountData[i].CompanyIcon != undefined) {
                                // getAccountData[i].imageSrc = getAccountData[i].CompanyIcon;
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
                                    imageSrc: getAccountData[i].CompanyIcon,
                                    secretKey: getAccountData[i].OTPSecretKey,
                                    isRegister: false,
                                    accountIndex: 1,
                                    accountProtectionEnable: getAccountData[i].PasswordProtected,
                                    A2CapiUrl: getAccountData[i].A2CapiUrl,
                                    licenseId: getAccountData[i].licenseId,
                                    accountProtectionPin: getAccountData[i].accountProtectionPin,
                                };
                                localStorage.setItem("UserRegisterInfo", JSON.stringify(userAcc));
                            }
                        }
                    }
                }
                localStorage.setItem("accounts", JSON.stringify(getAccountData));
                if (splittedBackup[1] == undefined) {
                    var myObj = {
                        appicationBackup: false,
                        accountProtection: _this.accountProtection,
                        accountProtectionPin: _this.protectionPin,
                        notificationSound: "default",
                        vibration: true,
                        userRegister: "unregister",
                        settingProtectionType: 0,
                        isSettingProtect: false
                    };
                    localStorage.setItem("Appsetting", JSON.stringify(myObj));
                    _this.navCtrl.popToRoot();
                }
                else {
                    localStorage.setItem("Appsetting", splittedBackup[1]);
                    var settingBackup = JSON.parse(localStorage.getItem("Appsetting"));
                    var oldDeviceId = settingBackup.deviceId;
                    debugger;
                    console.log('device id from backup' + settingBackup.deviceId);
                    var newDeviceBackup = JSON.parse(localStorage.getItem("Appsetting"));
                    if (_this.newdeviceId != oldDeviceId) {
                        console.log("new device");
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
                                debugger;
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
                            localStorage.setItem("Appsetting", JSON.stringify(newDeviceBackup));
                        }
                        else {
                            var alert_5 = _this.alertCtrl.create({
                                title: '',
                                subTitle: 'Notification sound is not restored.',
                                buttons: ['OK']
                            });
                            alert_5.present();
                            localStorage.setItem("Appsetting", JSON.stringify(newDeviceBackup));
                            _this.navCtrl.popToRoot();
                        }
                    }
                    else {
                        if (settingBackup.notificationSound != 'default') {
                            localStorage.setItem('ringtoneUrl', settingBackup.notificationSound);
                        }
                        console.log("old device");
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
                            localStorage.setItem("Appsetting", JSON.stringify(newDeviceBackup));
                        }
                        else {
                            localStorage.setItem("Appsetting", JSON.stringify(newDeviceBackup));
                            _this.navCtrl.popToRoot();
                        }
                    }
                }
            }
        });
    };
    // get registered user data api respoonse
    SettingPage.prototype.getUsersData = function () {
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
                fileTransfer.download(url, _this.file.dataDirectory + 'file.png').then(function (entry) {
                    console.log('download complete: ' + entry.toURL());
                    _this.defaultimageSrc = _this.file.dataDirectory + 'file.png';
                }, function (error) {
                    _this.defaultimageSrc = resultData.Result.CompanyIcon;
                });
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
                console.log("Sucess data" + JSON.stringify(result));
            }
        }, function (error) {
            console.log("error api" + JSON.stringify(error));
        });
    };
    // account backup function 
    SettingPage.prototype.enableGoogleDrive = function () {
        var _this = this;
        debugger;
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            if (enableTxt == 'Enabled') {
                localStorage.setItem('isEnable', 'Enabled');
                var getAccountData = JSON.parse(localStorage.getItem("accounts"));
                var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                if (totpProtection) {
                    this.protectionPin = totpProtection.accountProtectionPin;
                    totpProtection.deviceId = this.deviceId;
                }
                if (getAccountData) {
                    if (getAccountData.length > 0) {
                        for (var i = 0; i < getAccountData.length; i++) {
                            getAccountData[i].accountProtectionPin = this.protectionPin;
                        }
                    }
                }
                localStorage.setItem("accounts", JSON.stringify(getAccountData));
                localStorage.setItem("Appsetting", JSON.stringify(totpProtection));
                var accountsString = localStorage.getItem("accounts");
                var settingsString = localStorage.getItem("Appsetting");
                var backupString = accountsString.concat('splitSet' + settingsString);
                console.log('accounts ' + accountsString);
                console.log('settings' + settingsString);
                console.log('backkup' + backupString);
                //  let getStorage = localStorage.getItem("accounts"); 
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
    SettingPage.prototype.formatDateTime = function () {
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
    SettingPage.prototype.CancelButton = function () {
        this.navCtrl.popToRoot();
    };
    SettingPage.prototype.userProfileClick = function () {
        this.navCtrl.push(UserProfilePage);
    };
    SettingPage.prototype.FinishButton = function () {
        this.navCtrl.popToRoot();
    };
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], SettingPage.prototype, "navBar", void 0);
    __decorate([
        ViewChild('myselect'),
        __metadata("design:type", Select)
    ], SettingPage.prototype, "select", void 0);
    SettingPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-setting',
            templateUrl: 'setting.html',
        }),
        __metadata("design:paramtypes", [LicenceAgreementProvider, AndroidFingerprintAuth, FileTransfer, File, NavController, Device, Camera, LoadingController, Platform, NavParams, AppVersion, ActionSheetController, NativeRingtones, AlertController])
    ], SettingPage);
    return SettingPage;
}());
export { SettingPage };
function AccountSetting(LabelledValue) {
    localStorage.setItem("Appsetting", JSON.stringify(LabelledValue));
}
//# sourceMappingURL=setting.js.map