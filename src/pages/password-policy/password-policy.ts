import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Navbar } from 'ionic-angular';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { UserProfilePage } from "../user-profile/user-profile";
import { Toast } from '@ionic-native/toast';;
import * as CryptoJS from 'crypto-js/crypto-js';
import * as aes from 'aesutil/aes';
//import * as Aesutill from '../../assets/js/AesUtil'


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
  @ViewChild('confirmPassword') myInput ;
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
  isUserRegister: Boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public restProvider: A2cApiProvider, public loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private toast: Toast, private zone: NgZone) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  }


  ionViewWillEnter() {

    let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
    if (registerUsered) {
      this.isUserRegister = true;
    } else {
      this.isUserRegister = false;
    }
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

  // Back Button Click

  public backLogoClick() {
    try {
      this.navCtrl.popToRoot();
    } catch (error) {
      console.log('error');
    }
  }

  // User Profile Page

  userProfileClick() {
    this.navCtrl.push(UserProfilePage);
    //this.navCtrl.push(UnlockPage);
  }

  checkNewPasswordPolicy() {
    try {
      debugger;
      if (this.minLengthcondition == true) {
        this.validatePasswordlength();
        if (this.flag == 0) {
          return;
        }
      }

      if (this.minNumbercondition == true) {
        this.validatePassworddigit();
        if (this.flag == 0) {
          return;
        }
      }

      if (this.minUpperCasecondition == true) {
        this.validatePasswordUppercase();
        if (this.flag == 0) {
          return;
        }
      }

      if (this.minLowerCasecondition == true) {
        this.validatePasswordLowercase();
        if (this.flag == 0) {
          return;
        }
      }

      if (this.minSymbolcondition == true) {
        this.validatePasswordSpecialChar();
        if (this.flag == 0) {
          return;
        }
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


      let resetPasswordKey = localStorage.getItem('resetPasswordKey');

      // ENCRYPT DATA CODE

      var iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
      var salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
      var aesUtil = new AesUtil(128, 1000);
      var ciphertext = aesUtil.encrypt(salt, iv, resetPasswordKey, this.policyPassword);
      var aesPassword = (iv + "::" + salt + "::" + ciphertext);
      var password = btoa(aesPassword);

      // END 

      localStorage.setItem('policyPassword', password);
      this.loading.present();
      let sessionid = localStorage.getItem('sessionId');
      this.restProvider.resetPasswordYes(sessionid).subscribe(
        (result) => {
          let resultObj = JSON.stringify(result);
          let resultData = JSON.parse(resultObj);
          let sucessCode = resultData.Result.SuccessCode;

          if (sucessCode == 200) {
            this.loading.dismiss();
            localStorage.setItem('sessionId', resultData.Result.sessionId);

            // Extra Code
            localStorage.setItem('PushFlag', '');
            this.toast.show(`Success`, '500', 'bottom').subscribe(
              toast => {
                console.log(toast);
              }
            );
            this.navCtrl.popToRoot();
            // End

          }
          else if (sucessCode == 100) {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              subTitle: 'Registration key not found on the database.',
              buttons: ['Ok']
            });
            alert.present();
          }
          else if (sucessCode == 400) {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              subTitle: 'Request Failed.',
              buttons: ['Ok']
            });
            alert.present();
          }
          else if (sucessCode == 700) {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              subTitle: 'User ID not found.',
              buttons: ['Ok']
            });
            alert.present();
          }
          else {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              subTitle: 'connectivity error.',
              buttons: ['Ok']
            });
            alert.present();
            console.log("Sucess data" + JSON.stringify(result));
          }
        },
        (error) => {
          console.log("error api" + JSON.stringify(error));
        }
      );
    }
    catch (error) {
      console.log('Error' + error);
    }

  }


  // Validate Password Length

  validatePasswordlength() {
    debugger;
    if (this.policyPassword.length < this.minLength) {
      this.errorPasswordLength = 'Password must be ' + this.minLength + ' character long';
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
      this.errorPasswordLength = 'Password must contain atleast ' + this.minNumber + ' digit';
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
      this.errorPasswordLength = 'Password must contain atleast ' + this.minUpperCase + ' Upper Case';
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
      this.errorPasswordLength = 'Password must contain atleast ' + this.minLowerCase + ' Lower Case';
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
      this.errorPasswordLength = 'Password must contain atleast ' + this.minSymbol + ' Special Character';
      this.flag = 0;
    } else {
      this.errorPasswordLength = '';
      this.flag = 1;
    }
  }

  //Validate Confirm Password

  validateConfirmPassword() {

    if (this.policyPassword != this.ConfirmpolicyPassword) {
      this.errorConfirmPassword = 'Password do not match!';
      this.flag = 0;
    }
    else {
      this.errorConfirmPassword = '';
      this.flag = 1;
    }
  }

  onKeyPassworldLength(event) {
    debugger;
    console.log(event.keyCode)
    if (event.keyCode != "13") {
      this.zone.run(() => {
        if (this.policyPassword == '') {
          this.errorPasswordLength = '';
        }
        else {
          this.checkNewPasswordPolicy();
        }
      });
    } else {
      this.myInput.setFocus();
    }
  }

  onKeyConfirmPassworldLength(event) {
    this.zone.run(() => {
      if (this.ConfirmpolicyPassword == '') {
        this.errorConfirmPassword = '';
      }
      else {
        if (this.policyPassword != this.ConfirmpolicyPassword) {
          this.errorConfirmPassword = 'Password do not match!';
          this.flag = 0;
        }
        else {
          this.errorConfirmPassword = '';
          this.flag = 1;
        }
      }
    });
  }

  //Cancel Button 
  CancelButton() {
    this.navCtrl.popToRoot();
  }
}
