var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';
/*
  Generated class for the LicenceAgreementProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var LicenceAgreementProvider = /** @class */ (function () {
    function LicenceAgreementProvider(device, plt, appVersion, http, config, loadingCtrl) {
        var _this = this;
        this.device = device;
        this.plt = plt;
        this.appVersion = appVersion;
        this.http = http;
        this.config = config;
        this.loadingCtrl = loadingCtrl;
        this.appVersion.getVersionNumber().then(function (version) {
            _this.MobileAppVersion = version;
            console.log(_this.MobileAppVersion);
        });
    }
    LicenceAgreementProvider.prototype.getUsers = function (licenceId, companyName) {
        debugger;
        var apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var token = localStorage.getItem("token");
        var mobiledataRequest = {
            Key: licenceId,
            Device: this.device.platform,
            Token: token,
            OSVersion: this.device.version,
            MobileAppVersion: this.MobileAppVersion
        };
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(apiUrlA2c + companyName + '/mobile-api/registerAndroidDevice', clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    LicenceAgreementProvider.prototype.getUsersTest = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get(_this.apiUrl + '/users').subscribe(function (data) {
                resolve(data);
            }, function (err) {
                console.log(err);
            });
        });
    };
    // success method return response
    LicenceAgreementProvider.prototype.getDataSuccess = function (response) {
        console.log(JSON.stringify(response));
        return response || {};
    };
    // error occurred return response
    LicenceAgreementProvider.prototype.getDataError = function (error) {
        console.error('An error occurred', error);
        return Observable.throw(error);
    };
    LicenceAgreementProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Device, Platform, AppVersion, HttpClient, Config, LoadingController])
    ], LicenceAgreementProvider);
    return LicenceAgreementProvider;
}());
export { LicenceAgreementProvider };
//# sourceMappingURL=licence-agreement.js.map