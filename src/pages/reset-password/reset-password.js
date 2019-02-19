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
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { HomePage } from '../home/home';
var ResetPasswordPage = /** @class */ (function () {
    function ResetPasswordPage(navCtrl, navParams, restProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.restProvider = restProvider;
    }
    ResetPasswordPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ResetPasswordPage');
    };
    // Call API for Reset Password Yes
    ResetPasswordPage.prototype.ResetPasswordYes = function () {
        var _this = this;
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.resetPasswordYes(sessionid).subscribe(function (result) {
            _this.navCtrl.push(HomePage);
        }, function (error) {
            console.log('error api' + JSON.stringify(error));
        });
    };
    ResetPasswordPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-reset-password',
            templateUrl: 'reset-password.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, A2cApiProvider])
    ], ResetPasswordPage);
    return ResetPasswordPage;
}());
export { ResetPasswordPage };
//# sourceMappingURL=reset-password.js.map