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
import { Camera } from '@ionic-native/camera';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the DriveBackupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DriveBackupPage = /** @class */ (function () {
    function DriveBackupPage(navCtrl, alertCtrl, loadingCtrl, Camera, navParams) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.Camera = Camera;
        this.navParams = navParams;
        this.isEnable = false;
        this.isbackup = false;
        this.isRegisterYes = false;
        this.protectionPin = 0;
        this.loading = this.loadingCtrl.create({
            content: 'Please wait while your data is backed up on Google Drive',
        });
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt == 'Enabled') {
            this.isEnable = true;
        }
        else {
            this.isEnable = false;
        }
        var backupyes = localStorage.getItem('isbackup');
        if (backupyes == 'true') {
            this.isbackup = true;
        }
        else {
            this.isbackup = false;
        }
        var backupdataTime = localStorage.getItem('lastBackupTime');
        if (backupdataTime) {
            this.lastbackupdateTime = backupdataTime;
        }
        var registerInfo = localStorage.getItem('isRegisterYes');
        if (registerInfo == 'true') {
            this.isRegisterYes = true;
        }
        else {
            this.isRegisterYes = false;
        }
        this.deviceId = localStorage.getItem('deviceId');
        if (this.isEnable == true) {
            this.enableGoogleDrive();
        }
    }
    DriveBackupPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DriveBackupPage');
    };
    DriveBackupPage.prototype.ionViewWillEnter = function () {
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt == 'Enabled') {
            this.isEnable = true;
        }
        else {
            this.isEnable = false;
        }
    };
    // enable the google drive backup 
    DriveBackupPage.prototype.enableGoogleDrive = function () {
        var _this = this;
        try {
            var getAccountData = JSON.parse(localStorage.getItem("accounts"));
            var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
            if (totpProtection) {
                totpProtection.deviceId = this.deviceId;
            }
            if (getAccountData != null || getAccountData != undefined && this.isEnable == true) {
                if (this.isEnable == true) {
                    localStorage.setItem('isEnable', 'Enabled');
                    localStorage.setItem("accounts", JSON.stringify(getAccountData));
                    localStorage.setItem("Appsetting", JSON.stringify(totpProtection));
                    var accountsString = localStorage.getItem("accounts");
                    var settingsString = localStorage.getItem("Appsetting");
                    var backupString = accountsString.concat('splitSet' + settingsString);
                    console.log('accounts ' + accountsString);
                    console.log('settings' + settingsString);
                    console.log('backkup' + backupString);
                    debugger;
                    var encryptAccData = window.btoa(backupString);
                    if (encryptAccData) {
                        this.loading.present();
                        var cameraOptions = { data: encryptAccData };
                        this.lastbackupdateTime = this.formatDateTime();
                        this.Camera.getPicture(cameraOptions)
                            .then(function (Response) {
                            _this.lastbackupdateTime = _this.formatDateTime();
                            localStorage.setItem('lastBackupTime', _this.lastbackupdateTime);
                            _this.isbackup = true;
                            localStorage.setItem('isbackup', 'true');
                            console.log("restore" + JSON.stringify(Response));
                            var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
                            if (userRegisterInfo) {
                                _this.isRegisterYes = true;
                                localStorage.setItem('isRegisterYes', 'true');
                            }
                            else {
                                _this.isRegisterYes = false;
                                localStorage.setItem('isRegisterYes', 'false');
                            }
                            _this.loading.dismiss();
                        }, function (err) {
                            _this.loading.dismiss();
                            console.log(err);
                        });
                    }
                    else {
                        this.loading.dismiss();
                    }
                }
                else {
                    localStorage.setItem('isEnable', 'Disabled');
                }
            }
            else {
                var alert_1 = this.alertCtrl.create({
                    title: '',
                    message: 'There is no data to Sync.',
                    buttons: [
                        {
                            text: 'Ok',
                            role: 'cancel',
                            handler: function () {
                                _this.isEnable = false;
                                localStorage.setItem('isEnable', 'Disable');
                            }
                        }
                    ]
                });
                alert_1.present();
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    // get the date and time 
    DriveBackupPage.prototype.formatDateTime = function () {
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
    DriveBackupPage.prototype.menuClick = function () {
        this.navCtrl.popToRoot();
    };
    DriveBackupPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-drive-backup',
            templateUrl: 'drive-backup.html',
        }),
        __metadata("design:paramtypes", [NavController, AlertController, LoadingController, Camera, NavParams])
    ], DriveBackupPage);
    return DriveBackupPage;
}());
export { DriveBackupPage };
//# sourceMappingURL=drive-backup.js.map