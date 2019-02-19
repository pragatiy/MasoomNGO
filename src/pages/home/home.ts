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
import { GeneratePasswordPage } from '../generate-password/generate-password';
import { ShowTotpPage } from '../show-totp/show-totp';
import { PasswordPolicyPage } from '../password-policy/password-policy';
import { UnlockPage } from '../unlock/unlock';

import { Vibration } from '@ionic-native/vibration';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { Toast } from '@ionic-native/toast';
import * as jsSHA from 'jssha';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { NativeAudio } from '@ionic-native/native-audio';
import { AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { commonString } from '../.././app/commonString';
import { LongPressModule } from 'ionic-long-press';
import { reorderArray } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
@Component({
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
})

export class HomePage {
    getBarcodeResult: any;
    index: any;
    names: any;
    OTPvalue: string;
    buttonClicked: boolean = false;
    accountIndex: any = 1;
    accountIndexOld: number = -1;
    current: number = 100;
    max: number = 100;
    radius: number;
    stroke: number;
    semicircle: boolean;
    rounded: boolean;
    clockwise: boolean;
    duration: number;
    animation: string;
    animationDelay: number;
    accountProtectionEnable: number;
    isTOTPopen: Boolean;
    accountArr: any = [];
    isUserRegister: Boolean = false;
    isVibrate: boolean;
    divHeight: any;
    isDigitClick: any;
    alertMessage: string;
    resaccountid: any;
    issuer_accountName: any;
    accountName: string = "Account Details";
    CryptoJS: any;
    password: any;
    modify: Boolean = false;
    isDisplay: any = 'block';
    deviceId: any;
    constructor(menu: MenuController, public navCtrl: NavController, public platform: Platform,
        public app: App,
        public navParams: NavParams, public restProvider: A2cApiProvider,
        private barcodeScanner: BarcodeScanner, public androidFingerprintAuth: AndroidFingerprintAuth,
        private vibration: Vibration,
        private deeplinks: Deeplinks, private push: Push,
        private loadingCtrl: LoadingController,
        private toast: Toast,
        private ringtones: NativeRingtones,
        private zone: NgZone,
        private alertCtrl: AlertController,
        private nativeAudio: NativeAudio,
        private appVersion: AppVersion,
        private Camera: Camera

    ) {
        platform.ready().then(() => {
            this.deviceId = localStorage.getItem('deviceId');
            platform.registerBackButtonAction(() => {
                console.log('home page ');
            });

            this.Deeplinking();

            let isToken = localStorage.getItem("token");
            if (isToken) {
                this.PushNotification();
                console.log("local storage token" + isToken);
            }
            else {
                this.PushNotification();
                console.log("Push Notification function");
            }
            this.androidFingerprintAuth.isAvailable()
                .then((result) => {
                    if (result.isAvailable) {
                        localStorage.setItem('isFingerPrintEnable', 'yes');
                    } else {
                        localStorage.setItem('isFingerPrintEnable', 'no');
                    }
                })
                .catch(error => {                
                    console.error(error)
                });



        })
        menu.enable(true);
        let getStorage = JSON.parse(localStorage.getItem("accounts"));
        this.names = getStorage;
        let accountName = localStorage.getItem("accountsName");
        this.accountName = accountName;
    }




    ionViewDidLoad() {
        this.androidFingerprintAuth.isAvailable()
            .then((result) => {
                if (result.isAvailable) {
                    localStorage.setItem('isFingerPrintEnable', 'yes');
                } else {
                    localStorage.setItem('isFingerPrintEnable', 'no');
                }
            })
            .catch(error => {            
                console.error(error)
            });
        this.platform.registerBackButtonAction(() => {
            console.log('home page ');
        });

    }

    //DeepLinkig
    Deeplinking() {
     try{
        this.deeplinks.route({
            '/a2c/:company/:mobile/:platform/:licenceid': LicencePage,
        }).subscribe((match) => {
            debugger;
            let companyName = match.$args.company;
            let NewlicenceId = match.$args.licenceid;
            console.log('Successfully matched route', match);
            let apiUrlA2c = match.$link.url;          
            let newstr = apiUrlA2c.split(companyName + '/');
            let isregistered = localStorage.getItem("isRegister");
            localStorage.setItem('apiUrlA2c', newstr[0]);
            console.log('default URL', localStorage.getItem('apiUrlA2c'));
            if (isregistered == 'Yes') {
                let OldlicenceId = localStorage.getItem("licenseId");
                if (OldlicenceId != NewlicenceId) {
                    this.navCtrl.push(LicencePage, { licenceId: NewlicenceId, companyName: companyName });
                 } else {
                    let registerData = localStorage.getItem("UserRegisterInfo");
                    if (registerData) {
                    } else {
                        this.navCtrl.push(LicencePage, { licenceId: NewlicenceId, companyName: companyName });
                    }
                }
            }
            else {
                this.navCtrl.push(LicencePage, { licenceId: NewlicenceId, companyName: companyName });
            }
        }, (nomatch) => {
            console.error('Got a deeplink that didn\'t match', nomatch.$link.url);
        });
      } catch (error) { console.log("Error occured"); }
    }
    //end


    //Push Notification
    PushNotification() {
        try{
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldgetStorage) {
            if (oldgetStorage.vibration == true) {
                this.isVibrate = true;
            } else {
                this.isVibrate = false;
            }
        } else {
            this.isVibrate = true;
        }
        this.push.hasPermission()
            .then((res: any) => {
                if (res.isEnabled) {
                    console.log('We have permission to send push notifications');
                } else {
                    console.log('We do not have permission to send push notifications');
                }
            });

        // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
        this.push.createChannel({
            id: "a2cApp",
            description: "My first test channel",
            // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            importance: 3
        }).then(() => console.log('Channel created'));
        // Delete a channel (Android O and above)
        this.push.deleteChannel('a2cApp').then(() => console.log('Channel deleted'));
        // Return a list of currently configured channels
        this.push.listChannels().then((channels) => console.log('List of channels', channels))
        // to initialize push notifications
        let options: PushOptions = {
            android: {
                senderID: '59523452146',
                sound: false,
                vibrate: this.isVibrate,
                forceShow: '1',
                clearBadge:true,

            },
            ios: {
                alert: 'true',
                badge: false,
                sound: 'true',
                clearBadge:true,
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };

        let pushObject: PushObject = this.push.init(options);
        pushObject.on('notification').subscribe((notification: any) => {              
            console.log(notification);
            this.zone.run(() => {
                if (notification.additionalData.foreground == true) {
                    //Play ringtone Sound 

                    let ringtoneUrl = localStorage.getItem('ringtoneUrl');
                    if (ringtoneUrl && ringtoneUrl != 'null') {
                        this.ringtones.playRingtone(ringtoneUrl);
                    } else {
                        //Play default Sound 
                        this.nativeAudio.preloadComplex('default', 'assets/sound/default.mp3', 1, 1, 0);
                        this.nativeAudio.preloadSimple('default', 'assets/sound/default.mp3');
                        console.log("Musique Play");
                        this.nativeAudio.play('default', () => console.log('uniqueId1 is done playing'));
                    }
                    if (this.isVibrate == true) {
                        this.vibration.vibrate(1000);
                    }
                }
            });
            let PushFlag = localStorage.getItem("PushFlag");
            console.log('Received a notification', notification);
            console.log('Received a notification with ', notification.additionalData.tag);
            debugger;
            if (notification.additionalData.tag == "confirmUserID") {
                if (PushFlag == "RsetPasswordPush") {               
                    this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: "RsetPasswordPush" });
                }
                else if (PushFlag == "UnlockAccountPush") {
                 //change the unlock page
                    this.navCtrl.push(UnlockPage, { notification: notification, PushFlag: "UnlockAccountPush" });
                }
                else {
                    let alert = this.alertCtrl.create({
                        title: '',
                        subTitle: 'Other notification',
                        buttons: ['OK']
                    });
                    alert.present();
                }
            }
            else if (notification.additionalData.tag == "resetPasswordPush") {
                }
            else if (notification.additionalData.tag == "sendAppPush") {
                let pageName = "LoginAccountYes";
                this.CheckSecurity(notification, pageName);
            }
            else {

            }

        });

        pushObject.on('registration').subscribe((registration: any) =>
            localStorage.setItem('token', registration.registrationId)
        );

        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
 
       } catch (error) { console.log("Error occured"); }
    }

    //End 



    //Check Security
  CheckSecurity(notification, PushFlag) {
    try{
        debugger;
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        localStorage.setItem('redirectTo', 'ConfirmationScreen');
        if (oldgetStorage) {
            if (oldgetStorage.accountProtection) {
                let protectionType = oldgetStorage.accountProtection;
                if (protectionType == 2) {
                    console.log("4 digit pin");
                    this.app.getRootNav().setRoot(GeneratePinPage, { notification: notification, PushFlag: PushFlag });
                } else if (protectionType == 1) {
                    let date = new Date();
                    let newtimeStamp: any;
                    newtimeStamp = date.getTime();
                    let oldtimeStamp: any;
                    let minutesDifference: any = 1212;
                    oldtimeStamp = localStorage.getItem('oldtimeStamp');
                    if (oldtimeStamp) {
                        let difference = newtimeStamp - oldtimeStamp;
                        minutesDifference = Math.floor(difference / 1000 / 60);
                    }
                    if (minutesDifference <= 2) {
                        this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
                    } else {
                        this.androidFingerprintAuth.isAvailable()
                            .then((result) => {
                                if (result.isAvailable) {
                                    // it is available
                                    this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword', disableBackup: true })
                                        .then(result => {
                                            console.log(result);
                                            let date = new Date();
                                            let oldtimeStamp: any;
                                            oldtimeStamp = date.getTime();
                                            localStorage.setItem('oldtimeStamp', oldtimeStamp);

                                            if (result.withFingerprint) {
                                                console.log('Successfully encrypted credentials.');
                                                console.log('Encrypted credentials: ' + result.token);

                                                this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
                                            } else if (result.withBackup) {
                                                console.log('Successfully authenticated with backup password!');
                                            } else console.log('Didn\'t authenticate!');
                                        })
                                        .catch(error => {

                                            let alert = this.alertCtrl.create({
                                                title: '',
                                                message: commonString.homePage.alertMessage,
                                                buttons: [
                                                    {
                                                        text: 'No',
                                                        role: 'cancel',
                                                        handler: () => {
                                                            console.log('Cancel clicked');
                                                        }
                                                    },
                                                    {
                                                        text: 'Yes',
                                                        handler: () => {
                                                            console.log('yes clicked');
                                                            this.app.getRootNav().setRoot(GeneratePinPage, { notification: notification, PushFlag: PushFlag });
                                                        }
                                                    }]
                                            })
                                            if (oldgetStorage.accountProtectionPin != 0) {
                                                alert.present();
                                            }

                                            if (error ==commonString.homePage.fingerCancelled) {
                                                //alert("cancel called ");
                                                console.log('Fingerprint authentication cancelled');
                                            }
                                            else {
                                                console.error(error)
                                            }
                                        });

                                } else {

                                    let alert = this.alertCtrl.create({
                                        title: '',
                                        subTitle: commonString.homePage.fingerNotFound + result.isAvailable,
                                        buttons: ['OK']
                                    });
                                    alert.present();                                    
                                }
                            })
                            .catch(error => {
                                //alert("last cancel called ");
                                console.error(error)
                            }
                            );
                        console.log("Biomatrics");
                    }
                }
                else {
                    this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
                    console.log("None");
                }
            } else {
                this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
                console.log("accountProtection empty");
            }
        } else {
            console.log("old storage empty");
            this.navCtrl.push(ConfirmationScreenPage, { notification: notification, PushFlag: PushFlag });
        }
          } catch (error) { console.log("Error occured"); }
    }


    fingerPrintEnable(accountIndex, index) {
        try{
        debugger;
        localStorage.setItem('accountIndex', accountIndex);
        localStorage.setItem('index', index);
        localStorage.setItem('redirectTo', 'HomePageTOTP');
        let accIndex = accountIndex;
        let newIndex = index;
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        let date = new Date();
        let newtimeStamp: any;
        newtimeStamp = date.getTime();
        let oldtimeStamp: any;
        let minutesDifference: any = 1212;
        oldtimeStamp = localStorage.getItem('oldtimeStamp');
        if (oldtimeStamp) {
            let difference = newtimeStamp - oldtimeStamp;
            minutesDifference = Math.floor(difference / 1000 / 60);
        }

        if (minutesDifference <= 2) {
            this.generateTOTP(accIndex, newIndex);
        } else {
            this.androidFingerprintAuth.isAvailable()
                .then((result) => {
                    if (result.isAvailable) {                             
                        this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword', disableBackup: true })
                            .then(result => {
                                let date = new Date();
                                let oldtimeStamp: any;
                                oldtimeStamp = date.getTime();
                                localStorage.setItem('oldtimeStamp', oldtimeStamp);


                                if (result.withFingerprint) {
                                    console.log('Successfully encrypted credentials.');
                                    this.generateTOTP(accIndex, newIndex);
                                    console.log('Encrypted credentials: ' + result.token);
                                } else if (result.withBackup) {
                                    console.log('Successfully authenticated with backup password!');
                                } else console.log('Didn\'t authenticate!');
                            })
                            .catch(error => {

                                let alert = this.alertCtrl.create({
                                    title: '',
                                    message: commonString.homePage.alertMessage,
                                    buttons: [
                                        {
                                            text: 'No',
                                            role: 'cancel',
                                            handler: () => {
                                                console.log('Cancel clicked');

                                            }
                                        },
                                        {
                                            text: 'Yes',
                                            handler: () => {
                                                localStorage.setItem('redirectTo', 'HomePageTOTP');
                                                console.log('yes clicked');
                                                this.navCtrl.push(GeneratePinPage);
                                            }
                                        }]
                                })
                                if (oldgetStorage.accountProtectionPin != 0) {
                                    alert.present();
                                }

                                if (error == commonString.homePage.fingerCancelled) {
                                    //alert("cancel called ");
                                    console.log('Fingerprint authentication cancelled');
                                }
                                else {
                                    console.error(error)
                                }
                            });

                    } else {
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.homePage.fingerNotFound + result.isAvailable,
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                })
                .catch(error => {
                    console.error(error)
                });
        }
  
    } catch (error) { console.log("Error occured"); }
    }

    backbtnFuc() {
        console.log("backbtn called in device");
        this.navCtrl.pop({});
    }


    ionViewWillEnter() {
        this.platform.registerBackButtonAction(() => {
            console.log('home page ');
        });    
        let isFirstAppLaunch = localStorage.getItem('isFirstAppLaunch');
        if (isFirstAppLaunch == null || isFirstAppLaunch == undefined) {
            this.navCtrl.push(WelcomePage);         
        }     
        this.PushNotification();
        let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }

        this.accountIndexOld = -1;
        this.isTOTPopen = JSON.parse(localStorage.getItem("isTOTPopen"));
        let getStorage = JSON.parse(localStorage.getItem("accounts"));
        this.names = getStorage;


        console.log(JSON.stringify(this.names));

        let protectedAccIndex = localStorage.getItem('accountIndex');
        this.accountIndex = protectedAccIndex;
        let protectedIndex = localStorage.getItem('index');
        this.index = protectedIndex;
        let callTotp = localStorage.getItem('redirectTo');

        if (callTotp == 'TOTPprotection') {
            localStorage.setItem('redirectTo', '');
            let getStorage = JSON.parse(localStorage.getItem("accounts"));

            this.names = getStorage;
            this.generateTOTP(this.accountIndex, this.index)
        }
        if (this.accountName != localStorage.getItem("accountsName")) {
            this.accountName = localStorage.getItem("accountsName");
        }



    }

    hideMenu() {
        this.zone.run(() => {
            let accDivIndex = document.querySelector("#totpdiv");
            if (accDivIndex) {
                clearInterval(intervalId);
                accDivIndex.innerHTML = '';
            }
            this.buttonClicked = !this.buttonClicked;
        });
    }

    hideOpenTotp() {

        let accDivIndex = document.querySelector("#totpdiv");
        if (accDivIndex) {
            clearInterval(intervalId);
            accDivIndex.innerHTML = '';
        }

    }

    // Hide the Menu when clicks anywhere
    menuClick() {
        this.zone.run(() => {
            try {
                //this.hideMenu();
                this.buttonClicked = false;
                this.modify = false;
                this.isDisplay = 'block';
            } catch (error) { console.log("Error occured"); }
        });
    }




    //   redirect to add account page 
    manualAddAccount() {

        try {
            this.navCtrl.push(AddAccountPage, {
                barcodeResult: this.getBarcodeResult,
                issuer_accountName: this.issuer_accountName,
                resaccountid: this.resaccountid
            });

            this.getBarcodeResult = undefined;
            this.issuer_accountName = undefined;
            this.resaccountid = undefined;


        } catch (error) { console.log('Error occured'); }
    }
    //  end 

    public checkProtection(accountIndex: any, index) {
        debugger;
        try{
        let newTOTPSet = localStorage.getItem("isgeneratedTOTP");
        if (newTOTPSet == 'true') {
            this.accountIndexOld = -1;
            localStorage.setItem("isgeneratedTOTP", 'false');
        }

        localStorage.setItem('indexvalue', index);
        this.accountIndex = accountIndex;
        index = index;
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        localStorage.setItem('redirectTo', 'HomePageTOTP');
        let getStorage = JSON.parse(localStorage.getItem("accounts"));
        if (getStorage[index].accountProtectionEnable == true) {
            if (oldgetStorage) {
                if (oldgetStorage.accountProtection) {
                    let protectionType = oldgetStorage.accountProtection;
                    if (protectionType == 2) {
                        isFirstTotp = 1;
                        console.log("4 digit pin");
                        localStorage.setItem('accountIndex', accountIndex);
                        localStorage.setItem('index', index);
                        if (this.isTOTPopen == false || this.accountIndexOld != index) {

                            let selectedAcc = this.names.find(x => x.accountIndex == this.accountIndex);
                            let selectedACCinString = JSON.stringify(selectedAcc);
                            let selectedACCinObj = JSON.parse(selectedACCinString);
                            this.navCtrl.push(GeneratePinPage, { 'selectedACCinObj': selectedACCinObj, 'index': index });
                        }
                        else {
                            this.generateTOTP(this.accountIndex, index);
                        }

                    } else if (protectionType == 1) {
                        isFirstTotp = 1;
                        console.log("Biomatrics");

                        if (this.isTOTPopen == false || this.accountIndexOld != index) {
                            this.fingerPrintEnable(this.accountIndex, index);
                        }
                        else {
                            this.generateTOTP(this.accountIndex, index);
                        }
                    } else {
                        this.generateTOTP(this.accountIndex, index);
                        console.log("None");
                    }

                } else {
                    this.generateTOTP(this.accountIndex, index);
                    console.log("accountProtection empty");
                }
            } else {
                this.generateTOTP(this.accountIndex, index);
                console.log("old storage empty");
            }
        } else {
            this.generateTOTP(this.accountIndex, index);
            console.log("old storage empty");
        }

      } catch (error) { console.log("Error occured"); }
    }

    //generate TOTP by secret key
    public generateTOTP(accountId: any, index) {
        try {
            clearInterval(intervalId);
            let selectedAcc = this.names.find(x => x.accountIndex == accountId);
            let selectedACCinString = JSON.stringify(selectedAcc);
            let selectedACCinObj = JSON.parse(selectedACCinString);
            this.navCtrl.push(ShowTotpPage, { 'selectedACCinObj': selectedACCinObj, 'index': index });
            this.index = index;
            getAccountId = accountId;
            index = this.index;
            indexAccountChetu = this.index;
        } catch (error) { console.log("Error occured"); }

    }



    //  get barcode result
    barcodeClick() {
        localStorage.removeItem("accName");
        localStorage.removeItem("accId");
        localStorage.removeItem("barcodeResult");
        localStorage.removeItem("imageSrc");
        let accDivIndex = document.querySelector('#totpdiv');
        if (accDivIndex) {
            clearInterval(intervalId);
            accDivIndex.innerHTML = '';
        }
        try {
            this.barcodeScanner.scan().then((barcodeData) => {
                console.log(barcodeData.text);
                if (barcodeData.text == 'BACK_PRESSED') {
                    localStorage.setItem('hideScanBtn', 'no');
                    this.navCtrl.popToRoot();
                } else if (barcodeData.text == 'BUTTON_PRESSED') {
                    this.navCtrl.push(IconlistPage);
                    localStorage.setItem('hideScanBtn', 'yes');
                } else {
                    localStorage.setItem('hideScanBtn', 'no');
                    let newSecretKey;
                    if (barcodeData.text.includes('secret') == true) {
                        // 
                        if ((barcodeData.text.includes('secret')) == true && (barcodeData.text.includes('issuer') == true)) {
                            let resIssuer: any;
                            resIssuer = decodeURIComponent(barcodeData.text);
                            resIssuer = resIssuer.split('issuer');
                            console.log('reissues' + resIssuer);
                            debugger;
                            this.resaccountid = resIssuer[0].split(':');
                            if (this.resaccountid.length == 2) {
                                let fbId: any;
                                let fbIdnew: any;
                                fbId = this.resaccountid[1].split('/');
                                if (fbId.length == 4) {
                                    fbIdnew = fbId[3].split('?');
                                    this.resaccountid = fbIdnew[0];
                                }
                            } else {
                                this.resaccountid = this.resaccountid[2].split('?');
                                this.resaccountid = this.resaccountid[0];
                            }

                            resIssuer = resIssuer[1].split('=');
                            let issuer = resIssuer[1];
                            this.issuer_accountName = issuer;
                        }
                        // 
                        let res = barcodeData.text.split('secret');
                        res = res[1].split('=');
                        newSecretKey = res[1];
                        if (res.length > 2) {
                            newSecretKey = newSecretKey.substring(0, newSecretKey.indexOf('&'));
                        }
                        this.getBarcodeResult = newSecretKey;
                        this.manualAddAccount();
                    } else if (barcodeData.text.includes('/') == true) {
                        let res = barcodeData.text.split('/');
                        let barcodeDataresult = res[res.length - 1];
                        this.getBarcodeResult = barcodeDataresult;
                        this.manualAddAccount();
                    } else {
                        this.getBarcodeResult = barcodeData.text;
                        this.manualAddAccount();
                    }
                }
            }, (err) => {
                this.navCtrl.push(IconlistPage);
                localStorage.setItem('hideScanBtn', 'yes');
                console.log('Error occured : ' + err);
            });
        } catch (error) { console.log('Error occured'); }
    }

    // end




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
        let base32chars = commonString.homePage.base32CharStrg;
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
        debugger;

        var epoch = Math.round(new Date().getTime() / 1000.0);
        countDown = 30 - (epoch % 30);

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
            globalOTP = otp;

            if (this.accountIndexOld == -1) {
                let accDivIndex = document.querySelector("#divId" + index);
                accDivIndex.innerHTML = '<div class="row" id="totpdiv" ><div class="col col-75 otpValue" id="otpDiv' + index + '" ><span>' + this.names[index].otpValue + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + index + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';

                document.querySelector("#otpDiv" + index).addEventListener("click", function (event) {
                    let innndexval = localStorage.getItem('indexvalue');
                    let accDivIndex = document.querySelector("#divId" + innndexval);
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
                let SettLocalStorage = JSON.parse(localStorage.getItem("Appsetting"));
                if (SettLocalStorage) {
                    if (SettLocalStorage.vibration == true) {
                        this.vibration.vibrate(1000);
                    }
                }
                else {
                    this.vibration.vibrate(1000);
                }

                //Play ringtone Sound 
                this.zone.run(() => {
                    let ringtoneUrl = localStorage.getItem('ringtoneUrl');
                    if (ringtoneUrl && ringtoneUrl != 'null') {

                        this.ringtones.playRingtone(ringtoneUrl);
                    } else {
                        //Play default Sound 
                        this.nativeAudio.preloadComplex('default', 'assets/sound/default.mp3', 1, 1, 0);
                        this.nativeAudio.preloadSimple('default', 'assets/sound/default.mp3');
                        console.log("Musique Play");
                        this.nativeAudio.play('default', () => console.log('uniqueId1 is done playing'));
                    }
                });

                localStorage.setItem("isTOTPopen", 'true');
                this.delayedAlert();
                if (this.isDigitClick == true) {
                    this.accountIndexOld = -1;
                } else {
                    this.accountIndexOld = index;
                }


            } else if (this.accountIndexOld == index) {
                let accDivIndex = document.querySelector("#divId" + this.accountIndexOld);
                accDivIndex.innerHTML = "";
                accDivIndex = document.querySelector("#divId" + index);
                accDivIndex.innerHTML = "";
                this.accountIndexOld = -1;
                this.isTOTPopen = false;
                localStorage.setItem("isTOTPopen", 'false');
            }
            else {
                let accDivIndex = document.querySelector("#divId" + this.accountIndexOld);
                accDivIndex.innerHTML = "";

                accDivIndex = document.querySelector("#divId" + index);
                accDivIndex.innerHTML = '<div class="row" id="totpdiv"><div class="col col-75 otpValue" id="otpDiv' + index + '"><span>' + this.names[index].otpValue + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + index + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';

                document.querySelector("#otpDiv" + index).addEventListener("click", function (event) {

                    let innndexval = localStorage.getItem('indexvalue');
                    let accDivIndex = document.querySelector("#divId" + innndexval);
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
                let SettLocalStorage = JSON.parse(localStorage.getItem("Appsetting"));
                if (SettLocalStorage) {
                    if (SettLocalStorage.vibration == true) {
                        this.vibration.vibrate(1000);
                    }
                }
                else {
                    this.vibration.vibrate(1000);
                }
                //Play ringtone Sound 

                this.zone.run(() => {
                    let ringtoneUrl = localStorage.getItem('ringtoneUrl');
                    if (ringtoneUrl && ringtoneUrl != 'null') {

                        this.ringtones.playRingtone(ringtoneUrl);
                    } else {
                        //Play default Sound 
                        this.nativeAudio.preloadComplex('default', 'assets/sound/default.mp3', 1, 1, 0);
                        this.nativeAudio.preloadSimple('default', 'assets/sound/default.mp3');
                        console.log("Musique Play");
                        this.nativeAudio.play('default', () => console.log('uniqueId1 is done playing'));
                    }
                });
                localStorage.setItem("isTOTPopen", 'true');
                if (this.isDigitClick == true) {
                    this.accountIndexOld = -1;
                } else {
                    this.accountIndexOld = index;
                }

                this.delayedAlert();
            }            
        }
        catch (error) { alert(commonString.homePage.invalidScretKey); }
    }




    timer() {
        try {           
            countDown--;
            let accDivIndex = document.querySelector("#divId" + indexAccountChetu);
            let timerDivIndex = document.querySelector("#timerDiv" + indexAccountChetu);
            if (countDown == 0) {
                accDivIndex.innerHTML = '<div class="row" id="totpdiv" ><div class="col col-75 otpValue" id="otpDiv' + indexAccountChetu + '"><span>' + globalOTP + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + indexAccountChetu + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                document.querySelector("#otpDiv" + indexAccountChetu).addEventListener("click", function (event) {
                    let innndexval = localStorage.getItem('indexvalue');
                    let accDivIndex = document.querySelector("#divId" + innndexval);
                    if (accDivIndex) {
                        clearInterval(intervalId);
                        accDivIndex.innerHTML = "";
                        this.accountIndexOld = -1;
                        this.isTOTPopen = false;
                        localStorage.setItem("isTOTPopen", 'false');
                        localStorage.setItem("isgeneratedTOTP", 'true');
                    }
                }, false);
            } else {
                if (timerDivIndex == null) {
                    accDivIndex.innerHTML = '<div class="row" id="totpdiv" ><div class="col col-75 otpValue" id="otpDiv' + indexAccountChetu + '"><span>' + globalOTP + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + indexAccountChetu + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                    document.querySelector("#otpDiv" + indexAccountChetu).addEventListener("click", function (event) {
                        let innndexval = localStorage.getItem('indexvalue');
                        let accDivIndex = document.querySelector("#divId" + innndexval);
                        if (accDivIndex) {
                            clearInterval(intervalId);
                            accDivIndex.innerHTML = "";
                            this.accountIndexOld = -1;
                            this.isTOTPopen = false;
                            localStorage.setItem("isTOTPopen", 'false');
                            localStorage.setItem("isgeneratedTOTP", 'true');
                        }
                    }, false);
                } else {
                    timerDivIndex.innerHTML = '<div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div>';
                }
            }
            this.isTOTPopen = true;
            localStorage.setItem("isTOTPopen", 'true');
            if (countDown == 0) {
                let getStorageToDisplay = JSON.parse(localStorage.getItem("accounts"));
                if (getStorageToDisplay[indexAccountChetu].accountProtectionEnable == true) {
                    if (isFirstTotp == 2) {
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
                        countDown = 30;
                        isFirstTotp = 3;
                        let accDivIndex = document.querySelector("#divId" + indexAccountChetu);
                        accDivIndex.innerHTML = '';
                        accDivIndex.innerHTML = '<div class="row" id="totpdiv" ><div class="col col-75 otpValue" id="otpDiv' + indexAccountChetu + '"><span>' + globalOTP + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + indexAccountChetu + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                        document.querySelector("#otpDiv" + indexAccountChetu).addEventListener("click", function (event) {
                            let innndexval = localStorage.getItem('indexvalue');
                            let accDivIndex = document.querySelector("#divId" + innndexval);
                            if (accDivIndex) {
                                clearInterval(intervalId);
                                accDivIndex.innerHTML = "";
                                this.accountIndexOld = -1;
                                this.isTOTPopen = false;
                                localStorage.setItem("isTOTPopen", 'false');
                                localStorage.setItem("isgeneratedTOTP", 'true');
                            }
                        }, false);
                    } else {
                        accDivIndex.innerHTML = "";
                        this.isTOTPopen = false;
                        localStorage.setItem("isTOTPopen", 'false');
                        clearInterval(intervalId);
                        return;
                    }
                }
                else {
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
                    countDown = 30;
                    let accDivIndex = document.querySelector("#divId" + indexAccountChetu);
                    accDivIndex.innerHTML = '';
                    accDivIndex.innerHTML = '<div class="row" id="totpdiv" ><div  class="col col-75 otpValue" id="otpDiv' + indexAccountChetu + '"><span>' + globalOTP + '</span></div><div class="progress-circle-container_hm" id="timerDiv' + indexAccountChetu + '"><div class="progress-circle_hm progress-' + Math.round((countDown) * 3.3) + '"><span>' + countDown + '</span></div></div></div>';
                    document.querySelector("#otpDiv" + indexAccountChetu).addEventListener("click", function (event) {
                        let innndexval = localStorage.getItem('indexvalue');
                        let accDivIndex = document.querySelector("#divId" + innndexval);
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
        } catch (error) { console.log("Error occured"); }
    }



    delayedAlert() {
        try {
            intervalId = setInterval(this.timer, 1000);
        } catch (error) { console.log("Error occured"); }
    }

    //Edit Account 

    public editAccount(accountIndex: any, index) {
        localStorage.removeItem("accName");
        localStorage.removeItem("accId");
        localStorage.removeItem("barcodeResult");
        localStorage.removeItem("imageSrc");
        this.nativeAudio.stop('default');
        let accDivIndex = document.querySelector("#totpdiv");
        if (accDivIndex) {
            accDivIndex.innerHTML = '';
            clearInterval(intervalId);
        }

        localStorage.setItem('redirectTo', 'HomeEditFunc');
        let oldStorage = JSON.parse(localStorage.getItem("accounts"));
        let oldgetStorageSett = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldStorage[index].accountProtectionEnable == true) {
            if (oldgetStorageSett) {
                if (oldgetStorageSett.accountProtection) {
                    let protectionType = oldgetStorageSett.accountProtection;
                    if (protectionType == 2) {
                        this.navCtrl.push(GeneratePinPage, { accountIndex: accountIndex, 'pushFlagTitle': 'editAccount' });
                    } else if (protectionType == 1) {
                        let date = new Date();
                        let newtimeStamp: any;
                        newtimeStamp = date.getTime();
                        let oldtimeStamp: any;
                        let minutesDifference: any = 1212;
                        oldtimeStamp = localStorage.getItem('oldtimeStamp');
                        if (oldtimeStamp) {
                            let difference = newtimeStamp - oldtimeStamp;
                            minutesDifference = Math.floor(difference / 1000 / 60);
                        }
                        if (minutesDifference <= 2) {
                            this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                        } else {
                            this.androidFingerprintAuth.isAvailable()
                                .then((result) => {
                                    if (result.isAvailable) {
                                        this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword', disableBackup: true })
                                            .then(result => {
                                                let date = new Date();
                                                let oldtimeStamp: any;
                                                oldtimeStamp = date.getTime();
                                                localStorage.setItem('oldtimeStamp', oldtimeStamp);
                                                if (result.withFingerprint) {
                                                    console.log('Successfully encrypted credentials.');
                                                    console.log('Encrypted credentials: ' + result.token);
                                                    this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                                                    //this.navCtrl.push(SettingPage);  
                                                } else if (result.withBackup) {
                                                    console.log('Successfully authenticated with backup password!');
                                                } else console.log('Didn\'t authenticate!');
                                            })
                                            .catch(error => {

                                                let alert = this.alertCtrl.create({
                                                    title: '',
                                                    message: commonString.homePage.alertMessage,
                                                    buttons: [
                                                        {
                                                            text: 'No',
                                                            role: 'cancel',
                                                            handler: () => {
                                                                console.log('Cancel clicked');

                                                            }
                                                        },
                                                        {
                                                            text: 'Yes',
                                                            handler: () => {
                                                                console.log('yes clicked');
                                                                this.navCtrl.push(GeneratePinPage, { accountIndex: accountIndex, 'pushFlagTitle': 'editAccount' });

                                                            }
                                                        }]
                                                })
                                                if (oldgetStorageSett.accountProtectionPin != 0) {
                                                    alert.present();
                                                }
                                                if (error == commonString.homePage.fingerCancelled) {

                                                    console.log('Fingerprint authentication cancelled');
                                                }
                                                else {
                                                    console.error(error)
                                                }
                                            });

                                    } else {
                                        let alert = this.alertCtrl.create({
                                            title: '',
                                            subTitle: commonString.homePage.fingerNotFound + result.isAvailable,
                                            buttons: ['OK']
                                        });
                                        alert.present();                                       
                                    }
                                }).catch(error => {
                                    console.error(error)
                                });
                        }
                    } else {
                        this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                        console.log("None");
                    }
                } else {
                    this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                    console.log("accountProtection empty");
                }
            } else {
                this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
                console.log("old storage empty");
            }
        }
        else {
            this.navCtrl.push(EditAccountPage, { accountIndex: accountIndex });
        }
    }




    //modify order of accounts Click Button 
    public modifyOrder() {
        clearInterval(intervalId);
        this.nativeAudio.stop('default');
        this.hideMenu();
        this.navCtrl.push(ModifyOrderPage);
    }

    // method to redirect in userprofile page
    public userProfileClick() {
        this.nativeAudio.stop('default');
        let accDivIndex = document.querySelector("#totpdiv");
        if (accDivIndex) {
            clearInterval(intervalId);
            accDivIndex.innerHTML = '';
        }       
        this.menuClick();       
        this.navCtrl.push(UserProfilePage, { 'backTo': 'home' });
    }

    // reset the web password method
    public resetPassword() {
        localStorage.setItem('redirectTo', 'resetPass');
        this.navCtrl.push(GeneratePinPage);
    }


    // unlock user account method
    public unlockAccount() {
        //  alert("unlock user acc");
        localStorage.setItem('redirectTo', 'unlockAcc');
        this.navCtrl.push(GeneratePinPage);
    }

   

    public editSettings() {
        try{
        let accDivIndex = document.querySelector("#totpdiv");
        if (accDivIndex) {
            accDivIndex.innerHTML = '';
        }
        clearInterval(intervalId);
        this.hideMenu();
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        localStorage.setItem('redirectTo', 'settingPage');
        if (oldgetStorage) {
            if (oldgetStorage.settingProtectionType != 0 && oldgetStorage.isSettingProtect == true) {
                let protectionType = oldgetStorage.settingProtectionType;
                if (protectionType == 2) {
                    console.log("4 digit pin");
                    this.navCtrl.push(GeneratePinPage, { 'pushFlagTitle': 'settingPage' });
                } else if (protectionType == 1) {
                    let date = new Date();
                    let newtimeStamp: any;
                    newtimeStamp = date.getTime();
                    let oldtimeStamp: any;
                    let minutesDifference: any = 1212;
                    oldtimeStamp = localStorage.getItem('oldtimeStamp');
                    if (oldtimeStamp) {
                        let difference = newtimeStamp - oldtimeStamp;
                        minutesDifference = Math.floor(difference / 1000 / 60);
                    }

                    if (minutesDifference <= 2) {
                        this.navCtrl.push(SettingPage);
                    } else {
                        this.androidFingerprintAuth.isAvailable()
                            .then((result) => {
                                if (result.isAvailable) {
                                    this.androidFingerprintAuth.encrypt({
                                        clientId: 'myAppName',
                                        username: 'myUsername',
                                        password: 'myPassword',
                                        disableBackup: true,
                                        maxAttempts: 3
                                    })
                                        .then(result => {
                                            let date = new Date();
                                            let oldtimeStamp: any;
                                            oldtimeStamp = date.getTime();
                                            localStorage.setItem('oldtimeStamp', oldtimeStamp);
                                            console.log(result);
                                            debugger;
                                            if (result.withFingerprint) {
                                                console.log('Successfully encrypted credentials.');
                                                console.log('Encrypted credentials: ' + result.token);
                                                this.navCtrl.push(SettingPage);
                                            } else if (result.withBackup) {
                                                console.log('Successfully authenticated with backup password!');
                                            }
                                            else console.log('Didn\'t authenticate!');
                                        })
                                        .catch(error => {
                                            let alert = this.alertCtrl.create({
                                                title: '',
                                                message: commonString.homePage.alertMessage,
                                                buttons: [
                                                    {
                                                        text: 'No',
                                                        role: 'cancel',
                                                        handler: () => {
                                                            console.log('Cancel clicked');

                                                        }
                                                    },
                                                    {
                                                        text: 'Yes',
                                                        handler: () => {
                                                            console.log('yes clicked');
                                                            this.navCtrl.push(GeneratePinPage, { 'pushFlagTitle': 'settingPage' });

                                                        }
                                                    }]
                                            })
                                            if (oldgetStorage.accountProtectionPin != 0) {
                                                alert.present();
                                            }
                                            if (error == commonString.homePage.fingerCancelled) {
                                                console.log('Fingerprint authentication cancelled');
                                            }
                                            else {
                                                console.log(error);
                                            }
                                        });

                                } else {
                                    let alert = this.alertCtrl.create({
                                        title: '',
                                        subTitle: commonString.homePage.fingerNotFound + result.isAvailable,
                                        buttons: ['OK']
                                    });
                                    alert.present();                                   
                                }
                            }).catch(error => {
                                alert('avallable resuole' + error);
                                console.log(error);
                            });
                    }
                } else {
                    this.navCtrl.push(SettingPage);
                    console.log("None");
                }
            } else {
                this.navCtrl.push(SettingPage);
                console.log("accountProtection empty");
            }
        } else {
            console.log("old storage empty");
            this.navCtrl.push(SettingPage);
        }
       } catch (error) { console.log("Error occured"); }
    }


    ConfirmUser(PageName) {
        debugger;
         try{
        this.nativeAudio.stop('default');
        this.hideMenu();
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
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
                let protectionType = oldgetStorage.accountProtection;
                if (protectionType == 2) {
                    console.log("4 digit pin");
                    this.navCtrl.push(GeneratePinPage, { 'pushFlagTitle': PageName });
                } else if (protectionType == 1) {

                    let date = new Date();
                    let newtimeStamp: any;
                    newtimeStamp = date.getTime();
                    let oldtimeStamp: any;
                    let minutesDifference: any = 1212;
                    oldtimeStamp = localStorage.getItem('oldtimeStamp');
                    if (oldtimeStamp) {
                        let difference = newtimeStamp - oldtimeStamp;
                        minutesDifference = Math.floor(difference / 1000 / 60);
                    }

                    if (minutesDifference <= 2) {
                        this.CallResetAPI(PageName);
                    } else {

                        this.androidFingerprintAuth.isAvailable()
                            .then((result) => {
                                if (result.isAvailable) {
                                     this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword', disableBackup: true })
                                        .then(result => {
                                            let date = new Date();
                                            let oldtimeStamp: any;
                                            oldtimeStamp = date.getTime();
                                            localStorage.setItem('oldtimeStamp', oldtimeStamp);
                                            if (result.withFingerprint) {
                                                this.CallResetAPI(PageName);
                                                console.log('Successfully encrypted credentials.');
                                                console.log('Encrypted credentials: ' + result.token);
                                            } else if (result.withBackup) {
                                                console.log('Successfully authenticated with backup password!');
                                            } else console.log('Didn\'t authenticate!');
                                        })
                                        .catch(error => {
                                            let alert = this.alertCtrl.create({
                                                title: '',
                                                message: commonString.homePage.alertMessage,
                                                buttons: [
                                                    {
                                                        text: 'No',
                                                        role: 'cancel',
                                                        handler: () => {
                                                            console.log('Cancel clicked');

                                                        }
                                                    },
                                                    {
                                                        text: 'Yes',
                                                        handler: () => {
                                                            console.log('yes clicked');
                                                            this.navCtrl.push(GeneratePinPage, { 'pushFlagTitle': PageName });

                                                        }
                                                    }]
                                            })
                                            if (oldgetStorage.accountProtectionPin != 0) {
                                                alert.present();
                                            }
                                            if (error == commonString.homePage.fingerCancelled) {
                                                  console.log('Fingerprint authentication cancelled');
                                            }
                                            else {
                                                console.error(error)
                                            }
                                        });

                                } else {
                                    let alert = this.alertCtrl.create({
                                        title: '',
                                        subTitle: commonString.homePage.fingerNotFound + result.isAvailable,
                                        buttons: ['OK']
                                    });
                                    alert.present();                                    
                                }
                            })
                            .catch(error => {                               
                                console.error(error)
                            });
                        console.log("Biomatrics");

                    }

                } else {
                    this.CallResetAPI(PageName);                   
                    console.log("None");
                }
            } else {
                this.CallResetAPI(PageName);               
                console.log("accountProtection empty");
            }
        } else {
            this.CallResetAPI(PageName);
            console.log("old storage empty");          
        }
      } catch (error) { console.log("Error occured"); }

    }


    //Call Reset Password API 

    CallResetAPI(PageName) {
        if (PageName == "ResetPassword") {          
            let loading = this.loadingCtrl.create({
                content: commonString.homePage.waitMsg,
                duration: 5000
            });
            this.restProvider.resetPassword().subscribe(
                (result) => {
                    let resultObj = JSON.stringify(result);
                    let resultData = JSON.parse(resultObj);                   
                    if (resultData.Result.SuccessCode == 200) {
                        localStorage.setItem('sessionId', resultData.Result.sessionId);
                        loading.dismiss();
                        console.log(resultData.Result.sessionId);
                        localStorage.setItem('resetPassKey', result.Result.resetPasswordKey);
                        let passwordPolicy = JSON.stringify(resultData.Result.passwordPolicy);
                        console.log('passwordPolicy' + passwordPolicy);
                        localStorage.setItem('passwordPolicy', passwordPolicy);
                    }
                    else if (resultData.Result.SuccessCode == 100) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.homePage.errRegistrationKey,
                            buttons: ['OK']
                        });
                        alert.present();                      
                    }
                    else if (resultData.Result.SuccessCode == 400) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.homePage.requestFailed,
                            buttons: ['OK']
                        });
                        alert.present();                      
                    }
                    else if (resultData.Result.SuccessCode == 700) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.homePage.userIdMsg,
                            buttons: ['OK']
                        });
                        alert.present();                       
                    }
                    else {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.homePage.unknownErr,
                            buttons: ['OK']
                        });
                        alert.present();                     
                    }

                },
                (error) => {
                    console.log("error api" + JSON.stringify(error));

                }
            );


            loading.present();
        }
        else {

            let loading = this.loadingCtrl.create({
                content: commonString.homePage.waitMsg,
                duration: 5000
            });

            this.restProvider.unlockAccount().subscribe(
                (result) => {
                    let resultObj = JSON.stringify(result);
                    let resultData = JSON.parse(resultObj);

                    if (resultData.Result.SuccessCode == 200) {
                        localStorage.setItem('sessionId', resultData.Result.sessionId);
                        loading.dismiss();
                        console.log(resultData.Result.sessionId);

                    }
                    else if (resultData.Result.SuccessCode == 100) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.homePage.errRegistrationKey,
                            buttons: ['OK']
                        });
                        alert.present();
                        // alert("Registration key not found on the database.");
                    }
                    else if (resultData.Result.SuccessCode == 400) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.homePage.requestFailed,
                            buttons: ['OK']
                        });
                        alert.present();
                        // alert("Request Failed.");
                    }

                    else if (resultData.Result.SuccessCode == 700) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.homePage.userIdMsg,
                            buttons: ['OK']
                        });
                        alert.present();
                        // alert("User ID not found.");
                    }
                    else {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.homePage.unknownErr,
                            buttons: ['OK']
                        });
                        alert.present();                      
                    }

                },
                (error) => {
                    console.log("error api" + JSON.stringify(error));

                });
            loading.present();
        }
    }


    //Call API for Reset Password

    ResendNotification() {
        let sessionid = localStorage.getItem('sessionId');

        this.restProvider.resendNotification(sessionid).subscribe(
            (result) => {
                let resendresultObj = JSON.stringify(result);
                let resendResultData = JSON.parse(resendresultObj);

                let sucessCode = resendResultData.Result.SuccessCode;

                if (sucessCode == 600) {
                    this.toast.show(`Success`, '500', 'bottom').subscribe(
                        toast => {
                            console.log(toast);
                        }
                    );
                }
                else {

                    let alert = this.alertCtrl.create({
                        title: '',
                        subTitle: commonString.homePage.connectivityErr,
                        buttons: ['OK']
                    });
                    alert.present();
                    //  alert("Connectivity error.");
                }
            },
            (error) => {
                console.log("error api" + JSON.stringify(error));

            }
        );

    }


    // check fingerprint is recently validated 

    fingerprintRecentValidation() {
        let date = new Date();
        // this.timeStamp = date.getTime();  

    }


    blankSpaceClick() {
        debugger;
        let innndexval = localStorage.getItem('indexvalue');
        let accDivIndex = document.querySelector("#divId" + innndexval);
        if (accDivIndex) {
            clearInterval(intervalId);
            accDivIndex.innerHTML = "";
            this.accountIndexOld = -1;
            this.isTOTPopen = false;
            localStorage.setItem("isTOTPopen", 'false');
        }
    }

    blankspaceClick() {

    }


    modifyPressed() {

        console.log('modifyPressed');
    }

   

    LongPressed() {
        this.modify = true;
        this.isDisplay = 'none';
    }

    // set the position of the items
    reorderItems($event) {
        this.names = reorderArray(this.names, $event);
        localStorage.setItem("accounts", JSON.stringify(this.names));
        this.enableGoogleDrive();

        this.modify = false;
        this.isDisplay = 'block';
    }


    enableGoogleDrive() {
        try{
        let enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            if (enableTxt == 'Enabled') {
                localStorage.setItem('isEnable', 'Enabled');
                let getAccountData = JSON.parse(localStorage.getItem("accounts"));
                let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                if (totpProtection) {
                    totpProtection.deviceId = this.deviceId;
                }
                localStorage.setItem("Appsetting", JSON.stringify(totpProtection));
                localStorage.setItem("accounts", JSON.stringify(getAccountData));
                let accountsString = localStorage.getItem("accounts");
                let settingsString = localStorage.getItem("Appsetting");
                let backupString = accountsString.concat('splitSet' + settingsString);
                console.log('accounts ' + accountsString);
                console.log('settings' + settingsString);
                console.log('backkup' + backupString);
                let encryptAccData = window.btoa(backupString);
                if (encryptAccData) {
                    let cameraOptions :any = { data: encryptAccData };
                    this.Camera.getPicture(cameraOptions)
                        .then(Response => {
                            let lastbackupdateTime = this.formatDateTime();
                            localStorage.setItem('lastBackupTime', lastbackupdateTime);
                        },
                            err => {
                                console.log(err)
                            });
                }
            } else {
                localStorage.setItem('isEnable', 'Disabled');
            }
          }
         } catch (error) { console.log("Error occured"); }
    }


    //end

    formatDateTime() {
        try{
        let minutes: any;
        var date = new Date();
        let monthNames = ["January", "February", "March", "April", "May", "June",
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
      } catch (error) { console.log("Error occured"); }
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
var intervalId;
let indexAccountChetu: number = 0;
let globalOTP: string;
let index: any;
let getAccountId: any;
let isFirstTotp: number;