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
import { IonicPage, NavController, App, NavParams, LoadingController, AlertController, Navbar } from 'ionic-angular';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import * as CryptoJS from 'crypto-js/crypto-js';
import { HomePage } from '../home/home';
var PasswordPolicyPage = /** @class */ (function () {
    function PasswordPolicyPage(navCtrl, ngzone, navParams, restProvider, app, loadingCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.ngzone = ngzone;
        this.navParams = navParams;
        this.restProvider = restProvider;
        this.app = app;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
    }
    PasswordPolicyPage.prototype.backLogoClick = function () {
        this.navCtrl.popToRoot();
    };
    PasswordPolicyPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.navBar.backButtonClick = function (e) {
            _this.navCtrl.popToRoot();
        };
        var passwordPolicy = JSON.parse(localStorage.getItem("passwordPolicy"));
        if ((passwordPolicy.minLength == '') || (passwordPolicy.minLength == 0) || (passwordPolicy.minLength == undefined)) {
            this.minLengthcondition = false;
        }
        else {
            this.minLength = passwordPolicy.minLength;
            this.minLengthcondition = true;
        }
        if ((passwordPolicy.minLowerCase == '') || (passwordPolicy.minLowerCase == 0) || (passwordPolicy.minLowerCase == undefined)) {
            this.minLowerCasecondition = false;
        }
        else {
            this.minLowerCase = passwordPolicy.minLowerCase;
            this.minLowerCasecondition = true;
        }
        if ((passwordPolicy.minNumber == '') || (passwordPolicy.minNumber == 0) || (passwordPolicy.minNumber == undefined)) {
            this.minNumbercondition = false;
        }
        else {
            this.minNumber = passwordPolicy.minNumber;
            this.minNumbercondition = true;
        }
        if ((passwordPolicy.minSymbol == '') || (passwordPolicy.minSymbol == 0) || (passwordPolicy.minSymbol == undefined)) {
            this.minSymbolcondition = false;
        }
        else {
            this.minSymbol = passwordPolicy.minSymbol;
            this.minSymbolcondition = true;
        }
        if ((passwordPolicy.minUpperCase == '') || (passwordPolicy.minUpperCase == 0) || (passwordPolicy.minUpperCase == undefined)) {
            this.minUpperCasecondition = false;
        }
        else {
            this.minUpperCase = passwordPolicy.minUpperCase;
            this.minUpperCasecondition = true;
        }
    };
    PasswordPolicyPage.prototype.checkNewPasswordPolicy = function () {
        try {
            this.validatePasswordlength();
            if (this.flag == 0) {
                return;
            }
            this.validatePassworddigit();
            if (this.flag == 0) {
                return;
            }
            this.validatePasswordUppercase();
            if (this.flag == 0) {
                return;
            }
            this.validatePasswordLowercase();
            if (this.flag == 0) {
                return;
            }
            this.validatePasswordSpecialChar();
            if (this.flag == 0) {
                return;
            }
        }
        catch (error) {
            console.log('Error' + error);
        }
    };
    PasswordPolicyPage.prototype.checkPasswordPolicy = function () {
        var _this = this;
        try {
            debugger;
            this.checkNewPasswordPolicy();
            if (this.flag == 0) {
                return;
            }
            this.validateConfirmPassword();
            if (this.flag == 0) {
                return;
            }
            this.setPasswordEncrypted(this.ConfirmpolicyPassword);
            localStorage.setItem('PushFlag', 'RsetPasswordPush');
            debugger;
            this.loading.present();
            var sessionid = localStorage.getItem('sessionId');
            this.restProvider.resetPasswordYes(sessionid).subscribe(function (result) {
                var resultObj = JSON.stringify(result);
                var resultData = JSON.parse(resultObj);
                var sucessCode = resultData.Result.SuccessCode;
                if (sucessCode == 200) {
                    _this.loading.dismiss();
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    _this.app.getRootNav().setRoot(HomePage);
                }
                else if (resultData.Result.SuccessCode == 100) {
                    _this.loading.dismiss();
                    var alert_1 = _this.alertCtrl.create({
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['Ok']
                    });
                    alert_1.present();
                }
                else if (resultData.Result.SuccessCode == 400) {
                    _this.loading.dismiss();
                    var alert_2 = _this.alertCtrl.create({
                        subTitle: 'Request Failed.',
                        buttons: ['Ok']
                    });
                    alert_2.present();
                }
                else if (resultData.Result.SuccessCode == 700) {
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
                }
            }, function (error) {
                console.log('error api' + JSON.stringify(error));
            });
            /*  this.loading.present();
              this.restProvider.resetPassword().subscribe(
                (result) => {
                  let resultObj = JSON.stringify(result);
                  let resultData = JSON.parse(resultObj);
                  if (resultData.Result.SuccessCode == 200) {
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    this.loading.dismiss();
                    console.log(resultData.Result.sessionId);
                  } else if (resultData.Result.SuccessCode == 100) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                      subTitle: 'Registration key not found on the database.',
                      buttons: ['Ok']
                    });
                    alert.present();
                  } else if (resultData.Result.SuccessCode == 400) {
                    this.loading.dismiss();
        
                    let alert = this.alertCtrl.create({
                      subTitle: 'Request Failed.',
                      buttons: ['Ok']
                    });
                    alert.present();
                  } else if (resultData.Result.SuccessCode == 700) {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                      subTitle: 'User ID not found.',
                      buttons: ['Ok']
                    });
                    alert.present();
                  } else {
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                      subTitle: 'connectivity error.',
                      buttons: ['Ok']
                    });
                    alert.present();
                  }
                },
                (error) => {
                  console.log("error api" + JSON.stringify(error));
                }
              );
        */
        }
        catch (error) {
            console.log('Error' + error);
        }
    };
    // Validate Password Length
    PasswordPolicyPage.prototype.validatePasswordlength = function () {
        if (this.policyPassword.length < this.minLength) {
            this.errorPasswordLength = 'Password must be ' + this.minLength + ' character long';
            this.flag = 0;
        }
        else {
            this.errorPasswordLength = '';
            this.flag = 1;
        }
    };
    // Validate Password Digit
    PasswordPolicyPage.prototype.validatePassworddigit = function () {
        var digitlength = this.policyPassword.replace(/[^0-9]/g, "").length;
        if ((!/\d/.test(this.policyPassword)) || (digitlength < this.minNumber)) {
            this.errorPasswordLength = 'Password must contain atleast ' + this.minNumber + ' digit';
            this.flag = 0;
        }
        else {
            this.errorPasswordLength = '';
            this.flag = 1;
        }
    };
    // Validate Password Upper Case
    PasswordPolicyPage.prototype.validatePasswordUppercase = function () {
        var uppercaselength = this.policyPassword.replace(/[^A-Z]/g, "").length;
        if ((!/[A-Z]/.test(this.policyPassword)) || (uppercaselength < this.minUpperCase)) {
            this.errorPasswordLength = 'Password must contain atleast ' + this.minUpperCase + ' Upper Case';
            this.flag = 0;
        }
        else {
            this.errorPasswordLength = '';
            this.flag = 1;
        }
    };
    // Validate Password Lower Case 
    PasswordPolicyPage.prototype.validatePasswordLowercase = function () {
        debugger;
        var lowercaselength = this.policyPassword.replace(/[^a-z]/g, "").length;
        if ((!/[a-z]/.test(this.policyPassword)) || (lowercaselength < this.minLowerCase)) {
            this.errorPasswordLength = 'Password must contain atleast ' + this.minLowerCase + ' Lower Case';
            this.flag = 0;
        }
        else {
            this.errorPasswordLength = '';
            this.flag = 1;
        }
    };
    // Validate Password Special Character 
    PasswordPolicyPage.prototype.validatePasswordSpecialChar = function () {
        var specialcharlength = this.policyPassword.replace(/[^!@#$%^&*]/g, "").length;
        if ((!/[!@#$%^&*]/.test(this.policyPassword)) || (specialcharlength < this.minSymbol)) {
            this.errorPasswordLength = 'Password must contain atleast ' + this.minSymbol + ' Special Character';
            this.flag = 0;
        }
        else {
            this.errorPasswordLength = '';
            this.flag = 1;
        }
    };
    //Validate Confirm Password
    PasswordPolicyPage.prototype.validateConfirmPassword = function () {
        if (this.policyPassword != this.ConfirmpolicyPassword) {
            this.errorConfirmPassword = 'Password do not match!';
            this.flag = 0;
        }
        else {
            this.errorConfirmPassword = '';
            this.flag = 1;
        }
    };
    PasswordPolicyPage.prototype.onKeyPassworldLength = function (event) {
        var _this = this;
        this.ngzone.run(function () {
            if (_this.policyPassword == '') {
                _this.errorPasswordLength = '';
            }
            else {
                _this.checkNewPasswordPolicy();
            }
        });
    };
    PasswordPolicyPage.prototype.onKeyConfirmPassworldLength = function (event) {
        var _this = this;
        this.ngzone.run(function () {
            if (_this.ConfirmpolicyPassword == '') {
                _this.errorConfirmPassword = '';
            }
            else {
                if (_this.policyPassword != _this.ConfirmpolicyPassword) {
                    _this.errorConfirmPassword = 'Password do not match!';
                    _this.flag = 0;
                }
                else {
                    _this.errorConfirmPassword = '';
                    _this.flag = 1;
                }
            }
        });
    };
    PasswordPolicyPage.prototype.setPasswordEncrypted = function (password) {
        debugger;
        // Encrypt 
        var secretKey = localStorage.getItem('resetPassKey');
        var iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        var salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        var aesUtil = new AesUtil(128, 1000);
        var ciphertext = aesUtil.encrypt(salt, iv, secretKey, password);
        var aesPassword = (iv + "::" + salt + "::" + ciphertext);
        this.encrypPassword = btoa(aesPassword);
        localStorage.setItem('policyPassword', this.encrypPassword);
        console.log('encrypt pass' + this.encrypPassword);
    };
    //Cancel Button 
    PasswordPolicyPage.prototype.CancelButton = function () {
        this.navCtrl.popToRoot();
        /*
         if (this.policyPassword  || this.ConfirmpolicyPassword) {
                this.policyPassword = '';
                this.ConfirmpolicyPassword='';
         }else{
          this.navCtrl.popToRoot();
          }*/
    };
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], PasswordPolicyPage.prototype, "navBar", void 0);
    PasswordPolicyPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-password-policy',
            templateUrl: 'password-policy.html',
        }),
        __metadata("design:paramtypes", [NavController, NgZone, NavParams,
            A2cApiProvider, App, LoadingController, AlertController])
    ], PasswordPolicyPage);
    return PasswordPolicyPage;
}());
export { PasswordPolicyPage };
//# sourceMappingURL=password-policy.js.map