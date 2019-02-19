import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from 'ionic-angular';
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
@Injectable()
export class LicenceAgreementProvider {

    apiUrl: string;
    apiUrlA2c: any;
    MobileAppVersion: any;

    constructor(public device: Device, public plt: Platform, public http: HttpClient, public config: Config) {


    }

    getUsers(licenceId, companyName): Observable<any> {
        this.MobileAppVersion = localStorage.getItem("MobileAppVersion");
        this.apiUrlA2c = 'https://' + localStorage.getItem("apiUrlA2c") + '/a2c/';
       
        let token = localStorage.getItem("token");
       
        console.log(token);
        let mobiledataRequest = {
            Key: licenceId,
            Device: this.device.platform,
            Token: token,
            OSVersion: this.device.version,
            MobileAppVersion: this.MobileAppVersion
        }
        let httpheaders = new HttpHeaders();
        var clientConfirmData = new FormData();
        clientConfirmData.append("mobiledata", JSON.stringify(mobiledataRequest));
        httpheaders.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.apiUrlA2c + companyName + '/mobile-api/registerAppleDevice',
            clientConfirmData, { headers: httpheaders })
            .map(this.getDataSuccess)
            .catch(this.getDataError);

    }

    // success method return response
    private getDataSuccess(response): Observable<any> {
        console.log(JSON.stringify(response));
        return response || {};
    }

    // error occurred return response
    private getDataError(error): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error);

    }

}