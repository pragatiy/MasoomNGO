import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { GeneratePinPage } from '../generate-pin/generate-pin';
import { TouchID } from '@ionic-native/touch-id';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { NativeAudio } from '@ionic-native/native-audio';
import * as jsSHA from "jssha";
import { Vibration } from '@ionic-native/vibration';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";
import { UserProfilePage } from "../user-profile/user-profile";

/**
* Generated class for the GenerateTotpPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-generate-totp',
  templateUrl: 'generate-totp.html',
})
export class GenerateTotpPage {

  accountIndexdata: any;
  indexdata: any;
  accountIndexOld: number = -1;
  divHeight: number = 0;
  accountIndexTOTP: any;
  isTOTPopen: Boolean;
  names: any;
  index: any;
  getStorage: any;
  selectedACCinObj: any;
  TOTPGenerated: any;
  intervalId: any;
  localCoundown: any;
  counDownCss: any;
  imageSrc: any;
  isUserRegister: Boolean = false;
  GeneratepinPage: any;
  companyname : any;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private zone: NgZone, private alertCtrl: AlertController,
    public touchId: TouchID,
    private ringtones: NativeRingtones,
    private nativeAudio: NativeAudio,
    private vibration: Vibration, public events: Events) {


    getAccountId = navParams.get("accountIndexTOTP");
    this.indexdata = navParams.get("indexTOTP");
    this.getStorage = navParams.get("getStorage");
    this.selectedACCinObj = navParams.get("selectedACCinObj");
    this.GeneratepinPage = navParams.get("GeneratepinPage");
    this.names = this.getStorage;

    let accountData = this.names.find(x => x.accountIndex == getAccountId);
    this.imageSrc = accountData.imageSrc;
    this.companyname = accountData.accountName;
    this.counDownCss = 50;
  }


  ionViewDidLoad() {

    console.log('ionViewDidLoad GenerateTotpPage');
    if (this.GeneratepinPage == undefined) {
      this.getOTP(this.selectedACCinObj, this.indexdata);
    }
    else {
      this.generateTOTP(getAccountId, this.indexdata);
    }

  }

  ionViewWillEnter() {

    let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));   
    if (registerUsered) {
      this.isUserRegister = true;
    } else {
      this.isUserRegister = false;
    }
  }

  userProfileClick() {
    this.intervalId.unsubscribe();
      clearInterval(this.intervalId);
		this.navCtrl.push(UserProfilePage);
	}

  // Back Button and Logo Click Method

  public backbtnFun() {
    try {
      this.intervalId.unsubscribe();
      clearInterval(this.intervalId);
      this.navCtrl.popToRoot();
    } catch (error) {
      console.log('error');
    }
  }



  public generateTOTP(accountId: any, index) {
    try {
      let selectedAcc = this.names.find(x => x.accountIndex == accountId);
      let selectedACCinString = JSON.stringify(selectedAcc);
      let selectedACCinObj = JSON.parse(selectedACCinString);
      this.getOTP(selectedACCinObj, index);
      this.index = index;
      getAccountId = accountId;
      index = this.index;
      indexAccountChetu = this.index;
    } catch (error) {
      console.log("Error occured");
    }

  }

  public getOTP(selectedAccount: any, index) {

    var epoch = Math.round(new Date().getTime() / 1000.0);
    countDown = 30 - (epoch % 30);
    this.localCoundown = countDown;
    this.counDownCss = Math.round((countDown) * 3.3);
    try {
      let epoch = Math.round(new Date().getTime() / 1000.0);
      let time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, "0");
      let hmacObj = new jsSHA(time, "HEX");
      let hmac = hmacObj.getHMAC(this.base32tohex(selectedAccount.secretKey), "HEX", "SHA-1", "HEX");
      let offset = this.hex2dec(hmac.substring(hmac.length - 1));
      var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
      otp = (otp).substr(otp.length - 6, 6);
      this.names[index].otpValue = otp;
      globalOTP = otp;
      this.TOTPGenerated = globalOTP;
      this.delayedAlert();
    } catch (error) {
      console.log("Invalid Secret Key, Please modify it!");
    }
  }

  //  Delay Alert Message Method

  delayedAlert() {

    try {
      this.intervalId = Observable.interval(1000).subscribe(x => {
        this.timer();
      });
    } catch (error) {
      console.log("Error occured");
    }
  }


  /// Timer Method Called

  timer() {
    try {
      this.zone.run(() => {
        countDown--;
        this.localCoundown = countDown;
        this.counDownCss = Math.round((countDown) * 3.3);
        if (countDown == 0) {
          this.localCoundown = 30;
          this.counDownCss = Math.round(( this.localCoundown) * 3.3);
          let getStorageToDisplay = JSON.parse(localStorage.getItem("accounts"));
          let selectedAccDisplay = getStorageToDisplay.find(x => x.accountIndex == getAccountId);
          let selectedACCinStringDisplay = JSON.stringify(selectedAccDisplay);
          let selectedACCinObjDisplay = JSON.parse(selectedACCinStringDisplay);
          let epoch = Math.round(new Date().getTime() / 1000.0);
          let time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
          let hmacObj = new jsSHA(time, "HEX");
          let hmac = hmacObj.getHMAC(base32tohex(selectedACCinObjDisplay.secretKey), "HEX", "SHA-1", "HEX");
          let offset = hex2dec(hmac.substring(hmac.length - 1));
          var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
          globalOTP = (otp).substr(otp.length - 6, 6);
          this.TOTPGenerated = globalOTP;
          countDown = 30;

        }
      });
    } catch (error) {
      console.log("Error occured TOTPTTT");
    }
  }

  /// Get Other TOTP Method


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
    let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
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


}

function dec2hex(value: number) {
  return (value < 15.5 ? "0" : "") + Math.round(value).toString(16);
}

function hex2dec(value: string) {
  return parseInt(value, 16);
}

function leftpad(value: string, length: number, pad: string) {
  if (length + 1 >= value.length) {
    value = Array(length + 1 - value.length).join(pad) + value;
  }
  return value;
}

function base32tohex(base32: string) {
  let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";
  for (let i = 0; i < base32.length; i++) {
    let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    bits += leftpad(val.toString(2), 5, '0');
  }
  for (let i = 0; i + 4 <= bits.length; i += 4) {
    let chunk = bits.substr(i, 4);
    hex = hex + parseInt(chunk, 2).toString(16);
  }
  return hex;
}

let countDown: number = 30;
let intervalId;
let globalOTP: string;
let getAccountId: any;
let indexAccountChetu: any;