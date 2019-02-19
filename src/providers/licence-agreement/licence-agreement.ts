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
@Injectable()
export class LicenceAgreementProvider {

  apiUrl: string;
  //device:string;
  MobileAppVersion: any;
  constructor(public device: Device, public plt: Platform, private appVersion: AppVersion, public http: HttpClient, public config: Config, private loadingCtrl: LoadingController) {

    this.appVersion.getVersionNumber().then(version => {
      this.MobileAppVersion = version;
      console.log(this.MobileAppVersion);
    });

  }


  getUsers(licenceId, companyName): Observable<any> {
    debugger;
    let apiUrlA2c = localStorage.getItem("apiUrlA2c");
    let token = localStorage.getItem("token");
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
    return this.http.post(apiUrlA2c + companyName + '/mobile-api/registerAndroidDevice',
      clientConfirmData, { headers: httpheaders })
      .map(this.getDataSuccess)
      .catch(this.getDataError);
  }

  getUsersTest() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/users').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
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

