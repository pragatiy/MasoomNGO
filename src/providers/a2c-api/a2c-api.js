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
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
var A2cApiProvider = /** @class */ (function () {
    function A2cApiProvider(plt, http, config) {
        this.plt = plt;
        this.http = http;
        this.config = config;
        console.log('Hello A2cApiProvider Provider');
    }
    A2cApiProvider.prototype.resetPassword = function () {
        var token = localStorage.getItem("token");
        console.log(token);
        this.newPassword = localStorage.getItem('policyPassword');
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        var ResultData = JSON.parse(userRegisterInfo);
        console.log(ResultData.sessionId);
        var mobiledataRequest = {
            ADUserID: ResultData.userName,
            Username: ResultData.userName,
            Token: token,
            companyname: ResultData.CN,
            button: "reset"
        };
        let = localStorage.getItem('dataResponseUrl');
        if (this.newResponseUrl) {
        }
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", ResultData.sessionId);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + ResultData.CN + '/mobile-api/confirmuserdroid', clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    //Reset Password Yes Event
    A2cApiProvider.prototype.resetPasswordYes = function (sessionid) {
        debugger;
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        this.newPassword = localStorage.getItem('policyPassword');
        var ResultData = JSON.parse(userRegisterInfo);
        var mobiledataRequest = {
            EventAction: "YES",
            Username: ResultData.userName,
            Password: this.newPassword,
            ConfirmPassword: this.newPassword
        };
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + ResultData.CN + '/mobile-api/resetpasswordandroid', clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    //Unlock user Account
    A2cApiProvider.prototype.unlockAccount = function () {
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var token = localStorage.getItem("token");
        console.log(token);
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        var ResultData = JSON.parse(userRegisterInfo);
        // alert(ResultData.sessionId);
        console.log(ResultData.sessionId);
        var mobiledataRequest = {
            ADUserID: ResultData.userName,
            Username: ResultData.userName,
            Token: token,
            companyname: ResultData.CN,
            button: "unlock"
        };
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", ResultData.sessionId);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + ResultData.CN + '/mobile-api/confirmuserdroid', clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    //end
    //Call Api for Unlock Account
    A2cApiProvider.prototype.unlockAccountYes = function (sessionid) {
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        var ResultData = JSON.parse(userRegisterInfo);
        var mobiledataRequest = {
            EventAction: "YES",
            Company: ResultData.CN,
            Username: ResultData.userName
        };
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + ResultData.CN + '/mobile-api/unlockaccountdroid', clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    //Resend Notification Request API
    A2cApiProvider.prototype.resendNotification = function (sessionid) {
        debugger;
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        var ResultData = JSON.parse(userRegisterInfo);
        var mobiledataRequest = {
            Username: ResultData.userName,
            EventAction: "RESEND"
        };
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + ResultData.CN + '/mobile-api/resetpasswordandroid', clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    //Push to Phone Notification Request
    A2cApiProvider.prototype.pushToPhoneYes = function () {
        debugger;
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        var ResultData = JSON.parse(userRegisterInfo);
        var mobiledataRequest = {
            EventAction: "YES",
            Company: ResultData.CN,
            Username: ResultData.userName
        };
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + ResultData.CN + '/mobile-api/getpushresponsedroid', clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    // timeout API call 
    A2cApiProvider.prototype.timeoutRequest = function (sessionid, PushFlag) {
        if (PushFlag == "RsetPasswordPush") {
            this.apiRequest = "resetpasswordandroid";
        }
        else if (PushFlag == "UnlockAccountPush") {
            this.apiRequest = "unlockaccountdroid";
        }
        else {
            this.apiRequest = "getpushresponsedroid";
        }
        //alert(this.apiRequest);
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        var ResultData = JSON.parse(userRegisterInfo);
        var mobiledataRequest = {
            companyname: ResultData.CN,
            EventAction: "NO",
            Username: ResultData.userName,
            Reason: "TimedOut"
        };
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + ResultData.CN + '/mobile-api/' + this.apiRequest, clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    // Fraud API call
    A2cApiProvider.prototype.fraudRequest = function (sessionid, PushFlag) {
        if (PushFlag == "RsetPasswordPush") {
            this.apiRequest = "resetpasswordandroid";
        }
        else if (PushFlag == "UnlockAccountPush") {
            this.apiRequest = "unlockaccountdroid";
        }
        else {
            this.apiRequest = "getpushresponsedroid";
        }
        //alert(this.apiRequest);
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        var ResultData = JSON.parse(userRegisterInfo);
        var mobiledataRequest = {
            companyname: ResultData.CN,
            EventAction: "NO",
            Username: ResultData.userName,
            Reason: "Fraud"
        };
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + ResultData.CN + '/mobile-api/' + this.apiRequest, clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    // Mistake API call
    A2cApiProvider.prototype.mistakeRequest = function (sessionid, PushFlag) {
        if (PushFlag == "RsetPasswordPush") {
            this.apiRequest = "resetpasswordandroid";
        }
        else if (PushFlag == "UnlockAccountPush") {
            this.apiRequest = "unlockaccountdroid";
        }
        else {
            this.apiRequest = "getpushresponsedroid";
        }
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        var userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        var ResultData = JSON.parse(userRegisterInfo);
        var mobiledataRequest = {
            companyname: ResultData.CN,
            EventAction: "NO",
            Username: ResultData.userName,
            Reason: "Mistake"
        };
        var httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + ResultData.CN + '/mobile-api/' + this.apiRequest, clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    };
    // success method return response
    A2cApiProvider.prototype.getDataSuccess = function (response) {
        console.log('confirmUserData' + JSON.stringify(response));
        var resultObj = JSON.stringify(response);
        var result = JSON.parse(resultObj);
        console.log(result.Result.sessionId);
        return response || {};
    };
    // error occurred return response
    A2cApiProvider.prototype.getDataError = function (error) {
        debugger;
        console.error('An error occurred', error);
        return Observable.throw(error);
    };
    A2cApiProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Platform, HttpClient, Config])
    ], A2cApiProvider);
    return A2cApiProvider;
}());
export { A2cApiProvider };
//# sourceMappingURL=a2c-api.js.map