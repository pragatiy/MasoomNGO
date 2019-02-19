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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { reorderArray } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
/**
 * Generated class for the ModifyOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ModifyOrderPage = /** @class */ (function () {
    function ModifyOrderPage(navCtrl, navParams, Camera) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.Camera = Camera;
        this.reorderIsEnabled = true;
        this.accountName = "Account Details";
        this.protectionPin = 0;
        this.deviceId = localStorage.getItem('deviceId');
    }
    ModifyOrderPage.prototype.ionViewWillEnter = function () {
        var getStorage = JSON.parse(localStorage.getItem("accounts"));
        this.names = getStorage;
    };
    // Modify Account Order and Redirect to Home Page
    ModifyOrderPage.prototype.modifyAccountOrder = function () {
        localStorage.setItem("accounts", JSON.stringify(this.names));
        this.enableGoogleDrive();
        this.navCtrl.popToRoot();
    };
    // set the position of the items
    ModifyOrderPage.prototype.reorderItems = function ($event) {
        this.names = reorderArray(this.names, $event);
    };
    // account backup function 
    ModifyOrderPage.prototype.enableGoogleDrive = function () {
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
    //end
    ModifyOrderPage.prototype.formatDateTime = function () {
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
    ModifyOrderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-modify-order',
            templateUrl: 'modify-order.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, Camera])
    ], ModifyOrderPage);
    return ModifyOrderPage;
}());
export { ModifyOrderPage };
//# sourceMappingURL=modify-order.js.map