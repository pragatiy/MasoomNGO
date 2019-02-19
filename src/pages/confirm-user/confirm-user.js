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
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { AlertController } from 'ionic-angular';
var ConfirmUserPage = /** @class */ (function () {
    function ConfirmUserPage(navCtrl, alertCtrl, navParams, restProvider, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.navParams = navParams;
        this.restProvider = restProvider;
        this.loadingCtrl = loadingCtrl;
        this.PageName = navParams.get('PageName');
        if (this.PageName == 'ResetPassword') {
            this.pageTitle = 'Reset Password';
        }
        else {
            this.pageTitle = 'Unlock Account';
        }
    }
    ConfirmUserPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ConfirmUserPage');
    };
    // call Redirect To Page
    ConfirmUserPage.prototype.RedirectToPage = function () {
        if (this.PageName == 'ResetPassword') {
            this.ResetUserPassword();
        }
        else {
            this.UnlockUserAccount();
        }
    };
    // Call API for Reset Password
    ConfirmUserPage.prototype.ResetUserPassword = function () {
        var _this = this;
        if ((this.userId == undefined) || (this.userId == '')) {
            this.erroruserId = 'Please enter user id';
        }
        else {
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
                }
                else if (resultData.Result.SuccessCode == 100) {
                    loading_1.dismiss();
                    var alert_1 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['OK']
                    });
                    alert_1.present();
                }
                else if (resultData.Result.SuccessCode == 400) {
                    loading_1.dismiss();
                    var alert_2 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Request Failed.',
                        buttons: ['OK']
                    });
                    alert_2.present();
                }
                else if (resultData.Result.SuccessCode == 700) {
                    loading_1.dismiss();
                    var alert_3 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'User ID not found.',
                        buttons: ['OK']
                    });
                    alert_3.present();
                }
                else {
                    loading_1.dismiss();
                    var alert_4 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Unknown error occured.',
                        buttons: ['OK']
                    });
                    alert_4.present();
                }
            }, function (error) {
                console.log('error api' + JSON.stringify(error));
            });
            loading_1.present();
        }
    };
    // End
    // Call API for Reset Password
    ConfirmUserPage.prototype.UnlockUserAccount = function () {
        var _this = this;
        if ((this.userId == undefined) || (this.userId == '')) {
            this.erroruserId = 'Please enter user id';
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
                }
                else if (resultData.Result.SuccessCode == 100) {
                    loading_2.dismiss();
                    var alert_5 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['OK']
                    });
                    alert_5.present();
                }
                else if (resultData.Result.SuccessCode == 400) {
                    loading_2.dismiss();
                    var alert_6 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Request Failed.',
                        buttons: ['OK']
                    });
                    alert_6.present();
                }
                else if (resultData.Result.SuccessCode == 700) {
                    loading_2.dismiss();
                    var alert_7 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'User ID not found.',
                        buttons: ['OK']
                    });
                    alert_7.present();
                }
                else {
                    loading_2.dismiss();
                    var alert_8 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Unknown error occured.',
                        buttons: ['OK']
                    });
                    alert_8.present();
                }
            }, function (error) {
                console.log('error api' + JSON.stringify(error));
            });
            loading_2.present();
        }
    };
    ConfirmUserPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-confirm-user',
            templateUrl: 'confirm-user.html',
        }),
        __metadata("design:paramtypes", [NavController,
            AlertController,
            NavParams,
            A2cApiProvider,
            LoadingController])
    ], ConfirmUserPage);
    return ConfirmUserPage;
}());
export { ConfirmUserPage };
//# sourceMappingURL=confirm-user.js.map