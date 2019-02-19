import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import * as jsSHA from 'jssha';
import { Observable } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';
import { commonString } from "../.././app/commonString";

/**
 * Generated class for the ShowTotpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-totp',
  templateUrl: 'show-totp.html',
})
export class ShowTotpPage {
  isUserRegister: Boolean = false;
  isTOTPopen: any;
  names: any;
  accountName: any;
  imgSrc: any;
  accountIndexOld: any;
  globalOTP: any;
  countDownlocal: any;
  selectedACCinObj: any;
  index: any;
  countdownCss: any;
  intervalId: any;
  constructor(public navCtrl: NavController, public platform: Platform, private ngzone: NgZone, public navParams: NavParams) {
    this.selectedACCinObj = navParams.get("selectedACCinObj");
    this.index = navParams.get("index");
    this.accountName = this.selectedACCinObj.accountName;
    this.imgSrc = this.selectedACCinObj.imageSrc;
    let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
    if (registerUsered) {
      this.isUserRegister = true;
    }
    else {
      this.isUserRegister = false;
    }
    let getStorage = JSON.parse(localStorage.getItem("accounts"));
    this.names = getStorage;
    let accountName = localStorage.getItem("accountsName");
    //this.accountName = accountName;
    this.getOTP(this.selectedACCinObj, this.index);

    platform.registerBackButtonAction(() => {
      this.navCtrl.popToRoot();
    });
  }
  backLogoClick() {
    this.intervalId.unsubscribe();
    this.navCtrl.popToRoot();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowTotpPage');
  }

  userProfileClick() {
    this.intervalId.unsubscribe();
    this.navCtrl.push(UserProfilePage, { 'backTo': 'showtotp' });
  }

  private dec2hex(value: number) {
    return (value < 15.5 ? "0" : "") + Math.round(value).toString(16);
  }

  private hex2dec(value: string) {
    return parseInt(value, 16);
  }

  private leftpad(value: string, length: number, pad: string) {
    if (length + 1 >= value.length) {
      value = Array(length + 1 - value.length).join(pad) + value;
    }
    return value;
  }

  private base32tohex(base32: string) {
    let base32chars = commonString.showTotpPage.base64String;
    let bits = "";
    let hex = "";
    for (let i = 0; i < base32.length; i++) {
      let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
      bits += this.leftpad(val.toString(2), 5, '0');
    }
    for (let i = 0; i + 4 <= bits.length; i += 4) {
      let chunk = bits.substr(i, 4);
      hex = hex + parseInt(chunk, 2).toString(16);
    }
    return hex;
  }



  public getOTP(selectedAccount: any, index) {
    var epoch = Math.round(new Date().getTime() / 1000.0);
    countDown = 30 - (epoch % 30);
    this.countDownlocal = countDown;
    if (countDown <= 15) {
      isFirstTotp = 2;
    } else {
      isFirstTotp = 3;
    }

    try {
      let epoch = Math.round(new Date().getTime() / 1000.0);
      let time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, "0");
      let hmacObj = new jsSHA(time, "HEX");
      let hmac = hmacObj.getHMAC(this.base32tohex(selectedAccount.secretKey), "HEX", "SHA-1", "HEX");
      let offset = this.hex2dec(hmac.substring(hmac.length - 1));
      var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
      otp = (otp).substr(otp.length - 6, 6);
      this.names[index].otpValue = otp;
      this.globalOTP = otp;
      this.delayedAlert();
    }
    catch (error) { alert(commonString.showTotpPage.invalidKeyMsg); }
  }


  timer() {
    debugger;
    try {
      countDown--;
      this.countDownlocal = countDown;
      this.countdownCss = Math.round((countDown) * 3.3);
      if (countDown == 0) {
        this.intervalId.unsubscribe();
        countDown = 30;
        this.countDownlocal = countDown;
        this.getOTP(this.selectedACCinObj, this.index);
      }
    } catch (error) { console.log("Error occured"); }
  }

  delayedAlert() {
    try {
      this.intervalId = Observable.interval(1000).subscribe(x => {
        this.timer();
      });
      // intervalId = setInterval(this.timer, 1000);
    } catch (error) { console.log("Error occured"); }
  }


}



let countDown: number = 30;
let globalCountdown: any;
var intervalId;
let indexAccountChetu: number = 0;
let index: any;
let getAccountId: any;
let isFirstTotp: number;