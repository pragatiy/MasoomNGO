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
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { Platform } from 'ionic-angular';
/**
 * Generated class for the GeneratePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var GeneratePasswordPage = /** @class */ (function () {
    function GeneratePasswordPage(navCtrl, platform, navParams) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.navParams = navParams;
        this.notification = navParams.get("notification");
        platform.ready().then(function () {
            platform.registerBackButtonAction(function () {
                _this.navCtrl.popToRoot();
            });
        });
    }
    GeneratePasswordPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        // when click on cancel option from sheet then go back by page back arrow button to home page 
        this.navBar.backButtonClick = function () {
            _this.navCtrl.popToRoot();
        };
    };
    GeneratePasswordPage.prototype.ionViewDidLoad = function () {
        if (this.notification) {
            this.account_password = this.notification.additionalData.pswd;
        }
        console.log('ionViewDidLoad GeneratePasswordPage');
        localStorage.setItem('PushFlag', '');
    };
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], GeneratePasswordPage.prototype, "navBar", void 0);
    GeneratePasswordPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-generate-password',
            templateUrl: 'generate-password.html',
        }),
        __metadata("design:paramtypes", [NavController, Platform, NavParams])
    ], GeneratePasswordPage);
    return GeneratePasswordPage;
}());
export { GeneratePasswordPage };
//# sourceMappingURL=generate-password.js.map