import { Component, NgZone } from '@angular/core';
import { IonicPage, App, NavController, NavParams, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { SettingPage } from '../setting/setting';
import * as jsSHA from "jssha";
import { commonString } from "../.././app/commonString";
import { Platform } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';
import { IconlistPage } from "../iconlist/iconlist";
import { UserProfilePage } from '../user-profile/user-profile';
import { DefaulticonPage } from '../defaulticon/defaulticon';

@IonicPage()
@Component({
    selector: 'page-add-account',
    templateUrl: 'add-account.html',
})
export class AddAccountPage {
    @ViewChild(Navbar) navBar: Navbar;
    pageHeading: any;
    getBarcodeResult: any;
    accountName: string;
    accountId: any;
    accountIndex: number = 2;
    accountArr: any = [];
    accountArr1: any = [];
    errorSecretkey: string;
    erroraccountName: string;
    erroraccountId: string;
    flag: number;
    imageSrc: any = 'assets/imgs/user_img_new.jpg';
    accountProtectionEnable: Boolean = false;
    protectionSet: string = "Disable";
    isDisable: Boolean = false;
    isRescan: string;
    protectionPin: any = 0;
    hideBarcodeBtn: any;
    hideScan: boolean = true;
    deviceId: any;
    isUserRegister: Boolean = false;
    pushPage: any;
    newImgSrc: any;
    constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public navParams: NavParams, private zone: NgZone, public app: App, public platform: Platform, private barcodeScanner: BarcodeScanner, private Camera: Camera, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController, private toast: Toast) {
        this.getBarcodeResult = navParams.get('barcodeResult');
        this.accountName = navParams.get('issuer_accountName');
        this.accountId = navParams.get('resaccountid');
        this.pushPage = navParams.get('page');
        let iconName = navParams.get('iconName');
        let imageSrc = navParams.get('imageSrc');
        console.log("imageSrc",iconName)
        if (imageSrc) {
            this.newImgSrc = imageSrc;
        }else{
            this.imageSrc = localStorage.getItem('imageSrc');
        }
        if (iconName) {
            console.log("iconName",iconName)
            this.accountName = iconName;
            if (this.accountName == 'other1' || this.accountName == 'other2' || this.accountName == 'other3' || this.accountName == 'other4') {
                console.log("iconName this.accountName == 'other1'",iconName)
                this.accountName = '';
            } else {
                console.log("iconName else",iconName)
                this.accountName = iconName;
            }
            this.imageSrc = 'assets/accounticons/' + iconName + '.png';
        }
        if (this.accountName == '') {
            this.imageSrc = 'assets/accounticons/' + iconName + '.png';
        }
        else if (imageSrc) {
            this.imageSrc = imageSrc;
        }
        else {
            this.imageSrc = 'assets/accounticons/' + this.accountName + '.png';
        }


        let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }


        platform.ready().then(() => {
            // device back button event 
            platform.registerBackButtonAction(() => {
                this.backbuttonClick();
            });
        })
        this.hideBarcodeBtn = localStorage.getItem('hideScanBtn');
        if (this.hideBarcodeBtn == 'yes') {
            this.hideScan = false;
        } else {
            this.hideScan = true;
        }

        if (this.getBarcodeResult) {
            this.pageHeading = commonString.addAccPage.pageHeadingQR;
        } else {
            this.pageHeading = commonString.addAccPage.pageHeadingManual;
        }

        if (this.getBarcodeResult) {
            this.isRescan = 'Rescan';
        }
        else {
            this.isRescan = 'Scan';
        }
        this.deviceId = localStorage.getItem('deviceId');

        if (localStorage.getItem('accName')) {
            this.accountName = localStorage.getItem('accName');
        }
        if (localStorage.getItem('accId')) {
            this.accountId = localStorage.getItem('accId');
        }
        if (localStorage.getItem('barcodeResult')) {
            this.getBarcodeResult = localStorage.getItem('barcodeResult');
        }
        if (localStorage.getItem('imageSrc')) {
            this.imageSrc = localStorage.getItem('imageSrc');
        }
        if(this.newImgSrc){
            this.imageSrc = this.newImgSrc;
        }else{
            this.imageSrc = localStorage.getItem('imageSrc');
        }

    }


    ionViewWillEnter() {
        this.hideBarcodeBtn = localStorage.getItem('hideScanBtn');
        if (this.hideBarcodeBtn == 'yes') {
            this.hideScan = false;
        } else {
            this.hideScan = true;
        }
    }
    
    // if back button is clicked without saving data
    backbuttonClick() {
        if (this.accountName || this.accountId || this.getBarcodeResult) {
            this.backbuttonAlert();
        } else {
            this.navCtrl.pop();
        }

    }

    backbuttonAlert() {
        let alert = this.alertCtrl.create({
            title: '',
            message: commonString.addAccPage.backBtnMsg,
            buttons: [
                {
                    text: 'No',
                    role: 'No',
                    handler: () => {
                        let navTransition = alert.dismiss();
                        navTransition.then(() => {
                            if (this.pushPage == 'defaultIcon') {
                                this.navCtrl.push(DefaulticonPage, { 'pageName': 'iconList' });
                            } else if (this.pushPage == 'IconList') {
                                this.navCtrl.push(IconlistPage);
                            } else {
                                this.navCtrl.popToRoot();
                            }
                        });
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.addAccountCheck();
                    }
                }
            ]
        });
        alert.present();
    }

    ionViewDidLoad() {
        if(this.accountName){
            this.imageSrc = 'assets/accounticons/' + this.accountName + '.png';
        }
        else if(this.newImgSrc){
            this.imageSrc = this.newImgSrc;
        }else{
            this.imageSrc = localStorage.getItem('imageSrc');
        }           

    }

    // add account details function
    addAccountCheck() {
        this.zone.run(() => {
            try {
                this.checkAccount();
                if (this.flag == 0) {
                    return;
                }

                this.checkAccountName();
                if (this.flag == 0) {
                    return;
                }

                this.checkSecrekey(this.getBarcodeResult);
                if (this.flag == 0) {
                    return;
                }

                this.checkAccountID();
                if (this.flag == 0) {
                    return;
                }
                let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));

                if (totpProtection) {
                    this.protectionPin = totpProtection.accountProtectionPin;
                }

                let personAcc = {
                    accountId: this.accountId,
                    accountName: this.accountName,
                    secretKey: this.getBarcodeResult,
                    accountIndex: 2,
                    otpValue: '',
                    imageSrc: this.imageSrc,
                    accountProtectionEnable: this.accountProtectionEnable,
                    isRegister: true,
                    accountProtectionPin: this.protectionPin,

                };

                let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                personAcc.accountId = this.accountId.trim();
                personAcc.accountName = this.accountName.trim();
                personAcc.secretKey = this.getBarcodeResult.trim();
                if (oldgetStorage) {
                    if (oldgetStorage.length > 0) {
                        let newarr = JSON.stringify(oldgetStorage);
                        this.accountArr1 = JSON.parse(newarr);
                        let maxId = Math.max.apply(Math, this.accountArr1.map(function (item) { return item.accountIndex; })) + 1;
                        personAcc.accountIndex = maxId;
                        oldgetStorage.push(personAcc);
                        localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                        this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(
                            toast => {
                                console.log(toast);
                            }
                        );
                        this.enableGoogleDrive();
                        this.navCtrl.popToRoot();
                    }
                    else {
                        personAcc.accountIndex = 2;
                        this.accountArr.push(personAcc);
                        localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                        this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(
                            toast => {
                                console.log(toast);
                            }
                        );
                        this.enableGoogleDrive();
                        this.navCtrl.popToRoot();

                    }
                }
                else {
                    personAcc.accountIndex = 2;
                    this.accountArr.push(personAcc);
                    localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                    this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(
                        toast => {
                            console.log(toast);
                        }
                    );
                    this.enableGoogleDrive();
                    this.navCtrl.popToRoot();
                }
                localStorage.removeItem("accName");
                localStorage.removeItem("accId");
                localStorage.removeItem("barcodeResult");
                localStorage.removeItem("imageSrc");

            } catch (error) { console.log("Error occured", error); }
        });
    }

    // Form Validation 
    checkAccount() {
        this.zone.run(() => {
            try {
                if (this.accountName == undefined) {
                    this.erroraccountName = commonString.addAccPage.erroraccountName;
                    this.flag = 0;
                }
                if (this.accountId == undefined) {
                    this.erroraccountId = commonString.addAccPage.erroraccountId;
                    this.flag = 0;
                }
                if (this.getBarcodeResult == undefined) {
                    this.errorSecretkey = commonString.addAccPage.errorSecretkey;
                    this.flag = 0;
                }
                if (this.getBarcodeResult == '') {
                    this.errorSecretkey = commonString.addAccPage.errorSecretkey;
                    this.flag = 0;
                }
            } catch (error) { console.log("Error occured",error); }
        });

    }


    // Form Validation
    onKeySecret(event) {
        try {
            this.checkSecrekey(this.getBarcodeResult);
        } catch (error) { console.log("Error occured",error); }
    }

    // Form Validation
    checkSecrekey(getBarcodeResult) {
        try {
            this.checValidKey(getBarcodeResult);
        } catch (error) { console.log("Error occured",error); }
    }


    // Check Account Name
    onKeyAccountName(event) {
        this.checkAccountName();
    }

    // Check Account Name
    checkAccountName() {
        this.zone.run(() => {
            try {
                let accountName = this.accountName;
                this.flag = 1;
                if (accountName.length <= 0) {
                    this.erroraccountName = commonString.addAccPage.erroraccountName;
                    this.flag = 0;
                }
                else {
                    this.erroraccountName = "";
                    this.flag = 1;
                }
            } catch (error) { console.log("Error occured",error); }

        });
    }

    // Check Account ID
    onKeyAccountID(event) {
        this.checkAccountID();
    }

    // Check Account ID
    checkAccountID() {
        this.zone.run(() => {
            try {
                let accountId = this.accountId;
                this.flag = 1;
                if (accountId.length <= 0) {
                    this.erroraccountId = commonString.addAccPage.erroraccountId;
                    this.flag = 0;
                }
                else {
                    this.erroraccountId = "";
                    this.flag = 1;
                }
            } catch (error) { console.log("Error occured", error); }
        });

    }

    // Check Valid Secret Key
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
        let base32chars = commonString.addAccPage.base32CharStrg;
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

    // Check Valid Secret Key
    checValidKey(getBarcodeResult) {
        this.zone.run(() => {
            try {
                let epoch = Math.round(new Date().getTime() / 1000.0);
                let time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, "0");
                let hmacObj = new jsSHA(time, "HEX");
                let hmac = hmacObj.getHMAC(this.base32tohex(getBarcodeResult), "HEX", "SHA-1", "HEX");
                let offset = this.hex2dec(hmac.substring(hmac.length - 1));
                var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
                otp = (otp).substr(otp.length - 6, 6);
                this.errorSecretkey = "";
                this.flag = 1;
            } catch (error) {
                console.log("Error occured",error);
                this.errorSecretkey = commonString.addAccPage.invalidScretKey;
                this.flag = 0;

            }
        });
    }

    ///Browse Image  Code
    browseImgClick() {

        if (this.accountName) {
            localStorage.setItem('accName', this.accountName);
        }
        if (this.accountId) {
            localStorage.setItem('accId', this.accountId);
        }
        if (this.getBarcodeResult) {
            localStorage.setItem('barcodeResult', this.getBarcodeResult);
        }
        if (this.imageSrc) {
            localStorage.setItem('imageSrc', this.imageSrc);
        }
        this.navCtrl.push(DefaulticonPage, { 'pageName': 'addAccount' });
    }


    // get barcode result
    barcodeClick() {
        try {
            this.barcodeScanner.scan().then((barcodeData) => {
                console.log(barcodeData.text);
                let newSecretKey;
                if (barcodeData.text.includes("secret") == true) {
                    if (barcodeData.text) {
                        this.isRescan = 'Rescan';
                    }
                    else {
                        this.isRescan = 'Scan';
                    }
                    let res = barcodeData.text.split('secret');
                    res = res[1].split('=');
                    newSecretKey = res[1];
                    if (res.length > 2) {
                        newSecretKey = newSecretKey.substring(0, newSecretKey.indexOf("&"));
                    }
                    this.getBarcodeResult = newSecretKey;
                    this.checkSecrekey(this.getBarcodeResult);
                }
                else if (barcodeData.text == "BACK_PRESSED") {
                    this.getBarcodeResult = '';
                    this.checkSecrekey(this.getBarcodeResult);
                }
                else if (barcodeData.text == "BUTTON_PRESSED") {
                    this.getBarcodeResult = '';
                    this.checkSecrekey(this.getBarcodeResult);

                }
                else if (barcodeData.text.includes("/") == true) {
                    let res = barcodeData.text.split('/');
                    let barcodeDataresult = res[res.length - 1];
                    this.getBarcodeResult = barcodeDataresult;
                    this.checkSecrekey(this.getBarcodeResult);
                }
                else {
                    this.getBarcodeResult = barcodeData.text;
                    this.checkSecrekey(this.getBarcodeResult);
                }
            }, (err) => {
                console.log("Error occured : " + err);
            });
        } catch (error) { console.log("Error occured",error); }
    }

    // Account Protection Click
    toggleClick() {
        try {
            let newacc = this.accountProtectionEnable;
            if (newacc == true) {
                let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
                if (oldgetStorage) {
                    if (oldgetStorage.accountProtection !== 0) {
                        this.protectionSet = "Enable";
                    }
                    else {
                        try {
                            let alert = this.alertCtrl.create({
                                title: '',
                                message: commonString.addAccPage.toggleClickMsg,
                                buttons: [
                                    {
                                        text: 'No',
                                        role: 'cancel',
                                        handler: () => {
                                            console.log('Cancel clicked');
                                            this.accountProtectionEnable = false;
                                        }
                                    },
                                    {
                                        text: 'Yes',
                                        handler: () => {
                                            console.log('Buy clicked');
                                            this.checkAccount();
                                            if (this.flag == 0) {
                                                alert.dismiss();
                                                this.accountProtectionEnable = false;
                                                return;
                                            }
                                            let personAcc = {
                                                accountId: this.accountId,
                                                accountName: this.accountName,
                                                secretKey: this.getBarcodeResult,
                                                accountIndex: 2,
                                                otpValue: '',
                                                imageSrc: this.imageSrc,
                                                accountProtectionEnable: this.accountProtectionEnable,
                                                isRegister: true,
                                                accountProtectionPin: this.protectionPin,
                                            };
                                            let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                                            personAcc.accountId = this.accountId.trim();
                                            personAcc.accountName = this.accountName.trim();
                                            personAcc.secretKey = this.getBarcodeResult.trim();
                                            if (oldgetStorage) {
                                                if (oldgetStorage.length > 0) {
                                                    let newarr = JSON.stringify(oldgetStorage);
                                                    this.accountArr1 = JSON.parse(newarr);
                                                    let maxId = Math.max.apply(Math, this.accountArr1.map(function (item) { return item.accountIndex; })) + 1;
                                                    personAcc.accountIndex = maxId;
                                                    oldgetStorage.push(personAcc);
                                                    localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                                                    this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(
                                                        toast => {
                                                            console.log(toast);
                                                        }
                                                    );

                                                    this.navCtrl.push(SettingPage);
                                                }
                                                else {
                                                    personAcc.accountIndex = 2;
                                                    this.accountArr.push(personAcc);
                                                    localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                                                    this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(
                                                        toast => {
                                                            console.log(toast);
                                                        }
                                                    );
                                                    this.navCtrl.push(SettingPage);
                                                }
                                            }
                                            else {
                                                personAcc.accountIndex = 2;
                                                this.accountArr.push(personAcc);
                                                localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                                                this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(
                                                    toast => {
                                                        console.log(toast);
                                                    }
                                                );
                                                this.navCtrl.push(SettingPage);
                                            }
                                            localStorage.removeItem("accName");
                                            localStorage.removeItem("accId");
                                            localStorage.removeItem("barcodeResult");
                                            localStorage.removeItem("imageSrc");
                                            this.enableGoogleDrive();
                                        }
                                    }
                                ]
                            });
                            alert.present();
                        } catch (error) { console.log("Error occured",error); }
                    }
                }
                else {
                    try {
                        let alert = this.alertCtrl.create({
                            title: '',
                            message: commonString.addAccPage.toggleClickMsg,
                            buttons: [
                                {
                                    text: 'No',
                                    role: 'cancel',
                                    handler: () => {
                                        console.log('Cancel clicked');
                                        this.accountProtectionEnable = false;
                                    }
                                },
                                {
                                    text: 'Yes',
                                    handler: () => {
                                        console.log('Buy clicked');
                                        this.checkAccount();
                                        if (this.flag == 0) {
                                            alert.dismiss();
                                            this.accountProtectionEnable = false;
                                            return;
                                        }
                                        let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                                        if (totpProtection) {
                                            this.protectionPin = totpProtection.accountProtectionPin;
                                        }
                                        let personAcc = {
                                            accountId: this.accountId,
                                            accountName: this.accountName,
                                            secretKey: this.getBarcodeResult,
                                            accountIndex: 2,
                                            otpValue: '',
                                            imageSrc: this.imageSrc,
                                            accountProtectionEnable: this.accountProtectionEnable,
                                            isRegister: true,
                                            accountProtectionPin: this.protectionPin,
                                        };
                                        let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                                        personAcc.accountId = this.accountId.trim();
                                        personAcc.accountName = this.accountName.trim();
                                        personAcc.secretKey = this.getBarcodeResult.trim();
                                        if (oldgetStorage) {
                                            if (oldgetStorage.length > 0) {
                                                let newarr = JSON.stringify(oldgetStorage);
                                                this.accountArr1 = JSON.parse(newarr);
                                                let maxId = Math.max.apply(Math, this.accountArr1.map(function (item) { return item.accountIndex; })) + 1;
                                                personAcc.accountIndex = maxId;
                                                oldgetStorage.push(personAcc);
                                                localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                                                this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(
                                                    toast => {
                                                        console.log(toast);
                                                    }
                                                );
                                                this.navCtrl.push(SettingPage);
                                            }
                                            else {
                                                personAcc.accountIndex = 2;
                                                this.accountArr.push(personAcc);
                                                localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                                                this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(
                                                    toast => {
                                                        console.log(toast);
                                                    }
                                                );
                                                this.navCtrl.push(SettingPage);
                                            }
                                        }
                                        else {
                                            personAcc.accountIndex = 2;
                                            this.accountArr.push(personAcc);
                                            localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                                            this.toast.show(commonString.addAccPage.accSaveMsg, '500', 'bottom').subscribe(
                                                toast => {
                                                    console.log(toast);
                                                }
                                            );
                                            this.navCtrl.push(SettingPage);
                                        }
                                        localStorage.removeItem("accName");
                                        localStorage.removeItem("accId");
                                        localStorage.removeItem("barcodeResult");
                                        localStorage.removeItem("imageSrc");
                                        this.enableGoogleDrive();
                                    }
                                }
                            ]
                        });
                        alert.present();
                    } catch (error) { console.log("Error occured",error); }
                    this.protectionSet = "Disable";
                }
            }
            else {
                this.protectionSet = "Disable";
            }

        } catch (error) { console.log("Error occured",error); }
    }
    // end
   
    // account backup function 
    enableGoogleDrive() {
        try {
            let enableTxt = localStorage.getItem('isEnable');
            if (enableTxt) {
                if (enableTxt == 'Enabled') {
                    localStorage.setItem('isEnable', 'Enabled');
                    let getAccountData = JSON.parse(localStorage.getItem("accounts"));
                    let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));
                    if (totpProtection) {
                        totpProtection.deviceId = this.deviceId;
                    }
                    localStorage.setItem("accounts", JSON.stringify(getAccountData));
                    let accountsString = localStorage.getItem("accounts");
                    let settingsString = localStorage.getItem("Appsetting");
                    let backupString = accountsString.concat('splitSet' + settingsString);
                    console.log('accounts ' + accountsString);
                    console.log('settings' + settingsString);
                    console.log('backkup' + backupString);
                    let encryptAccData = window.btoa(backupString);
                    if (encryptAccData) {
                        let cameraOptions: any = { data: encryptAccData };
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
        } catch (error) { console.log("Error occured",error); }
    }

    formatDateTime() {
        try {
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
        } catch (error) { console.log("Error occured",error); }
    }

    CancelButton() {
        localStorage.removeItem("accName");
        localStorage.removeItem("accId");
        localStorage.removeItem("barcodeResult");
        localStorage.removeItem("imageSrc");
        this.navCtrl.popToRoot();
    }

    userProfileClick() {
        localStorage.removeItem("accName");
        localStorage.removeItem("accId");
        localStorage.removeItem("barcodeResult");
        localStorage.removeItem("imageSrc");
        this.navCtrl.push(UserProfilePage, { 'backTo': 'addAccount' });
    }

}