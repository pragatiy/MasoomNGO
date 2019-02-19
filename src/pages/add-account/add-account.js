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
//import { Injectable } from '@angular/core';
//import { File } from '@ionic-native/file';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { SettingPage } from '../setting/setting';
import * as jsSHA from "jssha";
import { commonString } from "../.././app/commonString";
import { Platform } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
/**
* Generated class for the AddAccountPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
var AddAccountPage = /** @class */ (function () {
    function AddAccountPage(navCtrl, loadingCtrl, navParams, zone, app, platform, barcodeScanner, Camera, actionSheetCtrl, alertCtrl, toast) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.zone = zone;
        this.app = app;
        this.platform = platform;
        this.barcodeScanner = barcodeScanner;
        this.Camera = Camera;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.toast = toast;
        this.accountIndex = 2;
        this.accountArr = [];
        this.accountArr1 = [];
        this.imageSrc = 'assets/imgs/user_img_new.jpg';
        this.accountProtectionEnable = false;
        this.protectionSet = "Disable";
        this.isDisable = false;
        this.protectionPin = 0;
        this.hideScan = true;
        this.isUserRegister = false;
        this.getBarcodeResult = navParams.get('barcodeResult');
        this.accountName = navParams.get('issuer_accountName');
        this.accountId = navParams.get('resaccountid');
        var iconName = navParams.get('iconName');
        if (iconName) {
            this.accountName = iconName;
            this.imageSrc = 'assets/accounticons/' + iconName + '.png';
        }
        if (this.accountName !== undefined) {
            this.imageSrc = 'assets/accounticons/' + this.accountName + '.png';
        }
        var registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }
        platform.ready().then(function () {
            // device back button event 
            platform.registerBackButtonAction(function () {
                _this.backbuttonClick();
            });
            // app back button event 
            _this.navBar.backButtonClick = function (e) {
                _this.backbuttonClick();
            };
        });
        this.hideBarcodeBtn = localStorage.getItem('hideScanBtn');
        if (this.hideBarcodeBtn == 'yes') {
            this.hideScan = false;
        }
        else {
            this.hideScan = true;
        }
        if (this.getBarcodeResult) {
            this.pageHeading = commonString.addAccPage.pageHeadingQR;
        }
        else {
            this.pageHeading = commonString.addAccPage.pageHeadingManual;
        }
        if (this.getBarcodeResult) {
            this.isRescan = 'RESCAN';
        }
        else {
            this.isRescan = 'SCAN';
        }
        this.deviceId = localStorage.getItem('deviceId');
    }
    AddAccountPage.prototype.ionViewWillEnter = function () {
        this.hideBarcodeBtn = localStorage.getItem('hideScanBtn');
        if (this.hideBarcodeBtn == 'yes') {
            this.hideScan = false;
        }
        else {
            this.hideScan = true;
        }
    };
    // if back button is clicked without saving data
    AddAccountPage.prototype.backbuttonClick = function () {
        if (this.accountName || this.accountId || this.getBarcodeResult) {
            this.backbuttonAlert();
        }
        else {
            this.navCtrl.pop();
        }
    };
    AddAccountPage.prototype.backbuttonAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: '',
            message: 'You have some unsaved data! Would you like to save it?',
            buttons: [
                {
                    text: 'No',
                    role: 'No',
                    handler: function () {
                        console.log('No clicked');
                        _this.navCtrl.pop();
                    }
                },
                {
                    text: 'Yes',
                    handler: function () {
                        _this.addAccountCheck();
                        console.log('Yes clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    AddAccountPage.prototype.ionViewDidLoad = function () {
        console.log("Add Account Page");
    };
    // add account details function
    AddAccountPage.prototype.addAccountCheck = function () {
        try {
            this.checkAccount();
            if (this.flag == 0) {
                return;
            }
            this.checkAccountName();
            if (this.flag == 0) {
                return;
            }
            this.checkSecrekey(this.getBarcodeResult);
            if (this.flag == 0) {
                return;
            }
            this.checkAccountID();
            if (this.flag == 0) {
                return;
            }
            var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
            if (totpProtection) {
                this.protectionPin = totpProtection.accountProtectionPin;
            }
            var personAcc = {
                accountId: this.accountId,
                accountName: this.accountName,
                secretKey: this.getBarcodeResult,
                accountIndex: 2,
                otpValue: '',
                imageSrc: this.imageSrc,
                accountProtectionEnable: this.accountProtectionEnable,
                isRegister: true,
                accountProtectionPin: this.protectionPin,
            };
            var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
            personAcc.accountId = this.accountId.trim();
            personAcc.accountName = this.accountName.trim();
            personAcc.secretKey = this.getBarcodeResult.trim();
            if (oldgetStorage) {
                if (oldgetStorage.length > 0) {
                    var newarr = JSON.stringify(oldgetStorage);
                    this.accountArr1 = JSON.parse(newarr);
                    var maxId = Math.max.apply(Math, this.accountArr1.map(function (item) { return item.accountIndex; })) + 1;
                    personAcc.accountIndex = maxId;
                    oldgetStorage.push(personAcc);
                    localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                    this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(function (toast) {
                        console.log(toast);
                    });
                    this.enableGoogleDrive();
                    this.navCtrl.popToRoot();
                }
                else {
                    personAcc.accountIndex = 2;
                    this.accountArr.push(personAcc);
                    localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                    this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(function (toast) {
                        console.log(toast);
                    });
                    this.enableGoogleDrive();
                    this.navCtrl.popToRoot();
                }
            }
            else {
                personAcc.accountIndex = 2;
                this.accountArr.push(personAcc);
                localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
                this.enableGoogleDrive();
                this.navCtrl.popToRoot();
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Form Validation 
    AddAccountPage.prototype.checkAccount = function () {
        try {
            if (this.accountName == undefined) {
                this.erroraccountName = commonString.addAccPage.erroraccountName;
                this.flag = 0;
            }
            if (this.accountId == undefined) {
                this.erroraccountId = commonString.addAccPage.erroraccountId;
                this.flag = 0;
            }
            if (this.getBarcodeResult == undefined) {
                this.errorSecretkey = commonString.addAccPage.errorSecretkey;
                this.flag = 0;
            }
            if (this.getBarcodeResult == '') {
                this.errorSecretkey = commonString.addAccPage.errorSecretkey;
                this.flag = 0;
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Form Validation
    AddAccountPage.prototype.onKeySecret = function (event) {
        try {
            this.checkSecrekey(this.getBarcodeResult);
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Form Validation
    AddAccountPage.prototype.checkSecrekey = function (getBarcodeResult) {
        try {
            this.checValidKey(getBarcodeResult);
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Check Account Name
    AddAccountPage.prototype.onKeyAccountName = function (event) {
        this.checkAccountName();
    };
    // Check Account Name
    AddAccountPage.prototype.checkAccountName = function () {
        try {
            var accountName = this.accountName;
            this.flag = 1;
            if (accountName.length <= 0) {
                this.erroraccountName = commonString.addAccPage.erroraccountName;
                this.flag = 0;
            }
            else {
                this.erroraccountName = "";
                this.flag = 1;
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Check Account ID
    AddAccountPage.prototype.onKeyAccountID = function (event) {
        this.checkAccountID();
    };
    // Check Account ID
    AddAccountPage.prototype.checkAccountID = function () {
        try {
            var accountId = this.accountId;
            this.flag = 1;
            if (accountId.length <= 0) {
                this.erroraccountId = commonString.addAccPage.erroraccountId;
                this.flag = 0;
            }
            else {
                this.erroraccountId = "";
                this.flag = 1;
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Check Valid Secret Key
    AddAccountPage.prototype.dec2hex = function (value) {
        return (value < 15.5 ? "0" : "") + Math.round(value).toString(16);
    };
    AddAccountPage.prototype.hex2dec = function (value) {
        return parseInt(value, 16);
    };
    AddAccountPage.prototype.leftpad = function (value, length, pad) {
        if (length + 1 >= value.length) {
            value = Array(length + 1 - value.length).join(pad) + value;
        }
        return value;
    };
    AddAccountPage.prototype.base32tohex = function (base32) {
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = "";
        var hex = "";
        for (var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += this.leftpad(val.toString(2), 5, '0');
        }
        for (var i = 0; i + 4 <= bits.length; i += 4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    };
    // Check Valid Secret Key
    AddAccountPage.prototype.checValidKey = function (getBarcodeResult) {
        try {
            var epoch = Math.round(new Date().getTime() / 1000.0);
            var time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, "0");
            var hmacObj = new jsSHA(time, "HEX");
            var hmac = hmacObj.getHMAC(this.base32tohex(getBarcodeResult), "HEX", "SHA-1", "HEX");
            var offset = this.hex2dec(hmac.substring(hmac.length - 1));
            var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
            this.errorSecretkey = "";
            this.flag = 1;
        }
        catch (error) {
            console.log("Error occured");
            this.errorSecretkey = "Invalid Secret Key";
            this.flag = 0;
        }
    };
    ///Browse Image  Code
    AddAccountPage.prototype.browseImgClick = function () {
        var _this = this;
        try {
            var actionSheet = this.actionSheetCtrl.create({
                title: 'Select account icon',
                buttons: [
                    {
                        text: 'Take Photo',
                        role: 'destructive',
                        handler: function () {
                            console.log('Destructive clicked');
                            var cameraOptions = {
                                sourceType: _this.Camera.PictureSourceType.CAMERA,
                                destinationType: _this.Camera.DestinationType.DATA_URL,
                                quality: 100,
                                targetWidth: 1000,
                                targetHeight: 1000,
                                encodingType: _this.Camera.EncodingType.JPEG,
                                correctOrientation: true
                            };
                            _this.Camera.getPicture(cameraOptions)
                                .then(function (file_uri) {
                                _this.zone.run(function () {
                                    _this.imageSrc = "data:image/jpeg;base64," + file_uri;
                                });
                            }, function (err) { return console.log(err); });
                        }
                    }, {
                        text: 'Choose from Gallery',
                        handler: function () {
                            console.log('Archive clicked');
                            var cameraOptions = {
                                sourceType: _this.Camera.PictureSourceType.PHOTOLIBRARY,
                                destinationType: _this.Camera.DestinationType.DATA_URL,
                                quality: 100,
                                targetWidth: 1000,
                                targetHeight: 1000,
                                encodingType: _this.Camera.EncodingType.JPEG,
                                correctOrientation: true
                            };
                            _this.Camera.getPicture(cameraOptions)
                                .then(function (file_uri) {
                                _this.zone.run(function () {
                                    _this.imageSrc = "data:image/jpeg;base64," + file_uri;
                                });
                            }, function (err) { return console.log(err); });
                        }
                    }
                ]
            });
            actionSheet.present();
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // get barcode result
    AddAccountPage.prototype.barcodeClick = function () {
        var _this = this;
        try {
            this.barcodeScanner.scan().then(function (barcodeData) {
                console.log(barcodeData.text);
                var newSecretKey;
                if (barcodeData.text.includes("secret") == true) {
                    if (barcodeData.text) {
                        _this.isRescan = 'RESCAN';
                    }
                    else {
                        _this.isRescan = 'SCAN';
                    }
                    var res = barcodeData.text.split('secret');
                    res = res[1].split('=');
                    newSecretKey = res[1];
                    if (res.length > 2) {
                        newSecretKey = newSecretKey.substring(0, newSecretKey.indexOf("&"));
                    }
                    _this.getBarcodeResult = newSecretKey;
                    _this.checkSecrekey(_this.getBarcodeResult);
                }
                else if (barcodeData.text == "BACK_PRESSED") {
                    _this.getBarcodeResult = '';
                    _this.checkSecrekey(_this.getBarcodeResult);
                }
                else if (barcodeData.text == "BUTTON_PRESSED") {
                    _this.getBarcodeResult = '';
                    _this.checkSecrekey(_this.getBarcodeResult);
                }
                else if (barcodeData.text.includes("/") == true) {
                    var res = barcodeData.text.split('/');
                    var barcodeDataresult = res[res.length - 1];
                    _this.getBarcodeResult = barcodeDataresult;
                    _this.checkSecrekey(_this.getBarcodeResult);
                }
                else {
                    _this.getBarcodeResult = barcodeData.text;
                    _this.checkSecrekey(_this.getBarcodeResult);
                }
            }, function (err) {
                console.log("Error occured : " + err);
            });
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Account Protection Click
    AddAccountPage.prototype.toggleClick = function () {
        var _this = this;
        try {
            var newacc = this.accountProtectionEnable;
            if (newacc == true) {
                var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
                if (oldgetStorage) {
                    if (oldgetStorage.accountProtection !== 0) {
                        this.protectionSet = "Enable";
                    }
                    else {
                        try {
                            var alert_1 = this.alertCtrl.create({
                                title: '',
                                message: 'To use this feature please enable “Select Protection Type” option from Settings screen.</br> Would you like to do it now?',
                                buttons: [
                                    {
                                        text: 'No',
                                        role: 'cancel',
                                        handler: function () {
                                            console.log('Cancel clicked');
                                            _this.accountProtectionEnable = false;
                                        }
                                    },
                                    {
                                        text: 'Yes',
                                        handler: function () {
                                            console.log('Buy clicked');
                                            _this.checkAccount();
                                            if (_this.flag == 0) {
                                                alert_1.dismiss();
                                                _this.accountProtectionEnable = false;
                                                return;
                                            }
                                            var personAcc = {
                                                accountId: _this.accountId,
                                                accountName: _this.accountName,
                                                secretKey: _this.getBarcodeResult,
                                                accountIndex: 2,
                                                otpValue: '',
                                                imageSrc: _this.imageSrc,
                                                accountProtectionEnable: _this.accountProtectionEnable,
                                                isRegister: true,
                                                accountProtectionPin: _this.protectionPin,
                                            };
                                            var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                                            personAcc.accountId = _this.accountId.trim();
                                            personAcc.accountName = _this.accountName.trim();
                                            personAcc.secretKey = _this.getBarcodeResult.trim();
                                            if (oldgetStorage) {
                                                if (oldgetStorage.length > 0) {
                                                    var newarr = JSON.stringify(oldgetStorage);
                                                    _this.accountArr1 = JSON.parse(newarr);
                                                    var maxId = Math.max.apply(Math, _this.accountArr1.map(function (item) { return item.accountIndex; })) + 1;
                                                    personAcc.accountIndex = maxId;
                                                    oldgetStorage.push(personAcc);
                                                    localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                                                    _this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(function (toast) {
                                                        console.log(toast);
                                                    });
                                                    _this.navCtrl.push(SettingPage);
                                                }
                                                else {
                                                    personAcc.accountIndex = 2;
                                                    _this.accountArr.push(personAcc);
                                                    localStorage.setItem("accounts", JSON.stringify(_this.accountArr));
                                                    _this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(function (toast) {
                                                        console.log(toast);
                                                    });
                                                    _this.navCtrl.push(SettingPage);
                                                }
                                            }
                                            else {
                                                personAcc.accountIndex = 2;
                                                _this.accountArr.push(personAcc);
                                                localStorage.setItem("accounts", JSON.stringify(_this.accountArr));
                                                _this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(function (toast) {
                                                    console.log(toast);
                                                });
                                                _this.navCtrl.push(SettingPage);
                                            }
                                            _this.enableGoogleDrive();
                                        }
                                    }
                                ]
                            });
                            alert_1.present();
                        }
                        catch (error) {
                            console.log("Error occured");
                        }
                    }
                }
                else {
                    try {
                        var alert_2 = this.alertCtrl.create({
                            title: '',
                            message: 'To use this feature please enable “Select Protection Type” option from Settings screen.</br> Would you like to do it now?',
                            buttons: [
                                {
                                    text: 'No',
                                    role: 'cancel',
                                    handler: function () {
                                        console.log('Cancel clicked');
                                        _this.accountProtectionEnable = false;
                                    }
                                },
                                {
                                    text: 'Yes',
                                    handler: function () {
                                        console.log('Buy clicked');
                                        _this.checkAccount();
                                        if (_this.flag == 0) {
                                            alert_2.dismiss();
                                            _this.accountProtectionEnable = false;
                                            return;
                                        }
                                        var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                                        if (totpProtection) {
                                            _this.protectionPin = totpProtection.accountProtectionPin;
                                        }
                                        var personAcc = {
                                            accountId: _this.accountId,
                                            accountName: _this.accountName,
                                            secretKey: _this.getBarcodeResult,
                                            accountIndex: 2,
                                            otpValue: '',
                                            imageSrc: _this.imageSrc,
                                            accountProtectionEnable: _this.accountProtectionEnable,
                                            isRegister: true,
                                            accountProtectionPin: _this.protectionPin,
                                        };
                                        var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                                        personAcc.accountId = _this.accountId.trim();
                                        personAcc.accountName = _this.accountName.trim();
                                        personAcc.secretKey = _this.getBarcodeResult.trim();
                                        if (oldgetStorage) {
                                            if (oldgetStorage.length > 0) {
                                                var newarr = JSON.stringify(oldgetStorage);
                                                _this.accountArr1 = JSON.parse(newarr);
                                                var maxId = Math.max.apply(Math, _this.accountArr1.map(function (item) { return item.accountIndex; })) + 1;
                                                personAcc.accountIndex = maxId;
                                                oldgetStorage.push(personAcc);
                                                localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                                                _this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(function (toast) {
                                                    console.log(toast);
                                                });
                                                _this.navCtrl.push(SettingPage);
                                            }
                                            else {
                                                personAcc.accountIndex = 2;
                                                _this.accountArr.push(personAcc);
                                                localStorage.setItem("accounts", JSON.stringify(_this.accountArr));
                                                _this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(function (toast) {
                                                    console.log(toast);
                                                });
                                                _this.navCtrl.push(SettingPage);
                                            }
                                        }
                                        else {
                                            personAcc.accountIndex = 2;
                                            _this.accountArr.push(personAcc);
                                            localStorage.setItem("accounts", JSON.stringify(_this.accountArr));
                                            _this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(function (toast) {
                                                console.log(toast);
                                            });
                                            _this.navCtrl.push(SettingPage);
                                        }
                                        _this.enableGoogleDrive();
                                    }
                                }
                            ]
                        });
                        alert_2.present();
                    }
                    catch (error) {
                        console.log("Error occured");
                    }
                    this.protectionSet = "Disable";
                }
            }
            else {
                this.protectionSet = "Disable";
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // end
    // account backup function 
    AddAccountPage.prototype.enableGoogleDrive = function () {
        var _this = this;
        try {
            var enableTxt = localStorage.getItem('isEnable');
            if (enableTxt) {
                if (enableTxt == 'Enabled') {
                    localStorage.setItem('isEnable', 'Enabled');
                    var getAccountData = JSON.parse(localStorage.getItem("accounts"));
                    var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                    if (totpProtection) {
                        totpProtection.deviceId = this.deviceId;
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
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    AddAccountPage.prototype.formatDateTime = function () {
        try {
            var minutes = void 0;
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
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    AddAccountPage.prototype.CancelButton = function () {
        this.navCtrl.popToRoot();
        /* if (this.accountName || this.accountId || this.getBarcodeResult) {
         this.accountName = '';
         this.accountId = '';
         this.getBarcodeResult = '';
         }else{
         this.navCtrl.popToRoot();
         }*/
    };
    AddAccountPage.prototype.userProfileClick = function () {
        this.navCtrl.push(UserProfilePage);
    };
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], AddAccountPage.prototype, "navBar", void 0);
    AddAccountPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-add-account',
            templateUrl: 'add-account.html',
        }),
        __metadata("design:paramtypes", [NavController, LoadingController, NavParams, NgZone, App, Platform, BarcodeScanner, Camera, ActionSheetController, AlertController, Toast])
    ], AddAccountPage);
    return AddAccountPage;
}());
export { AddAccountPage };
//# sourceMappingURL=add-account.js.map