import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
/*
  Generated class for the A2cApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class A2cApiProvider {
    apiUrlA2c; any;
    resetpasswordpush: any;
    constructor(public plt: Platform, public http: HttpClient, public config: Config) {
       // this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/';
    }

    resetPassword(): Observable<any> {
        debugger;
        let token = localStorage.getItem("token");
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        console.log('user info in provider',userRegisterInfo);
        let ResultData = JSON.parse(userRegisterInfo);
        let newApiUrl = localStorage.getItem('dataResponseUrl');
        if((newApiUrl != '') && (newApiUrl != undefined)){
            this.apiUrlA2c = newApiUrl;
        } else{
            this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/confirmuser';
        }
        console.log(ResultData.sessionId);
        let mobiledataRequest = {
            ADUserID: ResultData.userName,
            Username: ResultData.userName,
            Token: token,
            companyname: ResultData.companyname,
            button: "reset"
        }
        
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        console.log(clientConfirmData);
     //   alert(clientConfirmData);
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", ResultData.sessionId);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c,
      // return this.http.post('https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.CN + '/mobile-api/confirmuserdroid',
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);

    }

    // Reset Password Yes Event

    resetPasswordYes(sessionid) {
     debugger;
        let policyPassword =  localStorage.getItem('policyPassword');
    
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        let newApiUrl = localStorage.getItem('dataResponseUrl');
        if((newApiUrl != '') && (newApiUrl != undefined)){
            this.apiUrlA2c = newApiUrl;
        } else{
            this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/resetpasswordios';
        }
        let mobiledataRequest = {
            EventAction: "YES",
            Username: ResultData.userName,
            Password: policyPassword,
            ConfirmPassword: policyPassword
        }

        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.apiUrlA2c,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    }

    // Unlock user Account

    unlockAccount(): Observable<any> {
        let token = localStorage.getItem("token");
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        let newApiUrl = localStorage.getItem('dataResponseUrl');
        if((newApiUrl != '') && (newApiUrl != undefined)){
            this.apiUrlA2c = newApiUrl;
        } else{
            this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/confirmuser';
        }
        let mobiledataRequest = {
            ADUserID: ResultData.userName,
            Username: ResultData.userName,
            Token: token,
            companyname: ResultData.companyname,
            button: "unlock"
        }
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", ResultData.sessionId);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);

    }

    //Call Api for Unlock Account

    unlockAccountYes(sessionid) {
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        let newApiUrl = localStorage.getItem('dataResponseUrl');
        if((newApiUrl != '') && (newApiUrl != undefined)){
            this.apiUrlA2c = newApiUrl;
        } else{
            this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/unlockaccount';
        }
        let mobiledataRequest = {
            EventAction: "YES",
            Company: ResultData.companyname,
            Username: ResultData.userName
        }
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);

    }

    // Resend Notification Request API

    resendNotification(sessionid) {
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        let newApiUrl = localStorage.getItem('dataResponseUrl');
        if((newApiUrl != '') && (newApiUrl != undefined)){
            this.apiUrlA2c = newApiUrl;
        } else{
            this.apiUrlA2c = this.apiUrlA2c + ResultData.CN + '/mobile-api/resetpasswordpush';
        }
        let mobiledataRequest = {
            Username: ResultData.userName,
            EventAction: "RESEND"
        }
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    }

    // Push to Phone Notification Request

    pushToPhoneYes() {
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        let newApiUrl = localStorage.getItem('dataResponseUrl');
        if((newApiUrl != '') && (newApiUrl != undefined)){
            this.apiUrlA2c = newApiUrl;
        } else{
            this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/getpushresponse';
        }
        let mobiledataRequest = {
            EventAction: "YES",
            Company: ResultData.companyname,
            Username: ResultData.userName
        }
        let httpheaders = new HttpHeaders();
       // var clientConfirmData = new FormData();
       // clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        //httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        httpheaders.append('Content-Type', 'application/json');
        return this.http.post(this.apiUrlA2c,
            mobiledataRequest, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
    }

   

    // Fraud API call

    fraudRequest(sessionid, PageName) {
        if (PageName == "RsetPasswordPush") {
          //  this.resetpasswordpush = "resetpasswordpush";
            this.resetpasswordpush = "resetpasswordpush";
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let newApiUrl = localStorage.getItem('dataResponseUrl');
            if((newApiUrl != '') && (newApiUrl != undefined)){
                this.apiUrlA2c = newApiUrl;
            } else{
                this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/' + this.resetpasswordpush;
            }
            let mobiledataRequest = {
                EventAction: "NO",
                Company: ResultData.companyname,
                Username: ResultData.userName,
                Reason: "Fraud"
            }
            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.apiUrlA2c,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else if (PageName == "UnlockAccountPush") {
           // this.resetpasswordpush = "unlockaccount";
            this.resetpasswordpush = "resetpasswordpush";
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let newApiUrl = localStorage.getItem('dataResponseUrl');
            if((newApiUrl != '') && (newApiUrl != undefined)){
                this.apiUrlA2c = newApiUrl;
            } else{
                this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/' + this.resetpasswordpush;
            }
            let mobiledataRequest = {
                EventAction: "NO",
                Company: ResultData.companyname,
                Username: ResultData.userName,
                Reason: "Fraud"
            }
            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.apiUrlA2c,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else {
           // this. pushToPhoneYesfraud(sessionid, PageName);
           // this.resetpasswordpush = "getpushresponse";
           this.resetpasswordpush = "getpushresponse";
           let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
           let ResultData = JSON.parse(userRegisterInfo);
           let newApiUrl = localStorage.getItem('dataResponseUrl');
           if((newApiUrl != '') && (newApiUrl != undefined)){
               this.apiUrlA2c = newApiUrl;
           } else{
               this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/' + this.resetpasswordpush;
           }
           let mobiledataRequest = {
               EventAction: "NO",
               Company: ResultData.companyname,
               Username: ResultData.userName,
               Reason: "Fraud"
           }
           let httpheaders = new HttpHeaders();
           // var clientConfirmData = new FormData();
           // clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
           // clientConfirmData.append("SessionId", sessionid);
           httpheaders.append('Content-Type', 'application/json');
           return this.http.post(this.apiUrlA2c,
               mobiledataRequest, { headers: httpheaders })
               .map(this.getDataSuccess)
               .catch(this.getDataError);
        }
       
    }


   

    // Mistake API call

    mistakeRequest(sessionid, PageName) {
        if (PageName == "RsetPasswordPush") {
            this.resetpasswordpush = "resetpasswordpush";
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        let newApiUrl = localStorage.getItem('dataResponseUrl');
        if((newApiUrl != '') && (newApiUrl != undefined)){
            this.apiUrlA2c = newApiUrl;
        } else{
            this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/' + this.resetpasswordpush;
        }
        
        let mobiledataRequest = {
            EventAction: "NO",
            Username: ResultData.userName,
            Company: ResultData.companyname,
            Reason: "Mistake"
        }
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
        }
        else if (PageName == "UnlockAccountPush") {
            this.resetpasswordpush = "unlockaccount";
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        let newApiUrl = localStorage.getItem('dataResponseUrl');
        if((newApiUrl != '') && (newApiUrl != undefined)){
            this.apiUrlA2c = newApiUrl;
        } else{
            this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/' + this.resetpasswordpush;
        }
        
        let mobiledataRequest = {
            EventAction: "NO",
            Username: ResultData.userName,
            Company: ResultData.companyname,
            Reason: "Mistake"
        }
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c,
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
        }
        else {
           // this.resetpasswordpush = "getpushresponse";
        //   this.pushToPhoneYesMistake(sessionid, PageName)
           this.resetpasswordpush = "getpushresponse";
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        let ResultData = JSON.parse(userRegisterInfo);
        let newApiUrl = localStorage.getItem('dataResponseUrl');
        if((newApiUrl != '') && (newApiUrl != undefined)){
            this.apiUrlA2c = newApiUrl;
        } else{
            this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/' + this.resetpasswordpush;
        }
        let mobiledataRequest = {
            EventAction: "NO",
            Company: ResultData.companyname,
            Username: ResultData.userName,
            Reason: "Mistake"
        }
        let httpheaders = new HttpHeaders();
        // var clientConfirmData = new FormData();
        // clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        // clientConfirmData.append("SessionId", sessionid);
        httpheaders.append('Content-Type', 'application/json');
        return this.http.post(this.apiUrlA2c,
            mobiledataRequest, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);
        }
        
    }



 
    // Time out API call

    timeoutRequest(sessionid, PageName) {
        if (PageName == "RsetPasswordPush") {
            this.resetpasswordpush = "resetpasswordpush";
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let newApiUrl = localStorage.getItem('dataResponseUrl');
            if((newApiUrl != '') && (newApiUrl != undefined)){
                this.apiUrlA2c = newApiUrl;
            } else{
                this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/' + this.resetpasswordpush;
            }
            let mobiledataRequest = {
                EventAction: "NO",
                Username: ResultData.userName,
                Company: ResultData.companyname,
                Reason: "TimedOut"
            }
            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.apiUrlA2c,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else if (PageName == "UnlockAccountPush") {
            this.resetpasswordpush = "unlockaccount";
            let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
            let ResultData = JSON.parse(userRegisterInfo);
            let newApiUrl = localStorage.getItem('dataResponseUrl');
            if((newApiUrl != '') && (newApiUrl != undefined)){
                this.apiUrlA2c = newApiUrl;
            } else{
                this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/' + this.resetpasswordpush;
            }
            let mobiledataRequest = {
                EventAction: "NO",
                Username: ResultData.userName,
                Company: ResultData.companyname,
                Reason: "TimedOut"
            }
            let httpheaders = new HttpHeaders();
            var clientConfirmData = new FormData();
            clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
            clientConfirmData.append("SessionId", sessionid);
            httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
            return this.http.post(this.apiUrlA2c,
                clientConfirmData, { headers: httpheaders })
                .map(this.getDataSuccess)
                .catch(this.getDataError);
        }
        else {
            //this.resetpasswordpush = "getpushresponse";
           // this.pushToPhoneYesTiomeout(sessionid, PageName)
           this.resetpasswordpush = "getpushresponse";

           let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
           let ResultData = JSON.parse(userRegisterInfo);
           let newApiUrl = localStorage.getItem('dataResponseUrl');
           if((newApiUrl != '') && (newApiUrl != undefined)){
               this.apiUrlA2c = newApiUrl;
           } else{
               this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/' + ResultData.companyname + '/mobile-api/' + this.resetpasswordpush;
           }
           let mobiledataRequest = {
               EventAction: "NO",
               Company: ResultData.companyname,
               Username: ResultData.userName,
               Reason: "TimedOut"
           }
           let httpheaders = new HttpHeaders();
           // var clientConfirmData = new FormData();
           // clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
           // clientConfirmData.append("SessionId", sessionid);
           httpheaders.append('Content-Type', 'application/json');
           return this.http.post(this.apiUrlA2c,
               mobiledataRequest, { headers: httpheaders })
               .map(this.getDataSuccess)
               .catch(this.getDataError);
       
        }
       
    }



    // success method return response

    private getDataSuccess(response): Observable<any> {
        console.log(JSON.stringify(response));
        localStorage.removeItem('dataResponseUrl');
        return response || {};

    }

    // error occurred return response
    
    private getDataError(error): Observable<any> {
        console.error('An error occurred', error);
        localStorage.removeItem('dataResponseUrl');
        return Observable.throw(error);

    }

}

