var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, App, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { trigger, state, animate, style, transition } from '@angular/animations';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AddAccountPage } from '../add-account/add-account';
import { EditAccountPage } from '../edit-account/edit-account';
import { SettingPage } from '../setting/setting';
import { LicencePage } from '../licence/licence';
import { UserProfilePage } from '../user-profile/user-profile';
import { GeneratePinPage } from '../generate-pin/generate-pin';
import { ConfirmationScreenPage } from '../confirmation-screen/confirmation-screen';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { ModifyOrderPage } from '../modify-order/modify-order';
import { WelcomePage } from '../welcome/welcome';
import { IconlistPage } from '../iconlist/iconlist';
import { ShowTotpPage } from '../show-totp/show-totp';
import { UnlockPage } from '../unlock/unlock';
import { Vibration } from '@ionic-native/vibration';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Push } from '@ionic-native/push';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { Toast } from '@ionic-native/toast';
import * as jsSHA from 'jssha';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { NativeAudio } from '@ionic-native/native-audio';
import { AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { reorderArray } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
var HomePage = /** @class */ (function () {
    function HomePage(menu, navCtrl, platform, app, navParams, restProvider, barcodeScanner, androidFingerprintAuth, vibration, deeplinks, push, loadingCtrl, toast, ringtones, zone, alertCtrl, nativeAudio, appVersion, Camera) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.app = app;
        this.navParams = navParams;
        this.restProvider = restProvider;
        this.barcodeScanner = barcodeScanner;
        this.androidFingerprintAuth = androidFingerprintAuth;
        this.vibration = vibration;
        this.deeplinks = deeplinks;
        this.push = push;
        this.loadingCtrl = loadingCtrl;
        this.toast = toast;
        this.ringtones = ringtones;
        this.zone = zone;
        this.alertCtrl = alertCtrl;
        this.nativeAudio = nativeAudio;
        this.appVersion = appVersion;
        this.Camera = Camera;
        this.buttonClicked = false;
        this.accountIndex = 1;
        this.accountIndexOld = -1;
        this.current = 100;
        this.max = 100;
        this.accountArr = [];
        this.isUserRegister = false;
        this.accountName = "Account Details";
        this.modify = false;
        this.isDisplay = 'block';
        platform.ready().then(function () {
            _this.deviceId = localStorage.getItem('deviceId');
            platform.registerBackButtonAction(function () {
                console.log('home page ');
            });
            // this.CryptoJS = require("crypto-js");
            /* //////////////// restore backup
           alert("constructor");
               let isFirstAppLaunch =  localStorage.getItem('isFirstAppLaunch');
                if(isFirstAppLaunch == null || isFirstAppLaunch == undefined) {
                        localStorage.setItem('isFirstAppLaunch','Yes');
                       this.navCtrl.push(WelcomePage);
           
           //////////////////////////////end
                   
                   }*/
            _this.Deeplinking();
            var isToken = localStorage.getItem("token");
            if (isToken) {
                _this.PushNotification();
                console.log("local storage token" + isToken);
            }
            else {
                _this.PushNotification();
                console.log("Push Notification function");
            }
            _this.androidFingerprintAuth.isAvailable()
                .then(function (result) {
                if (result.isAvailable) {
                    localStorage.setItem('isFingerPrintEnable', 'yes');
                }
                else {
                    localStorage.setItem('isFingerPrintEnable', 'no');
                }
            })
                .catch(function (error) {
                //alert("last cancel called ");
                console.error(error);
            });
        });
        menu.enable(true);
        var getStorage = JSON.parse(localStorage.getItem("accounts"));
        this.names = getStorage;
        var accountName = localStorage.getItem("accountsName");
        this.accountName = accountName;
    }
    HomePage.prototype.ionViewDidLoad = function () {
        this.platform.registerBackButtonAction(function () {
            console.log('home page ');
        });
    };
    //DeepLinkig
    HomePage.prototype.Deeplinking = function () {
        var _this = this;
        this.deeplinks.route({
            '/a2c/:company/:mobile/:platform/:licenceid': LicencePage,
        }).subscribe(function (match) {
            var companyName = match.$args.company;
            var NewlicenceId = match.$args.licenceid;
            console.log('Successfully matched route', match);
            var apiUrlA2c = match.$link.url;
            //   let apiUrlA2cHost=match.$link.host;
            var newstr = apiUrlA2c.split(companyName + '/');
            var isregistered = localStorage.getItem("isRegister");
            localStorage.setItem('apiUrlA2c', newstr[0]);
            if (isregistered == 'Yes') {
                var OldlicenceId = localStorage.getItem("licenseId");
                if (OldlicenceId != NewlicenceId) {
                    _this.navCtrl.push(LicencePage, { licenceId: NewlicenceId, companyName: companyName });
                }
                else {
                    var registerData = localStorage.getItem("UserRegisterInfo");
                    if (registerData) {
                    }
                    else {
                        _this.navCtrl.push(LicencePage, { licenceId: NewlicenceId, companyName: companyName });
                    }
                }
            }
            else {
                _this.navCtrl.push(LicencePage, { licenceId: NewlicenceId, companyName: companyName });
            }
        }, function (nomatch) {
            console.error('Got a deeplink that didn\'t match', nomatch.$link.url);
        });
    };
    //end
    //Push Notification
    HomePage.prototype.PushNotification = function () {
        var _this = this;
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldgetStorage) {
            if (oldgetStorage.vibration == true) {
                this.isVibrate = true;
            }
            else {
                this.isVibrate = false;
            }
        }
        else {
            this.isVibrate = true;
        }
        this.push.hasPermission()
            .then(function (res) {
            if (res.isEnabled) {
                console.log('We have permission to send push notifications');
            }
            else {
                console.log('We do not have permission to send push notifications');
            }
        });
        // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
        this.push.createChannel({
            id: "a2cApp",
            description: "My first test channel",
            // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            importance: 3
        }).then(function () { return console.log('Channel created'); });
        // Delete a channel (Android O and above)
        this.push.deleteChannel('a2cApp').then(function () { return console.log('Channel deleted'); });
        // Return a list of currently configured channels
        this.push.listChannels().then(function (channels) { return console.log('List of channels', channels); });
        // to initialize push notifications
        var options = {
            android: {
                senderID: '59523452146',
                sound: false,
                vibrate: this.isVibrate,
                forceShow: '1',
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'true'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };
        var pushObject = this.push.init(options);
        pushObject.on('notification').subscribe(function (notification) {
            console.log(notification);
            _this.zone.run(function () {
                if (notification.additionalData.foreground == true) {
                    //Play ringtone Sound 
                    var ringtoneUrl = localStorage.getItem('ringtoneUrl');
                    if (ringtoneUrl && ringtoneUrl != 'null') {
                        _this.ringtones.playRingtone(ringtoneUrl);
                    }
                    else {
                        //Play default Sound 
                        _this.nativeAudio.preloadComplex('default', 'assets/sound/default.mp3', 1, 1, 0);
                        _this.nativeAudio.preloadSimple('default', 'assets/sound/default.mp3');
                        console.log("Musique Play");
                        _this.nativeAudio.play('default', function () { return console.log('uniqueId1 is done playing'); });
                    }
                    if (_this.isVibrate == true) {
                        _this.vibration.vibrate(1000);
                    }
                }
            });
            var PushFlag = localStorage.getItem("PushFlag");
            console.log('Received a notification', notification);
            console.log('Received a notification with ', notification.additionalData.tag);
            // alert(notification.additionalData.tag);
            debugger;
            if (notification.additionalData.tag == "confirmUserID") {
                if (PushFlag == "RsetPasswordPush") {
                    // this.CheckSecurity(notification,PushFlag);
                    _this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: "RsetPasswordPush" });
                }
                else if (PushFlag == "UnlockAccountPush") {
                    // this.CheckSecurity(notification,PushFlag);
                    //change the unlock page
                    _this.navCtrl.push(UnlockPage, { notification: notification, PushFlag: "UnlockAccountPush" });
                }
                else {
                    var alert_1 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Other notification',
                        buttons: ['OK']
                    });
                    alert_1.present();
                    //  alert('other notification');
                    // this.navCtrl.push(ConfirmationScreenPage, {notification: notification,PushFlag:"UnlockAccountPush"});
                }
            }
            else if (notification.additionalData.tag == "resetPasswordPush") {
                // this.navCtrl.push(GeneratePasswordPage, { notification: notification });
            }
            else if (notification.additionalData.tag == "sendAppPush") {
                var pageName = "LoginAccountYes";
                // this.navCtrl.push(ConfirmationScreenPage, {notification: notification,PushFlag:"LoginAccountYes"});  
                _this.CheckSecurity(notification, pageName);
            }
            else {
            }
        });
        pushObject.on('registration').subscribe(function (registration) {
            return localStorage.setItem('token', registration.registrationId);
        });
        pushObject.on('error').subscribe(function (error) { return console.error('Error with Push plugin', error); });
        pushObject.on('error').subscribe(function (error) { return console.error('Error with Push plugin', error); });
    };
    //End 
    //Check Security
    HomePage.prototype.CheckSecurity = function (notification, PushFlag) {
        var _this = this;
        debugger;
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        localStorage.setItem('redirectTo', 'ConfirmationScreen');
        if (oldgetStorage) {
            if (oldgetStorage.accountProtection) {
                var protectionType = oldgetStorage.accountProtection;
                if (protectionType == 2) {
                    console.log("4 digit pin");
                    //this.navCtrl.push(GeneratePinPage,{notification:notification,PushFlag:PushFlag});  
                    this.app.getRootNav().setRoot(GeneratePinPage, { notification: notification, PushFlag: PushFlag });
                }
                else if (protectionType == 1) {
                    var date = new Date();
                    var newtimeStamp = void 0;
                    newtimeStamp = date.getTime();
                    var oldtimeStamp = void 0;
                    var minutesDifference = 1212;
                    oldtimeStamp = localStorage.getItem('oldtimeStamp');
                    if (oldtimeStamp) {
                        var difference = newtimeStamp - oldtimeStamp;
                        minutesDifference = Math.floor(difference / 1000 / 60);
                    }
                    if (minutesDifference <= 2) {
                        this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
                    }
                    else {
                        this.androidFingerprintAuth.isAvailable()
                            .then(function (result) {
                            if (result.isAvailable) {
                                // it is available
                                // alert("fingerprint found"+result.isAvailable);       
                                _this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword', disableBackup: true })
                                    .then(function (result) {
                                    console.log(result);
                                    var date = new Date();
                                    var oldtimeStamp;
                                    oldtimeStamp = date.getTime();
                                    localStorage.setItem('oldtimeStamp', oldtimeStamp);
                                    if (result.withFingerprint) {
                                        console.log('Successfully encrypted credentials.');
                                        console.log('Encrypted credentials: ' + result.token);
                                        _this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
                                    }
                                    else if (result.withBackup) {
                                        console.log('Successfully authenticated with backup password!');
                                    }
                                    else
                                        console.log('Didn\'t authenticate!');
                                })
                                    .catch(function (error) {
                                    var alert = _this.alertCtrl.create({
                                        title: '',
                                        message: 'Would you like to use 4 digit pin',
                                        buttons: [
                                            {
                                                text: 'No',
                                                role: 'cancel',
                                                handler: function () {
                                                    console.log('Cancel clicked');
                                                }
                                            },
                                            {
                                                text: 'Yes',
                                                handler: function () {
                                                    console.log('yes clicked');
                                                    _this.app.getRootNav().setRoot(GeneratePinPage, { notification: notification, PushFlag: PushFlag });
                                                }
                                            }
                                        ]
                                    });
                                    if (oldgetStorage.accountProtectionPin != 0) {
                                        alert.present();
                                    }
                                    if (error == "FINGERPRINT_CANCELLED") {
                                        //alert("cancel called ");
                                        console.log('Fingerprint authentication cancelled');
                                    }
                                    else {
                                        console.error(error);
                                    }
                                });
                            }
                            else {
                                var alert_2 = _this.alertCtrl.create({
                                    title: '',
                                    subTitle: "fingerprint not found" + result.isAvailable,
                                    buttons: ['OK']
                                });
                                alert_2.present();
                                // alert("fingerprint not found"+result.isAvailable);
                                // fingerprint auth isn't available
                            }
                        })
                            .catch(function (error) {
                            //alert("last cancel called ");
                            console.error(error);
                        });
                        console.log("Biomatrics");
                    }
                }
                else {
                    this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
                    console.log("None");
                }
            }
            else {
                this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
                console.log("accountProtection empty");
            }
        }
        else {
            console.log("old storage empty");
            this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
        }
    };
    HomePage.prototype.fingerPrintEnable = function (accountIndex, index) {
        var _this = this;
        debugger;
        localStorage.setItem('accountIndex', accountIndex);
        localStorage.setItem('index', index);
        localStorage.setItem('redirectTo', 'HomePageTOTP');
        var accIndex = accountIndex;
        var newIndex = index;
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        var date = new Date();
        var newtimeStamp;
        newtimeStamp = date.getTime();
        var oldtimeStamp;
        var minutesDifference = 1212;
        oldtimeStamp = localStorage.getItem('oldtimeStamp');
        if (oldtimeStamp) {
            var difference = newtimeStamp - oldtimeStamp;
            minutesDifference = Math.floor(difference / 1000 / 60);
        }
        if (minutesDifference <= 2) {
            this.generateTOTP(accIndex, newIndex);
        }
        else {
            this.androidFingerprintAuth.isAvailable()
                .then(function (result) {
                if (result.isAvailable) {
                    // it is available
                    // alert("fingerprint found"+result.isAvailable);       
                    _this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword', disableBackup: true })
                        .then(function (result) {
                        var date = new Date();
                        var oldtimeStamp;
                        oldtimeStamp = date.getTime();
                        localStorage.setItem('oldtimeStamp', oldtimeStamp);
                        if (result.withFingerprint) {
                            console.log('Successfully encrypted credentials.');
                            _this.generateTOTP(accIndex, newIndex);
                            console.log('Encrypted credentials: ' + result.token);
                        }
                        else if (result.withBackup) {
                            console.log('Successfully authenticated with backup password!');
                        }
                        else
                            console.log('Didn\'t authenticate!');
                    })
                        .catch(function (error) {
                        var alert = _this.alertCtrl.create({
                            title: '',
                            message: 'Would you like to use 4 digit pin',
                            buttons: [
                                {
                                    text: 'No',
                                    role: 'cancel',
                                    handler: function () {
                                        console.log('Cancel clicked');
                                    }
                                },
                                {
                                    text: 'Yes',
                                    handler: function () {
                                        localStorage.setItem('redirectTo', 'HomePageTOTP');
                                        console.log('yes clicked');
                                        _this.navCtrl.push(GeneratePinPage);
                                    }
                                }
                            ]
                        });
                        if (oldgetStorage.accountProtectionPin != 0) {
                            alert.present();
                        }
                        if (error == "FINGERPRINT_CANCELLED") {
                            //alert("cancel called ");
                            console.log('Fingerprint authentication cancelled');
                        }
                        else {
                            console.error(error);
                        }
                    });
                }
                else {
                    var alert_3 = _this.alertCtrl.create({
                        title: '',
                        subTitle: "fingerprint not found" + result.isAvailable,
                        buttons: ['OK']
                    });
                    alert_3.present();
                    // alert("fingerprint not found"+result.isAvailable);
                    // fingerprint auth isn't available
                }
            })
                .catch(function (error) {
                console.error(error);
            });
        }
    };
    HomePage.prototype.backbtnFuc = function () {
        console.log("backbtn called in device");
        this.navCtrl.pop({});
    };
    HomePage.prototype.ionViewWillEnter = function () {
        this.platform.registerBackButtonAction(function () {
            console.log('home page ');
        });
        //this.navCtrl.push(WelcomePage);  
        //alert("will enter");
        //////////////// restore backup 
        debugger;
        var isFirstAppLaunch = localStorage.getItem('isFirstAppLaunch');
        if (isFirstAppLaunch == null || isFirstAppLaunch == undefined) {
            this.navCtrl.push(WelcomePage);
            //////////////////////////////end 
        }
        /*let flag = 1;
         if(flag ==1){
             let loading = this.loadingCtrl.create({
                  content: 'Please wait...',
                  duration: 500
              });
               loading.present();
          this.navCtrl.popToRoot;
          flag++;
          }*/
        debugger;
        this.PushNotification();
        var registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }
        this.accountIndexOld = -1;
        this.isTOTPopen = JSON.parse(localStorage.getItem("isTOTPopen"));
        var getStorage = JSON.parse(localStorage.getItem("accounts"));
        this.names = getStorage;
        console.log(JSON.stringify(this.names));
        var protectedAccIndex = localStorage.getItem('accountIndex');
        this.accountIndex = protectedAccIndex;
        var protectedIndex = localStorage.getItem('index');
        this.index = protectedIndex;
        var callTotp = localStorage.getItem('redirectTo');
        if (callTotp == 'TOTPprotection') {
            localStorage.setItem('redirectTo', '');
            var getStorage_1 = JSON.parse(localStorage.getItem("accounts"));
            /*if (registerUser==null) {
               this.accountArr.push(registerUser);
                  localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                  let singleGetStorage = JSON.parse(localStorage.getItem("accounts"));
                this.names = singleGetStorage;
           }else{
                getStorage.push(registerUser);
                this.names = getStorage;
    
           }*/
            this.names = getStorage_1;
            this.generateTOTP(this.accountIndex, this.index);
        }
        if (this.accountName != localStorage.getItem("accountsName")) {
            this.accountName = localStorage.getItem("accountsName");
        }
    };
    HomePage.prototype.ionViewDidEnter = function () {
        debugger;
        //  let buttonId=document.querySelector("#editBtnId0");             
        //   buttonId.innerHTML="";                               
    };
    HomePage.prototype.hideMenu = function () {
        var _this = this;
        this.zone.run(function () {
            var accDivIndex = document.querySelector("#totpdiv");
            if (accDivIndex) {
                clearInterval(intervalId);
                accDivIndex.innerHTML = '';
            }
            _this.buttonClicked = !_this.buttonClicked;
        });
    };
    HomePage.prototype.hideOpenTotp = function () {
        var accDivIndex = document.querySelector("#totpdiv");
        if (accDivIndex) {
            clearInterval(intervalId);
            accDivIndex.innerHTML = '';
        }
    };
    // Hide the Menu when clicks anywhere
    HomePage.prototype.menuClick = function () {
        var _this = this;
        this.zone.run(function () {
            try {
                //this.hideMenu();
                _this.buttonClicked = false;
            }
            catch (error) {
                console.log("Error occured");
            }
        });
    };
    //   redirect to add account page 
    HomePage.prototype.manualAddAccount = function () {
        try {
            this.navCtrl.push(AddAccountPage, {
                barcodeResult: this.getBarcodeResult,
                issuer_accountName: this.issuer_accountName,
                resaccountid: this.resaccountid
            });
        }
        catch (error) {
            console.log('Error occured');
        }
    };
    //  end 
    /*    manualAddAccount() {
            try {
                this.navCtrl.push(AddAccountPage, {
                    barcodeResult: this.getBarcodeResult
                });
            } catch (error) { console.log("Error occured"); }
        }
    */
    /*  public checkProtection(accountIndex: any, index) {
              this.navCtrl.push(ShowTotpPage);
    
      }*/
    HomePage.prototype.checkProtection = function (accountIndex, index) {
        var _this = this;
        debugger;
        var newTOTPSet = localStorage.getItem("isgeneratedTOTP");
        if (newTOTPSet == 'true') {
            this.accountIndexOld = -1;
            localStorage.setItem("isgeneratedTOTP", 'false');
        }
        localStorage.setItem('indexvalue', index);
        this.accountIndex = accountIndex;
        index = index;
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        localStorage.setItem('redirectTo', 'HomePageTOTP');
        var getStorage = JSON.parse(localStorage.getItem("accounts"));
        if (getStorage[index].accountProtectionEnable == true) {
            if (oldgetStorage) {
                if (oldgetStorage.accountProtection) {
                    var protectionType = oldgetStorage.accountProtection;
                    if (protectionType == 2) {
                        isFirstTotp = 1;
                        console.log("4 digit pin");
                        localStorage.setItem('accountIndex', accountIndex);
                        localStorage.setItem('index', index);
                        if (this.isTOTPopen == false || this.accountIndexOld != index) {
                            var selectedAcc = this.names.find(function (x) { return x.accountIndex == _this.accountIndex; });
                            var selectedACCinString = JSON.stringify(selectedAcc);
                            var selectedACCinObj = JSON.parse(selectedACCinString);
                            this.navCtrl.push(GeneratePinPage, { 'selectedACCinObj': selectedACCinObj, 'index': index });
                        }
                        else {
                            this.generateTOTP(this.accountIndex, index);
                        }
                    }
                    else if (protectionType == 1) {
                        isFirstTotp = 1;
                        console.log("Biomatrics");
                        if (this.isTOTPopen == false || this.accountIndexOld != index) {
                            this.fingerPrintEnable(this.accountIndex, index);
                        }
                        else {
                            this.generateTOTP(this.accountIndex, index);
                        }
                    }
                    else {
                        this.generateTOTP(this.accountIndex, index);
                        console.log("None");
                    }
                }
                else {
                    this.generateTOTP(this.accountIndex, index);
                    console.log("accountProtection empty");
                }
            }
            else {
                this.generateTOTP(this.accountIndex, index);
                console.log("old storage empty");
            }
        }
        else {
            this.generateTOTP(this.accountIndex, index);
            console.log("old storage empty");
        }
    };
    //generate TOTP by secret key
    HomePage.prototype.generateTOTP = function (accountId, index) {
        try {
            clearInterval(intervalId);
            var selectedAcc = this.names.find(function (x) { return x.accountIndex == accountId; });
            var selectedACCinString = JSON.stringify(selectedAcc);
            var selectedACCinObj = JSON.parse(selectedACCinString);
            // this.getOTP(selectedACCinObj, index);
            this.navCtrl.push(ShowTotpPage, { 'selectedACCinObj': selectedACCinObj, 'index': index });
            this.index = index;
            getAccountId = accountId;
            index = this.index;
            indexAccountChetu = this.index;
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    //  get barcode result
    HomePage.prototype.barcodeClick = function () {
        var _this = this;
        var accDivIndex = document.querySelector('#totpdiv');
        if (accDivIndex) {
            clearInterval(intervalId);
            accDivIndex.innerHTML = '';
        }
        try {
            this.barcodeScanner.scan().then(function (barcodeData) {
                console.log(barcodeData.text);
                if (barcodeData.text == 'BACK_PRESSED') {
                    localStorage.setItem('hideScanBtn', 'no');
                    _this.navCtrl.popToRoot();
                }
                else if (barcodeData.text == 'BUTTON_PRESSED') {
                    _this.navCtrl.push(IconlistPage);
                    localStorage.setItem('hideScanBtn', 'yes');
                }
                else {
                    localStorage.setItem('hideScanBtn', 'no');
                    var newSecretKey = void 0;
                    if (barcodeData.text.includes('secret') == true) {
                        // 
                        if ((barcodeData.text.includes('secret')) == true && (barcodeData.text.includes('issuer') == true)) {
                            var resIssuer = void 0;
                            resIssuer = decodeURIComponent(barcodeData.text);
                            resIssuer = resIssuer.split('issuer');
                            console.log('reissues' + resIssuer);
                            debugger;
                            _this.resaccountid = resIssuer[0].split(':');
                            if (_this.resaccountid.length == 2) {
                                var fbId = void 0;
                                var fbIdnew = void 0;
                                fbId = _this.resaccountid[1].split('/');
                                if (fbId.length == 4) {
                                    fbIdnew = fbId[3].split('?');
                                    _this.resaccountid = fbIdnew[0];
                                }
                            }
                            else {
                                _this.resaccountid = _this.resaccountid[2].split('?');
                                _this.resaccountid = _this.resaccountid[0];
                            }
                            resIssuer = resIssuer[1].split('=');
                            var issuer = resIssuer[1];
                            _this.issuer_accountName = issuer;
                        }
                        // 
                        var res = barcodeData.text.split('secret');
                        res = res[1].split('=');
                        newSecretKey = res[1];
                        if (res.length > 2) {
                            newSecretKey = newSecretKey.substring(0, newSecretKey.indexOf('&'));
                        }
                        _this.getBarcodeResult = newSecretKey;
                        _this.manualAddAccount();
                    }
                    else if (barcodeData.text.includes('/') == true) {
                        var res = barcodeData.text.split('/');
                        var barcodeDataresult = res[res.length - 1];
                        _this.getBarcodeResult = barcodeDataresult;
                        _this.manualAddAccount();
                    }
                    else {
                        _this.getBarcodeResult = barcodeData.text;
                        _this.manualAddAccount();
                    }
                }
            }, function (err) {
                _this.navCtrl.push(IconlistPage);
                localStorage.setItem('hideScanBtn', 'yes');
                console.log('Error occured : ' + err);
            });
        }
        catch (error) {
            console.log('Error occured');
        }
    };
    // end
    HomePage.prototype.dec2hex = function (value) {
        return (value < 15.5 ? "0" : "") + Math.round(value).toString(16);
    };
    HomePage.prototype.hex2dec = function (value) {
        return parseInt(value, 16);
    };
    HomePage.prototype.leftpad = function (value, length, pad) {
        if (length + 1 >= value.length) {
            value = Array(length + 1 - value.length).join(pad) + value;
        }
        return value;
    };
    HomePage.prototype.base32tohex = function (base32) {
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = "";
        var hex = "";
        for (var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += this.leftpad(val.toString(2), 5, '0');
        }
        for (var i = 0; i + 4 <= bits.length; i += 4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    };
    HomePage.prototype.getOTP = function (selectedAccount, index) {
        var _this = this;
        debugger;
        var epoch = Math.round(new Date().getTime() / 1000.0);
        countDown = 30 - (epoch % 30);
        if (countDown <= 15) {
            isFirstTotp = 2;
        }
        else {
            isFirstTotp = 3;
        }
        try {
            var epoch_1 = Math.round(new Date().getTime() / 1000.0);
            var time = this.leftpad(this.dec2hex(Math.floor(epoch_1 / 30)), 16, "0");
            var hmacObj = new jsSHA(time, "HEX");
            var hmac = hmacObj.getHMAC(this.base32tohex(selectedAccount.secretKey), "HEX", "SHA-1", "HEX");
            var offset = this.hex2dec(hmac.substring(hmac.length - 1));
            var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
            this.names[index].otpValue = otp;
            globalOTP = otp;
            if (this.accountIndexOld == -1) {
                var accDivIndex = document.querySelector("#divId" + index);
                accDivIndex.innerHTML = '<div class="row" id="totpdiv" ><div class="col col-75 otpValue" id="otpDiv' + index + '" ><span>' + this.names[index].otpValue + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + index + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                document.querySelector("#otpDiv" + index).addEventListener("click", function (event) {
                    var innndexval = localStorage.getItem('indexvalue');
                    var accDivIndex = document.querySelector("#divId" + innndexval);
                    if (accDivIndex) {
                        clearInterval(intervalId);
                        accDivIndex.innerHTML = "";
                        this.accountIndexOld = -1;
                        this.isTOTPopen = false;
                        localStorage.setItem("isTOTPopen", 'false');
                        localStorage.setItem("isgeneratedTOTP", 'true');
                    }
                }, false);
                this.isTOTPopen = true;
                //start vibration 
                var SettLocalStorage = JSON.parse(localStorage.getItem("Appsetting"));
                if (SettLocalStorage) {
                    if (SettLocalStorage.vibration == true) {
                        this.vibration.vibrate(1000);
                    }
                }
                else {
                    this.vibration.vibrate(1000);
                }
                //Play ringtone Sound 
                this.zone.run(function () {
                    var ringtoneUrl = localStorage.getItem('ringtoneUrl');
                    if (ringtoneUrl && ringtoneUrl != 'null') {
                        _this.ringtones.playRingtone(ringtoneUrl);
                    }
                    else {
                        //Play default Sound 
                        _this.nativeAudio.preloadComplex('default', 'assets/sound/default.mp3', 1, 1, 0);
                        _this.nativeAudio.preloadSimple('default', 'assets/sound/default.mp3');
                        console.log("Musique Play");
                        _this.nativeAudio.play('default', function () { return console.log('uniqueId1 is done playing'); });
                    }
                });
                localStorage.setItem("isTOTPopen", 'true');
                this.delayedAlert();
                if (this.isDigitClick == true) {
                    this.accountIndexOld = -1;
                }
                else {
                    this.accountIndexOld = index;
                }
            }
            else if (this.accountIndexOld == index) {
                var accDivIndex = document.querySelector("#divId" + this.accountIndexOld);
                accDivIndex.innerHTML = "";
                accDivIndex = document.querySelector("#divId" + index);
                accDivIndex.innerHTML = "";
                this.accountIndexOld = -1;
                this.isTOTPopen = false;
                localStorage.setItem("isTOTPopen", 'false');
            }
            else {
                var accDivIndex = document.querySelector("#divId" + this.accountIndexOld);
                accDivIndex.innerHTML = "";
                accDivIndex = document.querySelector("#divId" + index);
                accDivIndex.innerHTML = '<div class="row" id="totpdiv"><div class="col col-75 otpValue" id="otpDiv' + index + '"><span>' + this.names[index].otpValue + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + index + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                document.querySelector("#otpDiv" + index).addEventListener("click", function (event) {
                    var innndexval = localStorage.getItem('indexvalue');
                    var accDivIndex = document.querySelector("#divId" + innndexval);
                    if (accDivIndex) {
                        clearInterval(intervalId);
                        accDivIndex.innerHTML = "";
                        this.accountIndexOld = -1;
                        this.isTOTPopen = false;
                        localStorage.setItem("isTOTPopen", 'false');
                        localStorage.setItem("isgeneratedTOTP", 'true');
                    }
                }, false);
                this.isTOTPopen = true;
                //start vibration 
                var SettLocalStorage = JSON.parse(localStorage.getItem("Appsetting"));
                if (SettLocalStorage) {
                    if (SettLocalStorage.vibration == true) {
                        this.vibration.vibrate(1000);
                    }
                }
                else {
                    this.vibration.vibrate(1000);
                }
                //Play ringtone Sound 
                this.zone.run(function () {
                    var ringtoneUrl = localStorage.getItem('ringtoneUrl');
                    if (ringtoneUrl && ringtoneUrl != 'null') {
                        _this.ringtones.playRingtone(ringtoneUrl);
                    }
                    else {
                        //Play default Sound 
                        _this.nativeAudio.preloadComplex('default', 'assets/sound/default.mp3', 1, 1, 0);
                        _this.nativeAudio.preloadSimple('default', 'assets/sound/default.mp3');
                        console.log("Musique Play");
                        _this.nativeAudio.play('default', function () { return console.log('uniqueId1 is done playing'); });
                    }
                });
                localStorage.setItem("isTOTPopen", 'true');
                if (this.isDigitClick == true) {
                    this.accountIndexOld = -1;
                }
                else {
                    this.accountIndexOld = index;
                }
                this.delayedAlert();
            }
            var elmnt = document.getElementById("mainDiv");
            var blankSpacediv = document.getElementById("blankSpace");
            var scrollcon = document.getElementsByClassName("scroll-content");
            console.log(scrollcon);
            this.divHeight = scrollcon[0].clientHeight - (elmnt.clientHeight + 80);
            console.log(this.divHeight);
            blankSpacediv.style.height = (this.divHeight + "px");
        }
        catch (error) {
            alert("Invalid Secret Key, Please modify it!");
        }
    };
    HomePage.prototype.timer = function () {
        try {
            // var epoch = Math.round(new Date().getTime() / 1000.0);
            //  countDown = 30 - (epoch % 30); 
            countDown--;
            var accDivIndex = document.querySelector("#divId" + indexAccountChetu);
            var timerDivIndex = document.querySelector("#timerDiv" + indexAccountChetu);
            if (countDown == 0) {
                accDivIndex.innerHTML = '<div class="row" id="totpdiv" ><div class="col col-75 otpValue" id="otpDiv' + indexAccountChetu + '"><span>' + globalOTP + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + indexAccountChetu + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                document.querySelector("#otpDiv" + indexAccountChetu).addEventListener("click", function (event) {
                    var innndexval = localStorage.getItem('indexvalue');
                    var accDivIndex = document.querySelector("#divId" + innndexval);
                    if (accDivIndex) {
                        clearInterval(intervalId);
                        accDivIndex.innerHTML = "";
                        this.accountIndexOld = -1;
                        this.isTOTPopen = false;
                        localStorage.setItem("isTOTPopen", 'false');
                        localStorage.setItem("isgeneratedTOTP", 'true');
                    }
                }, false);
            }
            else {
                if (timerDivIndex == null) {
                    accDivIndex.innerHTML = '<div class="row" id="totpdiv" ><div class="col col-75 otpValue" id="otpDiv' + indexAccountChetu + '"><span>' + globalOTP + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + indexAccountChetu + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                    document.querySelector("#otpDiv" + indexAccountChetu).addEventListener("click", function (event) {
                        var innndexval = localStorage.getItem('indexvalue');
                        var accDivIndex = document.querySelector("#divId" + innndexval);
                        if (accDivIndex) {
                            clearInterval(intervalId);
                            accDivIndex.innerHTML = "";
                            this.accountIndexOld = -1;
                            this.isTOTPopen = false;
                            localStorage.setItem("isTOTPopen", 'false');
                            localStorage.setItem("isgeneratedTOTP", 'true');
                        }
                    }, false);
                }
                else {
                    timerDivIndex.innerHTML = '<div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div>';
                }
            }
            this.isTOTPopen = true;
            localStorage.setItem("isTOTPopen", 'true');
            if (countDown == 0) {
                var getStorageToDisplay = JSON.parse(localStorage.getItem("accounts"));
                if (getStorageToDisplay[indexAccountChetu].accountProtectionEnable == true) {
                    if (isFirstTotp == 2) {
                        var selectedAccDisplay = getStorageToDisplay.find(function (x) { return x.accountIndex == getAccountId; });
                        var selectedACCinStringDisplay = JSON.stringify(selectedAccDisplay);
                        var selectedACCinObjDisplay = JSON.parse(selectedACCinStringDisplay);
                        var epoch = Math.round(new Date().getTime() / 1000.0);
                        var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
                        var hmacObj = new jsSHA(time, "HEX");
                        var hmac = hmacObj.getHMAC(base32tohex(selectedACCinObjDisplay.secretKey), "HEX", "SHA-1", "HEX");
                        var offset = hex2dec(hmac.substring(hmac.length - 1));
                        var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
                        globalOTP = (otp).substr(otp.length - 6, 6);
                        countDown = 30;
                        isFirstTotp = 3;
                        var accDivIndex_1 = document.querySelector("#divId" + indexAccountChetu);
                        accDivIndex_1.innerHTML = '';
                        accDivIndex_1.innerHTML = '<div class="row" id="totpdiv" ><div class="col col-75 otpValue" id="otpDiv' + indexAccountChetu + '"><span>' + globalOTP + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + indexAccountChetu + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                        document.querySelector("#otpDiv" + indexAccountChetu).addEventListener("click", function (event) {
                            var innndexval = localStorage.getItem('indexvalue');
                            var accDivIndex = document.querySelector("#divId" + innndexval);
                            if (accDivIndex) {
                                clearInterval(intervalId);
                                accDivIndex.innerHTML = "";
                                this.accountIndexOld = -1;
                                this.isTOTPopen = false;
                                localStorage.setItem("isTOTPopen", 'false');
                                localStorage.setItem("isgeneratedTOTP", 'true');
                            }
                        }, false);
                    }
                    else {
                        accDivIndex.innerHTML = "";
                        this.isTOTPopen = false;
                        localStorage.setItem("isTOTPopen", 'false');
                        clearInterval(intervalId);
                        return;
                    }
                }
                else {
                    var selectedAccDisplay = getStorageToDisplay.find(function (x) { return x.accountIndex == getAccountId; });
                    var selectedACCinStringDisplay = JSON.stringify(selectedAccDisplay);
                    var selectedACCinObjDisplay = JSON.parse(selectedACCinStringDisplay);
                    var epoch = Math.round(new Date().getTime() / 1000.0);
                    var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
                    var hmacObj = new jsSHA(time, "HEX");
                    var hmac = hmacObj.getHMAC(base32tohex(selectedACCinObjDisplay.secretKey), "HEX", "SHA-1", "HEX");
                    var offset = hex2dec(hmac.substring(hmac.length - 1));
                    var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
                    globalOTP = (otp).substr(otp.length - 6, 6);
                    countDown = 30;
                    var accDivIndex_2 = document.querySelector("#divId" + indexAccountChetu);
                    accDivIndex_2.innerHTML = '';
                    accDivIndex_2.innerHTML = '<div class="row" id="totpdiv" ><div  class="col col-75 otpValue" id="otpDiv' + indexAccountChetu + '"><span>' + globalOTP + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + indexAccountChetu + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                    document.querySelector("#otpDiv" + indexAccountChetu).addEventListener("click", function (event) {
                        var innndexval = localStorage.getItem('indexvalue');
                        var accDivIndex = document.querySelector("#divId" + innndexval);
                        if (accDivIndex) {
                            clearInterval(intervalId);
                            accDivIndex.innerHTML = "";
                            this.accountIndexOld = -1;
                            this.isTOTPopen = false;
                            localStorage.setItem("isTOTPopen", 'false');
                            localStorage.setItem("isgeneratedTOTP", 'true');
                        }
                    }, false);
                }
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    HomePage.prototype.delayedAlert = function () {
        try {
            intervalId = setInterval(this.timer, 1000);
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    //Edit Account 
    HomePage.prototype.editAccount = function (accountIndex, index) {
        var _this = this;
        this.nativeAudio.stop('default');
        var accDivIndex = document.querySelector("#totpdiv");
        if (accDivIndex) {
            accDivIndex.innerHTML = '';
            clearInterval(intervalId);
        }
        localStorage.setItem('redirectTo', 'HomeEditFunc');
        var oldStorage = JSON.parse(localStorage.getItem("accounts"));
        var oldgetStorageSett = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldStorage[index].accountProtectionEnable == true) {
            if (oldgetStorageSett) {
                if (oldgetStorageSett.accountProtection) {
                    var protectionType = oldgetStorageSett.accountProtection;
                    if (protectionType == 2) {
                        this.navCtrl.push(GeneratePinPage, { accountIndex: accountIndex, 'pushFlagTitle': 'editAccount' });
                    }
                    else if (protectionType == 1) {
                        var date = new Date();
                        var newtimeStamp = void 0;
                        newtimeStamp = date.getTime();
                        var oldtimeStamp = void 0;
                        var minutesDifference = 1212;
                        oldtimeStamp = localStorage.getItem('oldtimeStamp');
                        if (oldtimeStamp) {
                            var difference = newtimeStamp - oldtimeStamp;
                            minutesDifference = Math.floor(difference / 1000 / 60);
                        }
                        if (minutesDifference <= 2) {
                            this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                        }
                        else {
                            this.androidFingerprintAuth.isAvailable()
                                .then(function (result) {
                                if (result.isAvailable) {
                                    _this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword', disableBackup: true })
                                        .then(function (result) {
                                        var date = new Date();
                                        var oldtimeStamp;
                                        oldtimeStamp = date.getTime();
                                        localStorage.setItem('oldtimeStamp', oldtimeStamp);
                                        if (result.withFingerprint) {
                                            console.log('Successfully encrypted credentials.');
                                            console.log('Encrypted credentials: ' + result.token);
                                            _this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                                            //this.navCtrl.push(SettingPage);  
                                        }
                                        else if (result.withBackup) {
                                            console.log('Successfully authenticated with backup password!');
                                        }
                                        else
                                            console.log('Didn\'t authenticate!');
                                    })
                                        .catch(function (error) {
                                        var alert = _this.alertCtrl.create({
                                            title: '',
                                            message: 'Would you like to use 4 digit pin',
                                            buttons: [
                                                {
                                                    text: 'No',
                                                    role: 'cancel',
                                                    handler: function () {
                                                        console.log('Cancel clicked');
                                                    }
                                                },
                                                {
                                                    text: 'Yes',
                                                    handler: function () {
                                                        console.log('yes clicked');
                                                        _this.navCtrl.push(GeneratePinPage, { accountIndex: accountIndex, 'pushFlagTitle': 'editAccount' });
                                                    }
                                                }
                                            ]
                                        });
                                        if (oldgetStorageSett.accountProtectionPin != 0) {
                                            alert.present();
                                        }
                                        if (error == "FINGERPRINT_CANCELLED") {
                                            console.log('Fingerprint authentication cancelled');
                                        }
                                        else {
                                            console.error(error);
                                        }
                                    });
                                }
                                else {
                                    var alert_4 = _this.alertCtrl.create({
                                        title: '',
                                        subTitle: "fingerprint not found" + result.isAvailable,
                                        buttons: ['OK']
                                    });
                                    alert_4.present();
                                    //  alert("fingerprint not found"+result.isAvailable);
                                }
                            }).catch(function (error) {
                                console.error(error);
                            });
                        }
                    }
                    else {
                        this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                        console.log("None");
                    }
                }
                else {
                    this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                    console.log("accountProtection empty");
                }
            }
            else {
                this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                console.log("old storage empty");
            }
        }
        else {
            this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
        }
    };
    //End Edit Account
    HomePage.prototype.editAccount111 = function (accountIndex) {
        var _this = this;
        var accDivIndex = document.querySelector("#totpdiv");
        if (accDivIndex) {
            accDivIndex.innerHTML = '';
            clearInterval(intervalId);
        }
        localStorage.setItem('redirectTo', 'HomeEditFunc');
        try {
            var oldStorage = JSON.parse(localStorage.getItem("accounts"));
            var selectedAcc = oldStorage.find(function (x) { return x.accountIndex == accountIndex; });
            selectedAcc = JSON.stringify(selectedAcc);
            selectedAcc = JSON.parse(selectedAcc);
            var oldgetStorageSett_1 = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorageSett_1 != null) {
                if (oldgetStorageSett_1.accountProtection == 2) {
                    this.navCtrl.push(GeneratePinPage, { accountIndex: accountIndex });
                }
                else if (oldgetStorageSett_1.accountProtection == 1) {
                    var date = new Date();
                    var newtimeStamp = void 0;
                    newtimeStamp = date.getTime();
                    var oldtimeStamp = void 0;
                    var minutesDifference = 1212;
                    oldtimeStamp = localStorage.getItem('oldtimeStamp');
                    if (oldtimeStamp) {
                        var difference = newtimeStamp - oldtimeStamp;
                        minutesDifference = Math.floor(difference / 1000 / 60);
                    }
                    if (minutesDifference <= 2) {
                        this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                    }
                    else {
                        this.androidFingerprintAuth.isAvailable()
                            .then(function (result) {
                            if (result.isAvailable) {
                                _this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword', disableBackup: true })
                                    .then(function (result) {
                                    var date = new Date();
                                    var oldtimeStamp;
                                    oldtimeStamp = date.getTime();
                                    localStorage.setItem('oldtimeStamp', oldtimeStamp);
                                    if (result.withFingerprint) {
                                        console.log('Successfully encrypted credentials.');
                                        console.log('Encrypted credentials: ' + result.token);
                                        _this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                                        //this.navCtrl.push(SettingPage);  
                                    }
                                    else if (result.withBackup) {
                                        console.log('Successfully authenticated with backup password!');
                                    }
                                    else
                                        console.log('Didn\'t authenticate!');
                                })
                                    .catch(function (error) {
                                    var alert = _this.alertCtrl.create({
                                        title: '',
                                        message: 'Would you like to use 4 digit pin',
                                        buttons: [
                                            {
                                                text: 'No',
                                                role: 'cancel',
                                                handler: function () {
                                                    console.log('Cancel clicked');
                                                }
                                            },
                                            {
                                                text: 'Yes',
                                                handler: function () {
                                                    console.log('yes clicked');
                                                    _this.navCtrl.push(GeneratePinPage, { accountIndex: accountIndex });
                                                }
                                            }
                                        ]
                                    });
                                    if (oldgetStorageSett_1.accountProtectionPin != 0) {
                                        alert.present();
                                    }
                                    if (error == "FINGERPRINT_CANCELLED") {
                                        console.log('Fingerprint authentication cancelled');
                                    }
                                    else {
                                        console.error(error);
                                    }
                                });
                            }
                            else {
                                var alert_5 = _this.alertCtrl.create({
                                    title: '',
                                    subTitle: "fingerprint not found" + result.isAvailable,
                                    buttons: ['OK']
                                });
                                alert_5.present();
                                //alert("fingerprint not found"+result.isAvailable);
                            }
                        }).catch(function (error) {
                            console.error(error);
                        });
                    }
                }
                else {
                    this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                }
            }
            else {
                this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
            }
        }
        catch (error) {
            console.log("Error occured");
        }
    };
    //modify order of accounts Click Button 
    HomePage.prototype.modifyOrder = function () {
        clearInterval(intervalId);
        this.nativeAudio.stop('default');
        this.hideMenu();
        this.navCtrl.push(ModifyOrderPage);
    };
    // method to redirect in userprofile page
    HomePage.prototype.userProfileClick = function () {
        this.nativeAudio.stop('default');
        var accDivIndex = document.querySelector("#totpdiv");
        if (accDivIndex) {
            clearInterval(intervalId);
            accDivIndex.innerHTML = '';
        }
        // this.navCtrl.push(ConfirmationScreenPage); 
        this.menuClick();
        //  this.app.getRootNav().setRoot(GeneratePinPage);
        this.navCtrl.push(UserProfilePage);
    };
    // reset the web password method
    HomePage.prototype.resetPassword = function () {
        localStorage.setItem('redirectTo', 'resetPass');
        this.navCtrl.push(GeneratePinPage);
    };
    // unlock user account method
    HomePage.prototype.unlockAccount = function () {
        //  alert("unlock user acc");
        localStorage.setItem('redirectTo', 'unlockAcc');
        this.navCtrl.push(GeneratePinPage);
    };
    /*// resend push notification method
    public resendNotification(){
       // alert("resend push request");
    
    }*/
    HomePage.prototype.editSettings = function () {
        var _this = this;
        var accDivIndex = document.querySelector("#totpdiv");
        if (accDivIndex) {
            accDivIndex.innerHTML = '';
        }
        clearInterval(intervalId);
        this.hideMenu();
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        localStorage.setItem('redirectTo', 'settingPage');
        if (oldgetStorage) {
            if (oldgetStorage.settingProtectionType != 0 && oldgetStorage.isSettingProtect == true) {
                var protectionType = oldgetStorage.settingProtectionType;
                if (protectionType == 2) {
                    console.log("4 digit pin");
                    this.navCtrl.push(GeneratePinPage, { 'pushFlagTitle': 'settingPage' });
                }
                else if (protectionType == 1) {
                    var date = new Date();
                    var newtimeStamp = void 0;
                    newtimeStamp = date.getTime();
                    var oldtimeStamp = void 0;
                    var minutesDifference = 1212;
                    oldtimeStamp = localStorage.getItem('oldtimeStamp');
                    if (oldtimeStamp) {
                        var difference = newtimeStamp - oldtimeStamp;
                        minutesDifference = Math.floor(difference / 1000 / 60);
                    }
                    if (minutesDifference <= 2) {
                        this.navCtrl.push(SettingPage);
                    }
                    else {
                        this.androidFingerprintAuth.isAvailable()
                            .then(function (result) {
                            if (result.isAvailable) {
                                _this.androidFingerprintAuth.encrypt({
                                    clientId: 'myAppName',
                                    username: 'myUsername',
                                    password: 'myPassword',
                                    disableBackup: true,
                                    maxAttempts: 3
                                })
                                    .then(function (result) {
                                    var date = new Date();
                                    var oldtimeStamp;
                                    oldtimeStamp = date.getTime();
                                    localStorage.setItem('oldtimeStamp', oldtimeStamp);
                                    console.log(result);
                                    debugger;
                                    if (result.withFingerprint) {
                                        console.log('Successfully encrypted credentials.');
                                        console.log('Encrypted credentials: ' + result.token);
                                        _this.navCtrl.push(SettingPage);
                                    }
                                    else if (result.withBackup) {
                                        console.log('Successfully authenticated with backup password!');
                                    }
                                    else
                                        console.log('Didn\'t authenticate!');
                                })
                                    .catch(function (error) {
                                    var alert = _this.alertCtrl.create({
                                        title: '',
                                        message: 'Would you like to use 4 digit pin',
                                        buttons: [
                                            {
                                                text: 'No',
                                                role: 'cancel',
                                                handler: function () {
                                                    console.log('Cancel clicked');
                                                }
                                            },
                                            {
                                                text: 'Yes',
                                                handler: function () {
                                                    console.log('yes clicked');
                                                    _this.navCtrl.push(GeneratePinPage, { 'pushFlagTitle': 'settingPage' });
                                                }
                                            }
                                        ]
                                    });
                                    if (oldgetStorage.accountProtectionPin != 0) {
                                        alert.present();
                                    }
                                    if (error == "FINGERPRINT_CANCELLED") {
                                        console.log('Fingerprint authentication cancelled');
                                    }
                                    else {
                                        console.log(error);
                                    }
                                });
                            }
                            else {
                                var alert_6 = _this.alertCtrl.create({
                                    title: '',
                                    subTitle: "fingerprint not found" + result.isAvailable,
                                    buttons: ['OK']
                                });
                                alert_6.present();
                                // alert("fingerprint not found"+result.isAvailable);
                            }
                        }).catch(function (error) {
                            alert('avallable resuole' + error);
                            console.log(error);
                        });
                    }
                }
                else {
                    this.navCtrl.push(SettingPage);
                    console.log("None");
                }
            }
            else {
                this.navCtrl.push(SettingPage);
                console.log("accountProtection empty");
            }
        }
        else {
            console.log("old storage empty");
            this.navCtrl.push(SettingPage);
        }
    };
    /* ConfirmUser(PageName) {
                      this.navCtrl.push(PasswordPolicyPage);
        }
    */
    HomePage.prototype.ConfirmUser = function (PageName) {
        var _this = this;
        debugger;
        this.nativeAudio.stop('default');
        this.hideMenu();
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (PageName == "ResetPassword") {
            localStorage.setItem('redirectTo', 'ResetPassword');
            localStorage.setItem('PushFlag', 'RsetPasswordPush');
        }
        else {
            localStorage.setItem('redirectTo', 'UnlockAccount');
            localStorage.setItem('PushFlag', 'UnlockAccountPush');
        }
        if (oldgetStorage) {
            if (oldgetStorage.accountProtection) {
                var protectionType = oldgetStorage.accountProtection;
                if (protectionType == 2) {
                    console.log("4 digit pin");
                    this.navCtrl.push(GeneratePinPage, { 'pushFlagTitle': PageName });
                }
                else if (protectionType == 1) {
                    var date = new Date();
                    var newtimeStamp = void 0;
                    newtimeStamp = date.getTime();
                    var oldtimeStamp = void 0;
                    var minutesDifference = 1212;
                    oldtimeStamp = localStorage.getItem('oldtimeStamp');
                    if (oldtimeStamp) {
                        var difference = newtimeStamp - oldtimeStamp;
                        minutesDifference = Math.floor(difference / 1000 / 60);
                    }
                    if (minutesDifference <= 2) {
                        this.CallResetAPI(PageName);
                    }
                    else {
                        this.androidFingerprintAuth.isAvailable()
                            .then(function (result) {
                            if (result.isAvailable) {
                                // it is available
                                // alert("fingerprint found"+result.isAvailable);       
                                _this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword', disableBackup: true })
                                    .then(function (result) {
                                    var date = new Date();
                                    var oldtimeStamp;
                                    oldtimeStamp = date.getTime();
                                    localStorage.setItem('oldtimeStamp', oldtimeStamp);
                                    if (result.withFingerprint) {
                                        _this.CallResetAPI(PageName);
                                        console.log('Successfully encrypted credentials.');
                                        console.log('Encrypted credentials: ' + result.token);
                                    }
                                    else if (result.withBackup) {
                                        console.log('Successfully authenticated with backup password!');
                                    }
                                    else
                                        console.log('Didn\'t authenticate!');
                                })
                                    .catch(function (error) {
                                    var alert = _this.alertCtrl.create({
                                        title: '',
                                        message: 'Would you like to use 4 digit pin',
                                        buttons: [
                                            {
                                                text: 'No',
                                                role: 'cancel',
                                                handler: function () {
                                                    console.log('Cancel clicked');
                                                }
                                            },
                                            {
                                                text: 'Yes',
                                                handler: function () {
                                                    console.log('yes clicked');
                                                    _this.navCtrl.push(GeneratePinPage, { 'pushFlagTitle': PageName });
                                                }
                                            }
                                        ]
                                    });
                                    if (oldgetStorage.accountProtectionPin != 0) {
                                        alert.present();
                                    }
                                    if (error == "FINGERPRINT_CANCELLED") {
                                        //alert("cancel called ");
                                        console.log('Fingerprint authentication cancelled');
                                    }
                                    else {
                                        console.error(error);
                                    }
                                });
                            }
                            else {
                                var alert_7 = _this.alertCtrl.create({
                                    title: '',
                                    subTitle: "fingerprint not found" + result.isAvailable,
                                    buttons: ['OK']
                                });
                                alert_7.present();
                                //  alert("fingerprint not found"+result.isAvailable);
                                // fingerprint auth isn't available
                            }
                        })
                            .catch(function (error) {
                            //alert("last cancel called ");
                            console.error(error);
                        });
                        console.log("Biomatrics");
                    }
                }
                else {
                    this.CallResetAPI(PageName);
                    //this.navCtrl.push(ConfirmUserPage ,{PageName:PageName});     
                    console.log("None");
                }
            }
            else {
                this.CallResetAPI(PageName);
                // this.navCtrl.push(ConfirmUserPage ,{PageName:PageName});     
                console.log("accountProtection empty");
            }
        }
        else {
            this.CallResetAPI(PageName);
            console.log("old storage empty");
            // this.navCtrl.push(ConfirmUserPage ,{PageName:PageName});     
        }
    };
    //Call Reset Password API 
    HomePage.prototype.CallResetAPI = function (PageName) {
        var _this = this;
        if (PageName == "ResetPassword") {
            //  this.navCtrl.push(PasswordPolicyPage);
            var loading_1 = this.loadingCtrl.create({
                content: 'Please wait...',
                duration: 5000
            });
            this.restProvider.resetPassword().subscribe(function (result) {
                var resultObj = JSON.stringify(result);
                var resultData = JSON.parse(resultObj);
                // alert(resultObj);
                if (resultData.Result.SuccessCode == 200) {
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    loading_1.dismiss();
                    console.log(resultData.Result.sessionId);
                    localStorage.setItem('resetPassKey', result.Result.resetPasswordKey);
                    var passwordPolicy = JSON.stringify(resultData.Result.passwordPolicy);
                    console.log('passwordPolicy' + passwordPolicy);
                    localStorage.setItem('passwordPolicy', passwordPolicy);
                }
                else if (resultData.Result.SuccessCode == 100) {
                    loading_1.dismiss();
                    var alert_8 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['OK']
                    });
                    alert_8.present();
                    //  alert("Registration key not found on the database.");
                }
                else if (resultData.Result.SuccessCode == 400) {
                    loading_1.dismiss();
                    var alert_9 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Request Failed.',
                        buttons: ['OK']
                    });
                    alert_9.present();
                    //alert("Request Failed.");
                }
                else if (resultData.Result.SuccessCode == 700) {
                    loading_1.dismiss();
                    var alert_10 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'User ID not found.',
                        buttons: ['OK']
                    });
                    alert_10.present();
                    // alert("User ID not found.");
                }
                else {
                    loading_1.dismiss();
                    var alert_11 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Unknown error occured.',
                        buttons: ['OK']
                    });
                    alert_11.present();
                    // alert("Unknown error occured.");
                }
            }, function (error) {
                console.log("error api" + JSON.stringify(error));
            });
            loading_1.present();
        }
        else {
            var loading_2 = this.loadingCtrl.create({
                content: 'Please wait...',
                duration: 5000
            });
            this.restProvider.unlockAccount().subscribe(function (result) {
                var resultObj = JSON.stringify(result);
                var resultData = JSON.parse(resultObj);
                if (resultData.Result.SuccessCode == 200) {
                    localStorage.setItem('sessionId', resultData.Result.sessionId);
                    loading_2.dismiss();
                    console.log(resultData.Result.sessionId);
                }
                else if (resultData.Result.SuccessCode == 100) {
                    loading_2.dismiss();
                    var alert_12 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Registration key not found on the database.',
                        buttons: ['OK']
                    });
                    alert_12.present();
                    // alert("Registration key not found on the database.");
                }
                else if (resultData.Result.SuccessCode == 400) {
                    loading_2.dismiss();
                    var alert_13 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Request Failed.',
                        buttons: ['OK']
                    });
                    alert_13.present();
                    // alert("Request Failed.");
                }
                else if (resultData.Result.SuccessCode == 700) {
                    loading_2.dismiss();
                    var alert_14 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'User ID not found.',
                        buttons: ['OK']
                    });
                    alert_14.present();
                    // alert("User ID not found.");
                }
                else {
                    loading_2.dismiss();
                    var alert_15 = _this.alertCtrl.create({
                        title: '',
                        subTitle: 'Unknown error occured.',
                        buttons: ['OK']
                    });
                    alert_15.present();
                    // alert("Unknown error occured.");
                }
            }, function (error) {
                console.log("error api" + JSON.stringify(error));
            });
            loading_2.present();
        }
    };
    //Call API for Reset Password
    HomePage.prototype.ResendNotification = function () {
        var _this = this;
        var sessionid = localStorage.getItem('sessionId');
        this.restProvider.resendNotification(sessionid).subscribe(function (result) {
            var resendresultObj = JSON.stringify(result);
            var resendResultData = JSON.parse(resendresultObj);
            // alert(resendresultObj);
            var sucessCode = resendResultData.Result.SuccessCode;
            if (sucessCode == 600) {
                _this.toast.show("Success", '500', 'bottom').subscribe(function (toast) {
                    console.log(toast);
                });
            }
            else {
                var alert_16 = _this.alertCtrl.create({
                    title: '',
                    subTitle: 'Connectivity error',
                    buttons: ['OK']
                });
                alert_16.present();
                //  alert("Connectivity error.");
            }
        }, function (error) {
            console.log("error api" + JSON.stringify(error));
        });
    };
    // check fingerprint is recently validated 
    HomePage.prototype.fingerprintRecentValidation = function () {
        var date = new Date();
        // this.timeStamp = date.getTime();  
    };
    HomePage.prototype.blankSpaceClick = function () {
        /*
                var elmnt = document.getElementById("mainDiv");
                var blankSpacediv = document.getElementById("blankSpace");
                this.divHeight = screen.height - (elmnt.clientHeight-56);
                blankSpacediv.style.height = ((screen.height - elmnt.clientHeight) + "px") ;*/
        debugger;
        var innndexval = localStorage.getItem('indexvalue');
        var accDivIndex = document.querySelector("#divId" + innndexval);
        if (accDivIndex) {
            clearInterval(intervalId);
            accDivIndex.innerHTML = "";
            this.accountIndexOld = -1;
            this.isTOTPopen = false;
            localStorage.setItem("isTOTPopen", 'false');
        }
    };
    HomePage.prototype.blankspaceClick = function () {
    };
    HomePage.prototype.modifyPressed = function () {
        console.log('modifyPressed');
    };
    /*modifyActive(){
       // this.modify = this.modify+100;
        console.log('modifyActive');
         this.modify = true;
         this.isDisplay ='none';
    }
    */
    /*
    modifyReleased(){
         
        console.log('modifyReleased'+this.modify);
      //  this.reorderItems(event);
    }
    */
    HomePage.prototype.LongPressed = function () {
        this.modify = true;
        this.isDisplay = 'none';
    };
    // set the position of the items
    HomePage.prototype.reorderItems = function ($event) {
        this.names = reorderArray(this.names, $event);
        localStorage.setItem("accounts", JSON.stringify(this.names));
        this.enableGoogleDrive();
        this.modify = false;
        this.isDisplay = 'block';
    };
    HomePage.prototype.enableGoogleDrive = function () {
        var _this = this;
        var enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            if (enableTxt == 'Enabled') {
                localStorage.setItem('isEnable', 'Enabled');
                var getAccountData = JSON.parse(localStorage.getItem("accounts"));
                var totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                if (totpProtection) {
                    totpProtection.deviceId = this.deviceId;
                }
                localStorage.setItem("Appsetting", JSON.stringify(totpProtection));
                localStorage.setItem("accounts", JSON.stringify(getAccountData));
                var accountsString = localStorage.getItem("accounts");
                var settingsString = localStorage.getItem("Appsetting");
                var backupString = accountsString.concat('splitSet' + settingsString);
                console.log('accounts ' + accountsString);
                console.log('settings' + settingsString);
                console.log('backkup' + backupString);
                var encryptAccData = window.btoa(backupString);
                if (encryptAccData) {
                    var cameraOptions = { data: encryptAccData };
                    this.Camera.getPicture(cameraOptions)
                        .then(function (Response) {
                        var lastbackupdateTime = _this.formatDateTime();
                        localStorage.setItem('lastBackupTime', lastbackupdateTime);
                    }, function (err) {
                        console.log(err);
                    });
                }
            }
            else {
                localStorage.setItem('isEnable', 'Disabled');
            }
        }
    };
    //end
    HomePage.prototype.formatDateTime = function () {
        var minutes;
        var date = new Date();
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var hours = date.getHours();
        minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
        return strTime;
    };
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html',
            animations: [
                trigger("showHello", [
                    state("true", style({
                        "opacity": 1
                    })),
                    state("false", style({
                        "opacity": 0
                    })),
                    transition("1 => 0", animate("350ms")),
                    transition("0 => 1", animate("350ms"))
                ])
            ]
        }),
        __metadata("design:paramtypes", [MenuController, NavController, Platform,
            App,
            NavParams, A2cApiProvider,
            BarcodeScanner, AndroidFingerprintAuth,
            Vibration,
            Deeplinks, Push,
            LoadingController,
            Toast,
            NativeRingtones,
            NgZone,
            AlertController,
            NativeAudio,
            AppVersion,
            Camera])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
function dec2hex(value) {
    return (value < 15.5 ? "0" : "") + Math.round(value).toString(16);
}
function hex2dec(value) {
    return parseInt(value, 16);
}
function leftpad(value, length, pad) {
    if (length + 1 >= value.length) {
        value = Array(length + 1 - value.length).join(pad) + value;
    }
    return value;
}
function base32tohex(base32) {
    var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = "";
    var hex = "";
    for (var i = 0; i < base32.length; i++) {
        var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, '0');
    }
    for (var i = 0; i + 4 <= bits.length; i += 4) {
        var chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16);
    }
    return hex;
}
var countDown = 30;
var intervalId;
var indexAccountChetu = 0;
var globalOTP;
var index;
var getAccountId;
var isFirstTotp;
//# sourceMappingURL=home.js.map