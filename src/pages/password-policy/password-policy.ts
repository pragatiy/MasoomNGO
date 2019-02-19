import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, App, NavParams, LoadingController, AlertController, Navbar } from 'ionic-angular';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { Toast } from '@ionic-native/toast';
import { Observable } from 'rxjs/Rx';
import * as CryptoJS from 'crypto-js/crypto-js';
import * as aes from 'aesutil/aes';
import { commonString } from "../.././app/commonString";
import { HomePage } from '../home/home';
/**
 * Generated class for the PasswordPolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var AesUtil;
@IonicPage()
@Component({
  selector: 'page-password-policy',
  templateUrl: 'password-policy.html',
})

export class PasswordPolicyPage {
  @ViewChild(Navbar) navBar: Navbar;
  policyPassword: any;
  flag: number;
  errorPasswordLength: string;
  errorConfirmPassword: string;
  minLength: any;
  minLowerCase: any;
  minNumber: any;
  minSymbol: any;
  minUpperCase: any;
  ConfirmpolicyPassword: any;
  minLengthcondition: boolean;
  minLowerCasecondition: boolean;
  minNumbercondition: boolean;
  minSymbolcondition: boolean;
  minUpperCasecondition: boolean;
  loading: any;
  encrypPassword: any;

  constructor(public navCtrl: NavController, private toast: Toast, public ngzone: NgZone, public navParams: NavParams,
    public restProvider: A2cApiProvider, public app: App, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.loading = this.loadingCtrl.create({
      content: commonString.passwordPolicyPage.waitMsg
    });
  }


  backLogoClick() {
    this.navCtrl.popToRoot();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.navCtrl.popToRoot();
    }

    let passwordPolicy = JSON.parse(localStorage.getItem("passwordPolicy"));
    if ((passwordPolicy.minLength == '') || (passwordPolicy.minLength == 0) || (passwordPolicy.minLength == undefined)) {
      this.minLengthcondition = false;
    }
    else {
      this.minLength = passwordPolicy.minLength;
      this.minLengthcondition = true;
    }
    if ((passwordPolicy.minLowerCase == '') || (passwordPolicy.minLowerCase == 0) || (passwordPolicy.minLowerCase == undefined)) {
      this.minLowerCasecondition = false;
    }
    else {
      this.minLowerCase = passwordPolicy.minLowerCase;
      this.minLowerCasecondition = true;
    }
    if ((passwordPolicy.minNumber == '') || (passwordPolicy.minNumber == 0) || (passwordPolicy.minNumber == undefined)) {
      this.minNumbercondition = false;

    }
    else {
      this.minNumber = passwordPolicy.minNumber;
      this.minNumbercondition = true;
    }
    if ((passwordPolicy.minSymbol == '') || (passwordPolicy.minSymbol == 0) || (passwordPolicy.minSymbol == undefined)) {
      this.minSymbolcondition = false;
    }
    else {
      this.minSymbol = passwordPolicy.minSymbol;
      this.minSymbolcondition = true;
    }
    if ((passwordPolicy.minUpperCase == '') || (passwordPolicy.minUpperCase == 0) || (passwordPolicy.minUpperCase == undefined)) {
      this.minUpperCasecondition = false;
    }
    else {
      this.minUpperCase = passwordPolicy.minUpperCase;
      this.minUpperCasecondition = true;
    }
  }

  checkNewPasswordPolicy() {
    try {
      this.validatePasswordlength();
      if (this.flag == 0) {
        return;
      }
      this.validatePassworddigit();
      if (this.flag == 0) {
        return;
      }
      this.validatePasswordUppercase();
      if (this.flag == 0) {
        return;
      }
      this.validatePasswordLowercase();
      if (this.flag == 0) {
        return;
      }
      this.validatePasswordSpecialChar();
      if (this.flag == 0) {
        return;
      }
    }
    catch (error) {
      console.log('Error' + error);
    }
  }

  checkPasswordPolicy() {
    try {
      debugger;
      this.checkNewPasswordPolicy();
      if (this.flag == 0) {
        return;
      }
      this.validateConfirmPassword();
      if (this.flag == 0) {
        return;
      }
      this.setPasswordEncrypted(this.ConfirmpolicyPassword);
      localStorage.setItem('PushFlag', 'RsetPasswordPush');
      debugger;

      this.loading.present();
      let sessionid = localStorage.getItem('sessionId');
      this.restProvider.resetPasswordYes(sessionid).subscribe(
        (result) => {
          let resultObj = JSON.stringify(result);
          let resultData = JSON.parse(resultObj);
          let sucessCode = resultData.Result.SuccessCode;
          if (sucessCode == 200) {

            this.toast.show(`Success`, '500', 'bottom').subscribe(
              toast => {
                console.log(toast);
              }
            );
            this.loading.dismiss();
            localStorage.setItem('sessionId', resultData.Result.sessionId);
            this.app.getRootNav().setRoot(HomePage);
          }
          else if (resultData.Result.SuccessCode == 100) {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              subTitle: commonString.passwordPolicyPage.errRegistrationKey,
              buttons: ['Ok']
            });
            alert.present();
          } else if (resultData.Result.SuccessCode == 400) {
            this.loading.dismiss();

            let alert = this.alertCtrl.create({
              subTitle: commonString.passwordPolicyPage.requestFailed,
              buttons: ['Ok']
            });
            alert.present();
          } else if (resultData.Result.SuccessCode == 700) {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              subTitle: commonString.passwordPolicyPage.userIdMsg,
              buttons: ['Ok']
            });
            alert.present();
          } else {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              subTitle: commonString.passwordPolicyPage.connectivityErr,
              buttons: ['Ok']
            });
            alert.present();
          }
        },
        (error) => {
          console.log('error api' + JSON.stringify(error));
        });


    }
    catch (error) {
      console.log('Error' + error);
    }

  }

  // Validate Password Length

  validatePasswordlength() {
    if (this.policyPassword.length < this.minLength) {
      this.errorPasswordLength = commonString.passwordPolicyPage.passwordErr + this.minLength + commonString.passwordPolicyPage.charlong;
      this.flag = 0;
    } else {
      this.errorPasswordLength = '';
      this.flag = 1;
    }
  }
  // Validate Password Digit

  validatePassworddigit() {
    let digitlength = this.policyPassword.replace(/[^0-9]/g, "").length;
    if ((!/\d/.test(this.policyPassword)) || (digitlength < this.minNumber)) {
      this.errorPasswordLength = commonString.passwordPolicyPage.passAtleast + this.minNumber + ' digit';
      this.flag = 0;
    } else {
      this.errorPasswordLength = '';
      this.flag = 1;
    }
  }

  // Validate Password Upper Case

  validatePasswordUppercase() {
    let uppercaselength = this.policyPassword.replace(/[^A-Z]/g, "").length;
    if ((!/[A-Z]/.test(this.policyPassword)) || (uppercaselength < this.minUpperCase)) {
      this.errorPasswordLength = commonString.passwordPolicyPage.passAtleast + this.minUpperCase + ' Upper Case';
      this.flag = 0;
    } else {
      this.errorPasswordLength = '';
      this.flag = 1;
    }
  }

  // Validate Password Lower Case 

  validatePasswordLowercase() {
    debugger;
    let lowercaselength = this.policyPassword.replace(/[^a-z]/g, "").length;
    if ((!/[a-z]/.test(this.policyPassword)) || (lowercaselength < this.minLowerCase)) {
      this.errorPasswordLength = commonString.passwordPolicyPage.passAtleast + this.minLowerCase + ' Lower Case';
      this.flag = 0;
    } else {
      this.errorPasswordLength = '';
      this.flag = 1;
    }
  }

  // Validate Password Special Character 

  validatePasswordSpecialChar() {
    let specialcharlength = this.policyPassword.replace(/[^-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/g, "").length;
    if ((!/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/.test(this.policyPassword)) || (specialcharlength < this.minSymbol)) {
      this.errorPasswordLength = commonString.passwordPolicyPage.passAtleast + this.minSymbol + ' Special Character';
      this.flag = 0;
    } else {
      this.errorPasswordLength = '';
      this.flag = 1;
    }
  }

  //Validate Confirm Password

  validateConfirmPassword() {
    if (this.policyPassword != this.ConfirmpolicyPassword) {
      this.errorConfirmPassword =  commonString.passwordPolicyPage.passnotMatch;
      this.flag = 0;
    }
    else {
      this.errorConfirmPassword = '';
      this.flag = 1;
    }
  }

  onKeyPassworldLength(event) {
    this.ngzone.run(() => {
      if (this.policyPassword == '') {
        this.errorPasswordLength = '';
      }
      else {
        this.checkNewPasswordPolicy();
      }
    });
  }

  onKeyConfirmPassworldLength(event) {
    this.ngzone.run(() => {
      if (this.ConfirmpolicyPassword == '') {
        this.errorConfirmPassword = '';
      }
      else {
        if (this.policyPassword != this.ConfirmpolicyPassword) {
          this.errorConfirmPassword = commonString.passwordPolicyPage.passnotMatch;
          this.flag = 0;
        }
        else {
          this.errorConfirmPassword = '';
          this.flag = 1;
        }
      }
    });
  }


  public setPasswordEncrypted(password): void {
    debugger;
    // Encrypt 
    let secretKey = localStorage.getItem('resetPassKey')
    var iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    var salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    var aesUtil = new AesUtil(128, 1000);
    var ciphertext = aesUtil.encrypt(salt, iv, secretKey, password);
    var aesPassword = (iv + "::" + salt + "::" + ciphertext);
    this.encrypPassword = btoa(aesPassword);
    localStorage.setItem('policyPassword', this.encrypPassword);
    console.log('encrypt pass' + this.encrypPassword);

  }


  //Cancel Button 
  CancelButton() {
    this.navCtrl.popToRoot();

  }


}



