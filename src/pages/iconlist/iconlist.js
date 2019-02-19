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
import { NavController, NavParams } from 'ionic-angular';
import { AddAccountPage } from "../add-account/add-account";
import { UserProfilePage } from '../user-profile/user-profile';
/**
 * Generated class for the IconlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var IconlistPage = /** @class */ (function () {
    function IconlistPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.isUserRegister = false;
        this.accIcons = [
            { "name": 'Amazon' },
            { "name": 'Amazon Web Services' },
            { "name": 'BitBucket' },
            { "name": 'Dropbox' },
            { "name": 'Facebook' },
            { "name": 'GitHub' },
            { "name": 'GitLab' },
            { "name": 'Gmail' },
            { "name": 'Google' },
            { "name": 'Instagram' },
            { "name": 'Jira' },
            { "name": 'LinkedIn' },
            { "name": 'Microsoft' },
            { "name": 'Salesforce' },
            { "name": 'Slack' },
            { "name": 'Snapchat' },
            { "name": 'Twitter' }
        ];
        console.log(this.accIcons[0].name);
        var registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }
    }
    IconlistPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad IconlistPage');
    };
    IconlistPage.prototype.chooseIcon = function (getIconName) {
        localStorage.setItem('hideScanBtn', 'yes');
        if (getIconName == 'Other') {
            this.navCtrl.push(AddAccountPage);
        }
        else {
            this.navCtrl.push(AddAccountPage, { 'iconName': getIconName });
        }
    };
    IconlistPage.prototype.backLogoClick = function () {
        this.navCtrl.popToRoot();
    };
    IconlistPage.prototype.userProfileClick = function () {
        /*  this.nativeAudio.stop('default');
          let accDivIndex = document.querySelector("#totpdiv");
          if (accDivIndex) {
              clearInterval(intervalId);
              accDivIndex.innerHTML = '';
          }
          // this.navCtrl.push(ConfirmationScreenPage);
          this.menuClick();*/
        //  this.app.getRootNav().setRoot(GeneratePinPage);
        this.navCtrl.push(UserProfilePage);
    };
    IconlistPage = __decorate([
        Component({
            selector: 'page-iconlist',
            templateUrl: 'iconlist.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams])
    ], IconlistPage);
    return IconlistPage;
}());
export { IconlistPage };
//# sourceMappingURL=iconlist.js.map