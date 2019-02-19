var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import * as jsSHA from "jssha";
import { Platform } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
/**
 * Generated class for the EditAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditAccountPage = /** @class */ (function () {
    function EditAccountPage(navCtrl, loadingCtrl, zone, navParams, platform, barcodeScanner, Camera, actionSheetCtrl, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.zone = zone;
        this.navParams = navParams;
        this.platform = platform;
        this.barcodeScanner = barcodeScanner;
        this.Camera = Camera;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.selectcity = [];
        this.imageSrc = 'assets/imgs/user_img_new.jpg';
        this.protectionSet = "Disable";
        this.accountProtectionEnable = false;
        this.isDisable = false;
        this.keyUpFlag = false;
        this.protectionPin = 0;
        this.isUserRegister = false;
        localStorage.setItem('redirectTo', '');
        this.accountIndex = navParams.get("accountIndex");
        this.getaccountDetails();
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
        this.deviceId = localStorage.getItem('deviceId');
    }
    // if back button is clicked without saving data
    EditAccountPage.prototype.backbuttonClick = function () {
        if (this.keyUpFlag == true) {
            this.backbuttonAlert();
        }
        else {
            this.navCtrl.popToRoot();
        }
    };
    EditAccountPage.prototype.backbuttonAlert = function () {
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
                        _this.navCtrl.popToRoot();
                    }
                },
                {
                    text: 'Yes',
                    handler: function () {
                        _this.editAccountdetails();
                        console.log('Yes clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    EditAccountPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        // device back button event 
        this.platform.registerBackButtonAction(function () {
            _this.backbuttonClick();
        });
        // app back button event 
        this.navBar.backButtonClick = function (e) {
            _this.backbuttonClick();
        };
        console.log('ionViewDidLoad EditAccountPage');
    };
    EditAccountPage.prototype.getaccountDetails = function () {
        var _this = this;
        try {
            var oldStorage = JSON.parse(localStorage.getItem("accounts"));
            var selectedAcc = oldStorage.find(function (x) { return x.accountIndex == _this.accountIndex; });
            selectedAcc = JSON.stringify(selectedAcc);
            selectedAcc = JSON.parse(selectedAcc);
            this.accountName = selectedAcc.accountName;
            this.accountId = selectedAcc.accountId;
            this.secretKey = selectedAcc.secretKey;
            this.imageSrc = selectedAcc.imageSrc;
            this.accountProtectionEnable = selectedAcc.accountProtectionEnable;
            var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorage) {
                if (oldgetStorage.accountProtection == 0) {
                    this.accountProtectionEnable = false;
                }
                else {
                    if ((selectedAcc.accountProtectionEnable == true) && (oldgetStorage.accountProtection == 2)) {
                        this.accountProtectionEnable = true;
                    }
                    else if ((selectedAcc.accountProtectionEnable == true) && (oldgetStorage.accountProtection == 1)) {
                        this.accountProtectionEnable = true;
                    }
                    else {
                        this.accountProtectionEnable = false;
                    }
                }
            }
            else {
                this.accountProtectionEnable = false;
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Update Barcode Secrect Key
    EditAccountPage.prototype.barcodeClick = function () {
        var _this = this;
        try {
            this.keyUpFlag = true;
            this.barcodeScanner.scan().then(function (barcodeData) {
                console.log(barcodeData.text);
                if (barcodeData.text == "") {
                    var localstore = JSON.parse(localStorage.getItem("accounts"));
                    var index = localstore.findIndex(function (obj) { return obj.accountIndex == _this.accountIndex; });
                    _this.secretKey = localstore[index].secretKey;
                    _this.checkSecrekey(_this.secretKey);
                }
                else if (barcodeData.text == "BACK_PRESSED") {
                    var localstore = JSON.parse(localStorage.getItem("accounts"));
                    var index = localstore.findIndex(function (obj) { return obj.accountIndex == _this.accountIndex; });
                    _this.secretKey = localstore[index].secretKey;
                    _this.checkSecrekey(_this.secretKey);
                }
                else if (barcodeData.text == "BUTTON_PRESSED") {
                    var localstore = JSON.parse(localStorage.getItem("accounts"));
                    var index = localstore.findIndex(function (obj) { return obj.accountIndex == _this.accountIndex; });
                    _this.secretKey = localstore[index].secretKey;
                    _this.checkSecrekey(_this.secretKey);
                }
                else if (barcodeData.text.includes("secret") == true) {
                    var newSecretKey = void 0;
                    var res = barcodeData.text.split('secret');
                    res = res[1].split('=');
                    newSecretKey = res[1];
                    if (res.length > 2) {
                        newSecretKey = newSecretKey.substring(0, newSecretKey.indexOf("&"));
                    }
                    _this.secretKey = newSecretKey;
                    _this.checkSecrekey(_this.secretKey);
                }
                else if (barcodeData.text.includes("/") == true) {
                    var res = barcodeData.text.split('/');
                    var barcodeDataresult = res[res.length - 1];
                    _this.secretKey = barcodeDataresult;
                    _this.checkSecrekey(_this.secretKey);
                }
                else {
                    _this.secretKey = barcodeData.text;
                    _this.checkSecrekey(_this.secretKey);
                }
            }, function (err) {
                console.log("Error occured : " + err);
            });
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // add account details function
    EditAccountPage.prototype.editAccountdetails = function () {
        var _this = this;
        try {
            this.checkAccount();
            if (this.flag == 0) {
                return;
            }
            this.checkAccountName();
            if (this.flag == 0) {
                return;
            }
            this.checkSecrekey(this.secretKey);
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
            var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
            var index = oldgetStorage.findIndex(function (obj) { return obj.accountIndex == _this.accountIndex; });
            oldgetStorage[index].accountIndex = this.accountIndex;
            oldgetStorage[index].accountId = this.accountId.trim();
            oldgetStorage[index].accountName = this.accountName.trim();
            oldgetStorage[index].secretKey = this.secretKey.trim();
            oldgetStorage[index].imageSrc = this.imageSrc;
            oldgetStorage[index].accountProtectionEnable = this.accountProtectionEnable;
            oldgetStorage[index].accountProtectionPin = this.protectionPin;
            localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
            this.enableGoogleDrive();
            this.navCtrl.popToRoot();
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Edit Account Form Validation
    EditAccountPage.prototype.checkAccount = function () {
        try {
            if (this.accountName.trim() == '') {
                this.erroraccountName = "Enter application name";
                this.flag = 0;
            }
            if (this.accountId == undefined) {
                this.erroraccountId = "Enter account id";
                this.flag = 0;
            }
            if (this.secretKey == "") {
                this.errorSecretkey = "Please enter Secret key";
                this.flag = 0;
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    EditAccountPage.prototype.onKeySecret = function (event) {
        try {
            this.keyUpFlag = true;
            this.checkSecrekey(this.secretKey);
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    EditAccountPage.prototype.checkSecrekey = function (secretKey) {
        try {
            this.checValidKey(secretKey);
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Check Account Name
    EditAccountPage.prototype.onKeyAccountName = function (event) {
        try {
            this.keyUpFlag = true;
            this.checkAccountName();
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    EditAccountPage.prototype.checkAccountName = function () {
        try {
            this.flag = 1;
            var accountName = this.accountName;
            if (accountName.length <= 0) {
                this.erroraccountName = "Enter application name";
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
    EditAccountPage.prototype.onKeyAccountID = function (event) {
        try {
            this.keyUpFlag = true;
            this.checkAccountID();
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    EditAccountPage.prototype.checkAccountID = function () {
        try {
            var accountId = this.accountId;
            this.flag = 1;
            if (accountId.length <= 0) {
                this.erroraccountId = "Enter account id";
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
    // end
    EditAccountPage.prototype.removeItem1 = function () {
        var _this = this;
        try {
            var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
            var index = oldgetStorage.findIndex(function (obj) { return obj.accountId == _this.accountId; });
            oldgetStorage.splice(index, 1);
            localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
            this.navCtrl.popToRoot();
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // Check Valid Secret Key
    EditAccountPage.prototype.dec2hex = function (value) {
        return (value < 15.5 ? "0" : "") + Math.round(value).toString(16);
    };
    EditAccountPage.prototype.hex2dec = function (value) {
        return parseInt(value, 16);
    };
    EditAccountPage.prototype.leftpad = function (value, length, pad) {
        if (length + 1 >= value.length) {
            value = Array(length + 1 - value.length).join(pad) + value;
        }
        return value;
    };
    EditAccountPage.prototype.base32tohex = function (base32) {
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
    EditAccountPage.prototype.checValidKey = function (secretKey) {
        try {
            var epoch = Math.round(new Date().getTime() / 1000.0);
            var time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, "0");
            var hmacObj = new jsSHA(time, "HEX");
            var hmac = hmacObj.getHMAC(this.base32tohex(secretKey), "HEX", "SHA-1", "HEX");
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
    EditAccountPage.prototype.browseImgClick = function () {
        var _this = this;
        try {
            this.keyUpFlag = true;
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
                                    var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                                    var index = oldgetStorage.findIndex(function (obj) { return obj.accountIndex == _this.accountIndex; });
                                    oldgetStorage[index].imageSrc = _this.imageSrc;
                                    localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
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
                                    var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                                    var index = oldgetStorage.findIndex(function (obj) { return obj.accountIndex == _this.accountIndex; });
                                    oldgetStorage[index].imageSrc = _this.imageSrc;
                                    localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
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
    // Delete Confirm Box code
    EditAccountPage.prototype.removeItemConfirm = function () {
        var _this = this;
        try {
            var alert_1 = this.alertCtrl.create({
                title: '',
                message: 'Do you want to delete your account?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: function () {
                            console.log('Buy clicked');
                            var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                            var index = oldgetStorage.findIndex(function (obj) { return obj.accountId == _this.accountId; });
                            oldgetStorage.splice(index, 1);
                            localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                            _this.navCtrl.popToRoot();
                        }
                    }
                ]
            });
            alert_1.present();
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // end code
    // Toggle Click Function
    EditAccountPage.prototype.toggleClick = function () {
        var _this = this;
        this.keyUpFlag = true;
        var newacc = this.accountProtectionEnable;
        if (newacc == true) {
            var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorage) {
                if (oldgetStorage.accountProtection != 0) {
                    this.accountProtectionEnable = true;
                }
                else {
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
                                    _this.checkAccount();
                                    if (_this.flag == 0) {
                                        alert_2.dismiss();
                                        _this.accountProtectionEnable = false;
                                        return;
                                    }
                                    var oldStorage = JSON.parse(localStorage.getItem("accounts"));
                                    var selectedAcc = oldStorage.find(function (x) { return x.accountIndex == _this.accountIndex; });
                                    selectedAcc = JSON.stringify(selectedAcc);
                                    selectedAcc = JSON.parse(selectedAcc);
                                    _this.accountName = selectedAcc.accountName;
                                    _this.accountId = selectedAcc.accountId;
                                    _this.secretKey = selectedAcc.secretKey;
                                    _this.imageSrc = selectedAcc.imageSrc;
                                    _this.accountProtectionEnable = newacc;
                                    var index = oldStorage.findIndex(function (obj) { return obj.accountIndex == _this.accountIndex; });
                                    oldStorage[index].accountProtectionEnable = newacc;
                                    localStorage.setItem("accounts", JSON.stringify(oldStorage));
                                    _this.enableGoogleDrive();
                                    _this.navCtrl.push(SettingPage);
                                }
                            }
                        ]
                    });
                    alert_2.present();
                }
            }
            else {
                var alert_3 = this.alertCtrl.create({
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
                                _this.checkAccount();
                                if (_this.flag == 0) {
                                    alert_3.dismiss();
                                    _this.accountProtectionEnable = false;
                                    return;
                                }
                                var oldStorage = JSON.parse(localStorage.getItem("accounts"));
                                var selectedAcc = oldStorage.find(function (x) { return x.accountIndex == _this.accountIndex; });
                                selectedAcc = JSON.stringify(selectedAcc);
                                selectedAcc = JSON.parse(selectedAcc);
                                _this.accountName = selectedAcc.accountName;
                                _this.accountId = selectedAcc.accountId;
                                _this.secretKey = selectedAcc.secretKey;
                                _this.imageSrc = selectedAcc.imageSrc;
                                _this.accountProtectionEnable = newacc;
                                var index = oldStorage.findIndex(function (obj) { return obj.accountIndex == _this.accountIndex; });
                                oldStorage[index].accountProtectionEnable = newacc;
                                localStorage.setItem("accounts", JSON.stringify(oldStorage));
                                _this.enableGoogleDrive();
                                _this.navCtrl.push(SettingPage);
                            }
                        }
                    ]
                });
                alert_3.present();
            }
        }
    };
    // account backup function 
    EditAccountPage.prototype.enableGoogleDrive = function () {
        var _this = this;
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            if (enableTxt == 'Enabled') {
                localStorage.setItem('isEnable', 'Enabled');
                var getAccountData = JSON.parse(localStorage.getItem("accounts"));
                var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                if (totpProtection) {
                    totpProtection.deviceId = this.deviceId;
                }
                localStorage.setItem("Appsetting", JSON.stringify(totpProtection));
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
    EditAccountPage.prototype.formatDateTime = function () {
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
    EditAccountPage.prototype.CancelButton = function () {
        this.navCtrl.popToRoot();
        /* if (this.accountName || this.accountId || this.secretKey) {
             this.accountName = '';
             this.accountId = '';
             this.secretKey = '';
         }else{
             this.navCtrl.popToRoot();
         }*/
    };
    EditAccountPage.prototype.userProfileClick = function () {
        this.navCtrl.push(UserProfilePage);
    };
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], EditAccountPage.prototype, "navBar", void 0);
    EditAccountPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-edit-account',
            templateUrl: 'edit-account.html',
        }),
        __metadata("design:paramtypes", [NavController, LoadingController, NgZone, NavParams, Platform, BarcodeScanner, Camera, ActionSheetController, AlertController])
    ], EditAccountPage);
    return EditAccountPage;
}());
export { EditAccountPage };
//# sourceMappingURL=edit-account.js.map