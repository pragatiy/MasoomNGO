import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class A2cApiProvider {
    apiUrlA2c: any;
    apiRequest: any;
    newPassword: any;
    newResponseUrl: any;
    constructor(public plt: Platform, public http: HttpClient, public config: Config) {
        console.log('Hello A2cApiProvider Provider');
    }

    resetPassword(): Observable<any> {
        //   alert('confirm user');
        debugger;
        let token = localStorage.getItem("token");
        console.log(token);
        this.newPassword = localStorage.getItem('policyPassword');
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        console.log(ResultData.sessionId);
        let mobiledataRequest = {
            ADUserID: ResultData.userName,
            Username: ResultData.userName,
            Token: token,
            companyname: ResultData.companyname,
            button: "reset"
        }
        console.log('new response url', this.apiUrlA2c);
        let dataResponseUrl = localStorage.getItem('dataResponseUrl');
        if (dataResponseUrl) {
            this.newResponseUrl = dataResponseUrl;
        } else {
            this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/confirmuserdroid';
        }
        console.log('new response url with company name  ', this.newResponseUrl);
        let httpheaders = new HttpHeaders();
        var clientConfirmData: any;
        clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", ResultData.sessionId);

        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        //httpheaders.append('Content-Type','application/json'); 
        return this.http.post(this.newResponseUrl,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    }

    //Reset Password Yes Event

    resetPasswordYes(sessionid) {
        debugger;
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        this.newPassword = localStorage.getItem('policyPassword');
        let ResultData = JSON.parse(userRegisterInfo);
        let mobiledataRequest = {
            EventAction: "YES",
            Username: ResultData.userName,
            Password: this.newPassword,
            ConfirmPassword: this.newPassword
        }
        let dataResponseUrl = localStorage.getItem('dataResponseUrl');
        if (dataResponseUrl) {
            this.newResponseUrl = dataResponseUrl;
        } else {
            this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/resetpasswordandroid';
        }
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        console.log('form data ', clientConfirmData);
        for (let key in clientConfirmData) {
            console.log(key);
        }
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        //httpheaders.append('Content-Type','application/json'); 
        return this.http.post(this.newResponseUrl,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    }


    //confirm user for unlock Account

    unlockAccount(): Observable<any> {
        debugger;
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        let token = localStorage.getItem("token");
        console.log(token);
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        // alert(ResultData.sessionId);
        console.log(ResultData.sessionId);
        let mobiledataRequest = {
            ADUserID: ResultData.userName,
            Username: ResultData.userName,
            Token: token,
            companyname: ResultData.companyname,
            button: "unlock"
        }
        let dataResponseUrl = localStorage.getItem('dataResponseUrl');
        if (dataResponseUrl) {
            this.newResponseUrl = dataResponseUrl;
        } else {
            this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/confirmuserdroid';
        }
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", ResultData.sessionId);
        console.log('form data ', clientConfirmData);
        for (let key in clientConfirmData) {
            console.log(key);
        }
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        //httpheaders.append('Content-Type','application/json'); 
        return this.http.post(this.newResponseUrl,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);

    }

    //end

    //Call Api for Unlock Account
    unlockAccountYes(sessionid) {
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);

        let mobiledataRequest = {
            EventAction: "YES",
            Company: ResultData.companyname,
            Username: ResultData.userName
        }

        let dataResponseUrl = localStorage.getItem('dataResponseUrl');
        if (dataResponseUrl) {
            this.newResponseUrl = dataResponseUrl;
        } else {
            this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/unlockaccountdroid';
        }

        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        console.log('form data ', clientConfirmData);
        for (let key in clientConfirmData) {
            console.log(key);
        }
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        //httpheaders.append('Content-Type','application/json'); 
        return this.http.post(this.newResponseUrl,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);

    }

    //Resend Notification Request API
    resendNotification(sessionid) {
        debugger;
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);

        let mobiledataRequest = {
            Username: ResultData.userName,
            EventAction: "RESEND"
        }


        let dataResponseUrl = localStorage.getItem('dataResponseUrl');
        if (dataResponseUrl) {
            this.newResponseUrl = dataResponseUrl;
        } else {
            this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/resetpasswordandroid';
        }
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        console.log('form data ', clientConfirmData);
        for (let key in clientConfirmData) {
            console.log(key);
        }
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        //httpheaders.append('Content-Type','application/json'); 
        return this.http.post(this.newResponseUrl,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);


    }

    //Push to Phone Notification Request
    pushToPhoneYes() {
        debugger;
        //    alert('push to phone');
        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);

        let mobiledataRequest = {
            EventAction: "YES",
            Company: ResultData.companyname,
            Username: ResultData.userName
        }

        let dataResponseUrl = localStorage.getItem('dataResponseUrl');
        if (dataResponseUrl) {
            this.newResponseUrl = dataResponseUrl;
        } else {
            this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/getpushresponsedroid';
        }

        let httpheaders = new HttpHeaders();

        httpheaders.append('Content-Type', 'application/json');
        return this.http.post(this.newResponseUrl,
            mobiledataRequest, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);

    }

    // timeout API call 
    timeoutRequest(sessionid, PushFlag) {

        if (PushFlag == "RsetPasswordPush") {
            debugger;
            this.apiRequest = "resetpasswordandroid";
            this.apiUrlA2c = localStorage.getItem("apiUrlA2c");

            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);

            let mobiledataRequest = {
                Company: ResultData.companyname,
                EventAction: "NO",
                Username: ResultData.userName,
                Reason: "TimedOut"
            }

            let dataResponseUrl = localStorage.getItem('dataResponseUrl');
            if (dataResponseUrl) {
                this.newResponseUrl = dataResponseUrl;
            } else {
                this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/' + this.apiRequest;
            }

            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            console.log('form data ', clientConfirmData);
            for (let key in clientConfirmData) {
                console.log(key);
            }
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');

            return this.http.post(this.newResponseUrl,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else if (PushFlag == "UnlockAccountPush") {
            debugger;
            this.apiRequest = "unlockaccountdroid";
            this.apiUrlA2c = localStorage.getItem("apiUrlA2c");

            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);

            let mobiledataRequest = {
                Company: ResultData.companyname,
                EventAction: "NO",
                Username: ResultData.userName,
                Reason: "TimedOut"
            }

            let dataResponseUrl = localStorage.getItem('dataResponseUrl');
            if (dataResponseUrl) {
                this.newResponseUrl = dataResponseUrl;
            } else {
                this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/' + this.apiRequest;
            }

            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            console.log('form data ', clientConfirmData);
            for (let key in clientConfirmData) {
                console.log(key);
            }
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');

            return this.http.post(this.newResponseUrl,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else {

            debugger;
            this.apiRequest = "getpushresponsedroid";
            this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let mobiledataRequest = {
                Company: ResultData.companyname,
                EventAction: "NO",
                Username: ResultData.userName,
                Reason: "TimedOut"
            }
            let dataResponseUrl = localStorage.getItem('dataResponseUrl');
            if (dataResponseUrl) {
                this.newResponseUrl = dataResponseUrl;
            } else {
                this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/' + this.apiRequest;
            }
            let httpheaders = new HttpHeaders();
            httpheaders.append('Content-Type', 'application/json');
            return this.http.post(this.newResponseUrl,
                mobiledataRequest, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }

        //alert(this.apiRequest);


    }



    // Fraud API call
    fraudRequest(sessionid, PushFlag) {
        if (PushFlag == "RsetPasswordPush") {
            debugger;
            this.apiRequest = "resetpasswordandroid";
            this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let mobiledataRequest = {
                Company: ResultData.companyname,
                EventAction: "NO",
                Username: ResultData.userName,
                Reason: "Fraud"

            }
            let dataResponseUrl = localStorage.getItem('dataResponseUrl');
            if (dataResponseUrl) {
                this.newResponseUrl = dataResponseUrl;
            } else {
                this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/' + this.apiRequest;
            }
            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            console.log('form data ', clientConfirmData);
            for (let key in clientConfirmData) {
                console.log(key);
            }
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.newResponseUrl,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else if (PushFlag == "UnlockAccountPush") {
            debugger;
            this.apiRequest = "unlockaccountdroid";
            this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let mobiledataRequest = {
                Company: ResultData.companyname,
                EventAction: "NO",
                Username: ResultData.userName,
                Reason: "Fraud"

            }
            let dataResponseUrl = localStorage.getItem('dataResponseUrl');
            if (dataResponseUrl) {
                this.newResponseUrl = dataResponseUrl;
            } else {
                this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/' + this.apiRequest;
            }
            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            console.log('form data ', clientConfirmData);
            for (let key in clientConfirmData) {
                console.log(key);
            }
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.newResponseUrl,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else {

            debugger;
            this.apiRequest = "getpushresponsedroid";
            this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let mobiledataRequest = {
                Company: ResultData.companyname,
                EventAction: "NO",
                Username: ResultData.userName,
                Reason: "Fraud"
            }
            let dataResponseUrl = localStorage.getItem('dataResponseUrl');
            if (dataResponseUrl) {
                this.newResponseUrl = dataResponseUrl;
            } else {
                this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/' + this.apiRequest;
            }
            let httpheaders = new HttpHeaders();
            httpheaders.append('Content-Type', 'application/josn');
            return this.http.post(this.newResponseUrl,
                mobiledataRequest, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }

    }




    // Mistake API call
    mistakeRequest(sessionid, PushFlag) {

        if (PushFlag == "RsetPasswordPush") {
            debugger;
            this.apiRequest = "resetpasswordandroid";
            this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let mobiledataRequest = {
                Company: ResultData.companyname,
                EventAction: "NO",
                Username: ResultData.userName,
                Reason: "Mistake"
            }
            let dataResponseUrl = localStorage.getItem('dataResponseUrl');
            if (dataResponseUrl) {
                this.newResponseUrl = dataResponseUrl;
            } else {
                this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/' + this.apiRequest;
            }
            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            console.log('form data ', clientConfirmData);
            for (let key in clientConfirmData) {
                console.log(key);
            }
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.newResponseUrl,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else if (PushFlag == "UnlockAccountPush") {
            debugger;
            this.apiRequest = "unlockaccountdroid";
            this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let mobiledataRequest = {
                Company: ResultData.companyname,
                EventAction: "NO",
                Username: ResultData.userName,
                Reason: "Mistake"
            }
            let dataResponseUrl = localStorage.getItem('dataResponseUrl');
            if (dataResponseUrl) {
                this.newResponseUrl = dataResponseUrl;
            } else {
                this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/' + this.apiRequest;
            }
            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            console.log('form data ', clientConfirmData);
            for (let key in clientConfirmData) {
                console.log(key);
            }
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.newResponseUrl,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else {

            debugger;
            console.log('mistake req push to phone ');
            this.apiRequest = "getpushresponsedroid";
            this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let mobiledataRequest = {
                Company: ResultData.companyname,
                EventAction: "NO",
                Username: ResultData.userName,
                Reason: "Mistake"

            }
            let dataResponseUrl = localStorage.getItem('dataResponseUrl');
            if (dataResponseUrl) {
                this.newResponseUrl = dataResponseUrl;
            } else {
                this.newResponseUrl = this.apiUrlA2c + ResultData.companyname + '/mobile-api/' + this.apiRequest;
            }
            let httpheaders = new HttpHeaders();

            debugger;
            console.log('mistake req data ', mobiledataRequest);
            httpheaders.append('Content-Type', 'application/json');
            return this.http.post(this.newResponseUrl,
                mobiledataRequest, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }

    }


    // success method return response
    private getDataSuccess(response): Observable<any> {
        console.log('confirmUserData' + JSON.stringify(response));
        var resultObj = JSON.stringify(response);
        var result = JSON.parse(resultObj);
        console.log(result.Result.sessionId);
        return response || {};
    }

    // error occurred return response
    private getDataError(error): Observable<any> {
        debugger;
        console.error('An error occurred', error);
        return Observable.throw(error);
    }


}



