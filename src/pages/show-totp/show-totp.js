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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import * as jsSHA from 'jssha';
import { Observable } from 'rxjs/Rx';
/**
 * Generated class for the ShowTotpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ShowTotpPage = /** @class */ (function () {
    function ShowTotpPage(navCtrl, ngzone, navParams) {
        this.navCtrl = navCtrl;
        this.ngzone = ngzone;
        this.navParams = navParams;
        this.isUserRegister = false;
        this.selectedACCinObj = navParams.get("selectedACCinObj");
        this.index = navParams.get("index");
        this.accountName = this.selectedACCinObj.accountName;
        this.imgSrc = this.selectedACCinObj.imageSrc;
        var registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }
        var getStorage = JSON.parse(localStorage.getItem("accounts"));
        this.names = getStorage;
        var accountName = localStorage.getItem("accountsName");
        //this.accountName = accountName;
        this.getOTP(this.selectedACCinObj, this.index);
    }
    ShowTotpPage.prototype.backLogoClick = function () {
        this.intervalId.unsubscribe();
        this.navCtrl.popToRoot();
    };
    ShowTotpPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ShowTotpPage');
    };
    /* ionViewWillEnter() {
         debugger;
           this.countDownlocal = countDown;
     }*/
    ShowTotpPage.prototype.userProfileClick = function () {
        this.intervalId.unsubscribe();
        this.navCtrl.push(UserProfilePage);
    };
    ShowTotpPage.prototype.dec2hex = function (value) {
        return (value < 15.5 ? "0" : "") + Math.round(value).toString(16);
    };
    ShowTotpPage.prototype.hex2dec = function (value) {
        return parseInt(value, 16);
    };
    ShowTotpPage.prototype.leftpad = function (value, length, pad) {
        if (length + 1 >= value.length) {
            value = Array(length + 1 - value.length).join(pad) + value;
        }
        return value;
    };
    ShowTotpPage.prototype.base32tohex = function (base32) {
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
    ShowTotpPage.prototype.getOTP = function (selectedAccount, index) {
        var epoch = Math.round(new Date().getTime() / 1000.0);
        countDown = 30 - (epoch % 30);
        this.countDownlocal = countDown;
        if (countDown <= 15) {
            isFirstTotp = 2;
        }
        else {
            isFirstTotp = 3;
        }
        try {
            var epoch_1 = Math.round(new Date().getTime() / 1000.0);
            var time = this.leftpad(this.dec2hex(Math.floor(epoch_1 / 30)), 16, "0");
            var hmacObj = new jsSHA(time, "HEX");
            var hmac = hmacObj.getHMAC(this.base32tohex(selectedAccount.secretKey), "HEX", "SHA-1", "HEX");
            var offset = this.hex2dec(hmac.substring(hmac.length - 1));
            var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
            this.names[index].otpValue = otp;
            this.globalOTP = otp;
            this.delayedAlert();
        }
        catch (error) {
            alert("Invalid Secret Key, Please modify it!");
        }
    };
    ShowTotpPage.prototype.timer = function () {
        debugger;
        try {
            countDown--;
            this.countDownlocal = countDown;
            this.countdownCss = Math.round((countDown) * 3.3);
            /*   let timerDivIndex=document.querySelector("#timerDiv");
               timerDivIndex.innerHTML='<div class="progress-circle_hm progress-'+Math.round((countDown)*3.3)+'"><span>'+countDown+'</span></div>';
 */
            if (countDown == 0) {
                this.intervalId.unsubscribe();
                countDown = 30;
                this.countDownlocal = countDown;
                this.getOTP(this.selectedACCinObj, this.index);
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    ShowTotpPage.prototype.delayedAlert = function () {
        var _this = this;
        try {
            this.intervalId = Observable.interval(1000).subscribe(function (x) {
                _this.timer();
            });
            // intervalId = setInterval(this.timer, 1000);
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    ShowTotpPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-show-totp',
            templateUrl: 'show-totp.html',
        }),
        __metadata("design:paramtypes", [NavController, NgZone, NavParams])
    ], ShowTotpPage);
    return ShowTotpPage;
}());
export { ShowTotpPage };
var countDown = 30;
var globalCountdown;
var intervalId;
var indexAccountChetu = 0;
var index;
var getAccountId;
var isFirstTotp;
//# sourceMappingURL=show-totp.js.map