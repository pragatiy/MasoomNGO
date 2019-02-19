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
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var UserProfilePage = /** @class */ (function () {
    function UserProfilePage(navCtrl, navParams, restProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.restProvider = restProvider;
        this.licenceId = localStorage.getItem("licenseId");
        this.UserInfoStorage = localStorage.getItem("UserRegisterInfo");
    }
    UserProfilePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad UserProfilePage');
    };
    UserProfilePage.prototype.ionViewWillEnter = function () {
        this.getUsersData();
    };
    UserProfilePage.prototype.backLogoClick = function () {
        this.navCtrl.popToRoot();
    };
    UserProfilePage.prototype.getUsersData = function () {
        var UserInfoStorageArr = JSON.parse(this.UserInfoStorage);
        if (UserInfoStorageArr) {
            this.userName = UserInfoStorageArr.userName;
            this.companyName = UserInfoStorageArr.companyname;
            this.mobileNumber = UserInfoStorageArr.mobile;
            this.displayName = UserInfoStorageArr.userName;
            this.emailAddress = UserInfoStorageArr.email;
        }
    };
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], UserProfilePage.prototype, "navBar", void 0);
    UserProfilePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-user-profile',
            templateUrl: 'user-profile.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, LicenceAgreementProvider])
    ], UserProfilePage);
    return UserProfilePage;
}());
export { UserProfilePage };
//# sourceMappingURL=user-profile.js.map