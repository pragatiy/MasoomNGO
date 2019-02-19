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
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
import { ActionSheetController } from 'ionic-angular';
import { GeneratePinPage } from '../generate-pin/generate-pin';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { LoadingController } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
/**
* Generated class for the LicencePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
var LicencePage = /** @class */ (function () {
    function LicencePage(navCtrl, loadingCtrl, alertCtrl, Camera, actionSheetCtrl, navParams, restProvider, transfer, file) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.Camera = Camera;
        this.actionSheetCtrl = actionSheetCtrl;
        this.navParams = navParams;
        this.restProvider = restProvider;
        this.transfer = transfer;
        this.file = file;
        this.viewLicence = true;
        this.accountArr = [];
        this.accountArr1 = [];
        this.isAccountProtectionEnable = true;
        this.vibration = true;
        this.accountProtection = 0;
        this.accountProtectionName = "Not Set";
        this.accountProtectionPin = 0;
        this.licenceId = navParams.get("licenceId");
        this.companyName = navParams.get("companyName");
        this.viewLicence = navParams.get("status");
        if (this.viewLicence == undefined) {
            this.viewLicence = true;
        }
        localStorage.setItem("licenseId", this.licenceId);
        localStorage.setItem("companyName", this.companyName);
        var registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }
    }
    LicencePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LicencePage');
    };
    LicencePage.prototype.LicenceAccept = function () {
        this.getUsersData();
    };
    // Show More Click
    LicencePage.prototype.showMore = function () {
        var accDivIndex = document.querySelector("#link");
        accDivIndex.classList.remove('class2');
        accDivIndex.classList.add('class1');
        var newDiv = document.querySelector("#linkLess");
        newDiv.classList.remove('class1');
        newDiv.classList.add('class2');
        var accDivIndexmore = document.querySelector("#more");
        accDivIndexmore.classList.remove('class1');
        accDivIndexmore.classList.add('class2');
    };
    // show less click
    LicencePage.prototype.showLess = function () {
        var accDivIndex = document.querySelector("#link");
        accDivIndex.classList.remove('class1');
        accDivIndex.classList.add('class2');
        var newDiv = document.querySelector("#linkLess");
        newDiv.classList.remove('class2');
        newDiv.classList.add('class1');
        var accDivIndexmore = document.querySelector("#more");
        accDivIndexmore.classList.remove('class2');
        accDivIndexmore.classList.add('class1');
    };
    // get registered user data api respoonse
    LicencePage.prototype.getUsersData = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...',
        });
        loading.present();
        var fileTransfer = this.transfer.create();
        this.restProvider.getUsers(this.licenceId, this.companyName).subscribe(function (result) {
            debugger;
            var resultObj = JSON.stringify(result);
            var resultData = JSON.parse(resultObj);
            console.log(resultObj);
            var sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 200) {
                loading.dismiss();
                var url = resultData.Result.CompanyIcon;
                // let passwordPolicy =  JSON.stringify(resultData.Result.passwordPolicy);
                // console.log('passwordPolicy'+passwordPolicy);
                // localStorage.setItem('passwordPolicy',passwordPolicy);
                _this.getDataUri(url, resultData);
            }
            else if (sucessCode == 100) {
                loading.dismiss();
                var alert_1 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['OK']
                });
                alert_1.present();
                // alert("Registration key not found on the database.");
            }
            else if (sucessCode == 400) {
                loading.dismiss();
                var alert_2 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Request Failed.',
                    buttons: ['OK']
                });
                alert_2.present();
                // alert("Request Failed.");
            }
            else if (sucessCode == 700) {
                loading.dismiss();
                var alert_3 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'User ID not found.',
                    buttons: ['OK']
                });
                alert_3.present();
                // alert("User ID not found.");
            }
            else {
                loading.dismiss();
                // alert("Unknown error occurred.");
                console.log("Sucess data" + JSON.stringify(result));
            }
        }, function (error) {
            loading.dismiss();
            console.log("error api" + JSON.stringify(error));
        });
    };
    LicencePage.prototype.getDataUri = function (url, resultData) {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...',
        });
        loading.present();
        var image = new Image();
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            canvas.getContext('2d').drawImage(image, 0, 0);
            localStorage.setItem('defaultimageSrc', canvas.toDataURL('image/png'));
        };
        image.src = url;
        setTimeout(function () {
            loading.dismiss();
            _this.SaveUserData(resultData);
        }, 3000);
    };
    LicencePage.prototype.SaveUserData = function (resultData) {
        if (resultData.Result.PasswordProtected == true) {
            this.AccountProtectionClick(resultData);
        }
        else {
            this.saveDataUser(resultData);
            this.navCtrl.popToRoot();
        }
    };
    // registered user account protection
    LicencePage.prototype.AccountProtectionClick = function (resultData) {
        var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
        if (totpProtection) {
            if (totpProtection.accountProtectionPin != 0) {
                this.saveDataUser(resultData);
                this.navCtrl.popToRoot();
            }
            else {
                this.navCtrl.push(GeneratePinPage, { accountProtectionIndex: 2, IsRegisterAcc: 'YES', resultDataGet: resultData });
            }
        }
        else {
            this.accountProtectionName = "4 Digit PIN";
            this.navCtrl.push(GeneratePinPage, { accountProtectionIndex: 2, IsRegisterAcc: 'YES', resultDataGet: resultData });
        }
    };
    LicencePage.prototype.saveDataUser = function (resultData) {
        var apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
        this.defaultimageSrc = localStorage.getItem('defaultimageSrc');
        localStorage.setItem('isRegister', 'Yes');
        var userAcc = {
            pushPin: resultData.Result.App_Push_Pin,
            companyname: resultData.Result.CN,
            SuccessCode: resultData.Result.SuccessCode,
            sessionId: resultData.Result.sessionId,
            tag: resultData.Result.tag,
            CN: resultData.Result.CN,
            CompanyIcon: resultData.Result.CompanyIcon,
            OTPSecretKey: resultData.Result.OTPSecretKey,
            email: resultData.Result.data.email,
            mobile: resultData.Result.data.mobile,
            name: resultData.Result.data.name,
            userName: resultData.Result.userName,
            accountName: resultData.Result.CN,
            imageSrc: this.defaultimageSrc,
            secretKey: resultData.Result.OTPSecretKey,
            isRegister: false,
            accountIndex: 1,
            accountProtectionEnable: resultData.Result.PasswordProtected,
            A2CapiUrl: apiUrlA2c,
            licenseId: this.licenceId,
            accountProtectionPin: totpProtection.accountProtectionPin,
        };
        localStorage.setItem("UserRegisterInfo", JSON.stringify(userAcc));
        var oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
        if (oldgetStorage) {
            if (oldgetStorage.length > 0) {
                var index = oldgetStorage.findIndex(function (obj) { return obj.accountIndex == 1; });
                if (index == -1) {
                }
                else {
                    var oldAccount = oldgetStorage[index].pushPin;
                    if (oldAccount) {
                        oldgetStorage.splice(index, 1);
                    }
                }
                var newarr = JSON.stringify(oldgetStorage);
                this.accountArr1 = JSON.parse(newarr);
                oldgetStorage.splice(0, 0, userAcc);
                localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                this.enableGoogleDrive();
            }
            else {
                userAcc.accountIndex = 1;
                this.accountArr.push(userAcc);
                localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                this.enableGoogleDrive();
            }
        }
        else {
            this.accountArr.push(userAcc);
            userAcc.accountIndex = 1;
            localStorage.setItem("accounts", JSON.stringify(this.accountArr));
            this.enableGoogleDrive();
        }
    };
    LicencePage.prototype.enableGoogleDrive = function () {
        var _this = this;
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            if (enableTxt == 'Enabled') {
                localStorage.setItem('isEnable', 'Enabled');
                var getAccountData = JSON.parse(localStorage.getItem("accounts"));
                var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                if (totpProtection) {
                    this.accountProtectionPin = totpProtection.accountProtectionPin;
                }
                if (getAccountData) {
                    if (getAccountData.length > 0) {
                        for (var i = 0; i < getAccountData.length; i++) {
                            getAccountData[i].accountProtectionPin = this.accountProtectionPin;
                        }
                    }
                }
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
    // end
    LicencePage.prototype.formatDateTime = function () {
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
    LicencePage.prototype.menuClick = function () {
        this.navCtrl.popToRoot();
    };
    LicencePage.prototype.userProfileClick = function () {
        this.navCtrl.push(UserProfilePage);
    };
    LicencePage.prototype.CancelButton = function () {
        this.navCtrl.popToRoot();
    };
    LicencePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-licence',
            templateUrl: 'licence.html',
        }),
        __metadata("design:paramtypes", [NavController, LoadingController, AlertController, Camera, ActionSheetController, NavParams, LicenceAgreementProvider, FileTransfer, File])
    ], LicencePage);
    return LicencePage;
}());
export { LicencePage };
//# sourceMappingURL=licence.js.map