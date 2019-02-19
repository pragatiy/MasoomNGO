import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import * as jsSHA from "jssha";
import { Platform } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import { DefaulticonPage } from '../defaulticon/defaulticon';
import { commonString } from "../.././app/commonString";

/**

 * Generated class for the EditAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-edit-account',
    templateUrl: 'edit-account.html',
})
export class EditAccountPage {
    @ViewChild(Navbar) navBar: Navbar;
    selectcity: any = [];
    accountIndex: number;
    getBarcodeResult: any;
    public accountId: string;
    public newaccountId: string;
    public accountName: string;
    public secretKey: string;
    public imageSrc: any = 'assets/imgs/user_img_new.jpg';
    public oldAccountId: string;
    public flag: number;
    public erroraccountId: any;
    public erroraccountName: any;
    public errorSecretkey: any;
    public protectionSet: string = "Disable";
    public accountProtectionEnable: Boolean = false;
    public accountProtectionIndex: number;
    public isDisable: Boolean = false;
    public keyUpFlag: Boolean = false;
    public protectionPin: any = 0;
    public deviceId: any;
    public newImgSrc: any;
    isUserRegister: Boolean = false;

    constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private zone: NgZone, public navParams: NavParams, public platform: Platform, private barcodeScanner: BarcodeScanner, private Camera: Camera, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
        platform.ready().then(() => {
            localStorage.setItem('redirectTo', '');
            let imageSrc = navParams.get('imageSrc');
            console.log("imageSrc edit",imageSrc);
            if (imageSrc) {
                this.newImgSrc = imageSrc;
            }else{
                this.imageSrc = localStorage.getItem('imageSrc');
            }
            this.accountIndex = navParams.get("accountIndex");
            let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
            if (registerUsered) {
                this.isUserRegister = true;
            }
            else {
                this.isUserRegister = false;
            }

            // device back button event 
            platform.registerBackButtonAction(() => {
                this.backbuttonClick();
            });
            // app back button event 
            this.navBar.backButtonClick = (e: UIEvent) => {
                this.backbuttonClick();
            }

            this.getaccountDetails();

            if (localStorage.getItem('accName')) {
                this.accountName = localStorage.getItem('accName');
            }
            if (localStorage.getItem('accId')) {
                this.accountId = localStorage.getItem('accId');
            }
            if (localStorage.getItem('barcodeResult')) {
                this.secretKey = localStorage.getItem('barcodeResult');
            }
            this.deviceId = localStorage.getItem('deviceId');

        })
    }



    // if back button is clicked without saving data
    backbuttonClick() {
        if (this.keyUpFlag == true) {
            this.backbuttonAlert();
        } else {
            this.navCtrl.popToRoot();
        }

    }

    backbuttonAlert() {
        try{
        let alert = this.alertCtrl.create({
            title: '',
            message: commonString.editAccPage.backBtnMsg,
            buttons: [
                {
                    text: 'No',
                    role: 'No',
                    handler: () => {
                        console.log('No clicked');
                        this.navCtrl.popToRoot();
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.editAccountdetails();
                        console.log('Yes clicked');
                    }
                }
            ]
        });
        alert.present();
      } catch (error) { console.log("Error occured",error); }
    }

    ionViewDidLoad() {
        // device back button event 
        this.accountIndex = this.navParams.data.accountIndex;
        console.log("this.accountIndex",this.navParams);
        this.platform.registerBackButtonAction(() => {
            this.backbuttonClick();
        });
        // app back button event 
        this.navBar.backButtonClick = (e: UIEvent) => {
            this.backbuttonClick();
        }
        console.log('ionViewDidLoad EditAccountPage');
    }

    getaccountDetails() {
        try {
            let oldStorage = JSON.parse(localStorage.getItem("accounts"));
            let selectedAcc = oldStorage.find(x => x.accountIndex == this.accountIndex);
            selectedAcc = JSON.stringify(selectedAcc);
            selectedAcc = JSON.parse(selectedAcc);
            this.accountName = selectedAcc.accountName;
            this.accountId = selectedAcc.accountId;
            this.secretKey = selectedAcc.secretKey;
            if(this.newImgSrc){
                this.imageSrc = this.newImgSrc;
            }else{
                this.imageSrc = selectedAcc.imageSrc;
            }
            this.accountProtectionEnable = selectedAcc.accountProtectionEnable;
            let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorage) {
                if (oldgetStorage.accountProtection == 0) {
                    this.accountProtectionEnable = false;
                }
                else {
                    if ((selectedAcc.accountProtectionEnable == true) && (oldgetStorage.accountProtection == 2)) {
                        this.accountProtectionEnable = true;
                    }
                    else if ((selectedAcc.accountProtectionEnable == true) && (oldgetStorage.accountProtection == 1)) {
                        this.accountProtectionEnable = true;
                    }
                    else {
                        this.accountProtectionEnable = false;
                    }
                }
            }
            else {
                this.accountProtectionEnable = false;
            }
        }
        catch (error) { console.log("Error occured"); }
    }

    // Update Barcode Secrect Key
    barcodeClick() {
        try {
            this.keyUpFlag = true;
            this.barcodeScanner.scan().then((barcodeData) => {
                console.log(barcodeData.text);
                if (barcodeData.text == "") {
                    let localstore = JSON.parse(localStorage.getItem("accounts"));
                    let index = localstore.findIndex(obj => obj.accountIndex == this.accountIndex);
                    this.secretKey = localstore[index].secretKey;
                    this.checkSecrekey(this.secretKey);
                }
                else if (barcodeData.text == "BACK_PRESSED") {
                    let localstore = JSON.parse(localStorage.getItem("accounts"));
                    let index = localstore.findIndex(obj => obj.accountIndex == this.accountIndex);
                    this.secretKey = localstore[index].secretKey;
                    this.checkSecrekey(this.secretKey);
                }
                else if (barcodeData.text == "BUTTON_PRESSED") {
                    let localstore = JSON.parse(localStorage.getItem("accounts"));
                    let index = localstore.findIndex(obj => obj.accountIndex == this.accountIndex);
                    this.secretKey = localstore[index].secretKey;
                    this.checkSecrekey(this.secretKey);

                }
                else if (barcodeData.text.includes("secret") == true) {
                    let newSecretKey;
                    let res = barcodeData.text.split('secret');
                    res = res[1].split('=');
                    newSecretKey = res[1];
                    if (res.length > 2) {
                        newSecretKey = newSecretKey.substring(0, newSecretKey.indexOf("&"));
                    }
                    this.secretKey = newSecretKey;
                    this.checkSecrekey(this.secretKey);
                }
                else if (barcodeData.text.includes("/") == true) {
                    let res = barcodeData.text.split('/');
                    let barcodeDataresult = res[res.length - 1];
                    this.secretKey = barcodeDataresult;
                    this.checkSecrekey(this.secretKey);
                }
                else {
                    this.secretKey = barcodeData.text;
                    this.checkSecrekey(this.secretKey);
                }
            }, (err) => {
                console.log("Error occured : " + err);
            });
        } catch (error) { console.log("Error occured"); }
    }


    // add account details function
    editAccountdetails() {
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
                this.checkSecrekey(this.secretKey);
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
                let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                let index = oldgetStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
                oldgetStorage[index].accountIndex = this.accountIndex;
                oldgetStorage[index].accountId = this.accountId.trim();
                oldgetStorage[index].accountName = this.accountName.trim();
                oldgetStorage[index].secretKey = this.secretKey.trim();
                oldgetStorage[index].imageSrc = this.imageSrc;
                oldgetStorage[index].accountProtectionEnable = this.accountProtectionEnable;
                oldgetStorage[index].accountProtectionPin = this.protectionPin;
                console.log("Error occured",oldgetStorage);
                localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                this.enableGoogleDrive();
                this.navCtrl.popToRoot();
            } catch (error) { console.log("Error occured"); }
        });
    }

    // Edit Account Form Validation
    checkAccount() {
        this.zone.run(() => {

            try {
                if (this.accountName.trim() == '') {
                    this.erroraccountName = commonString.editAccPage.erroraccountName;
                    this.flag = 0;
                }
                if (this.accountId == undefined) {
                    this.erroraccountId = commonString.editAccPage.erroraccountId;
                    this.flag = 0;
                }
                if (this.secretKey == "") {
                    this.errorSecretkey = commonString.editAccPage.errorSecretkey;
                    this.flag = 0;
                }
            }
            catch (error) { console.log("Error occured"); }

        });
    }
    onKeySecret(event) {
        try {
            this.keyUpFlag = true;
            this.checkSecrekey(this.secretKey);
        } catch (error) { console.log("Error occured"); }
    }
    checkSecrekey(secretKey) {
        try {
            this.checValidKey(secretKey);
        } catch (error) { console.log("Error occured"); }
    }

    // Check Account Name
    onKeyAccountName(event) {
        try {
            this.keyUpFlag = true;
            this.checkAccountName();
        } catch (error) { console.log("Error occured"); }
    }

    checkAccountName() {
        this.zone.run(() => {
            try {
                this.flag = 1;
                let accountName = this.accountName;
                if (accountName.length <= 0) {
                    this.erroraccountName = commonString.editAccPage.erroraccountName;
                    this.flag = 0;
                }
                else {
                    this.erroraccountName = "";
                    this.flag = 1;
                }
            } catch (error) { console.log("Error occured"); }
        });
    }

    // Check Account ID
    onKeyAccountID(event) {
        try {
            this.keyUpFlag = true;
            this.checkAccountID();
        } catch (error) { console.log("Error occured"); }
    }
    checkAccountID() {
        this.zone.run(() => {
            try {
                let accountId = this.accountId;
                this.flag = 1;
                if (accountId.length <= 0) {
                    this.erroraccountId = commonString.editAccPage.erroraccountId;
                    this.flag = 0;
                }
                else {
                    this.erroraccountId = "";
                    this.flag = 1;
                }
            } catch (error) { console.log("Error occured"); }
        });
    }
    // end
    removeItem1() {
        try {
            let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
            let index = oldgetStorage.findIndex(obj => obj.accountId == this.accountId);
            oldgetStorage.splice(index, 1);
            localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
            this.navCtrl.popToRoot();
        } catch (error) { console.log("Error occured"); }
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
        let base32chars = commonString.editAccPage.base32CharStrg;
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

    checValidKey(secretKey) {
        this.zone.run(() => {
            try {
                let epoch = Math.round(new Date().getTime() / 1000.0);
                let time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, "0");
                let hmacObj = new jsSHA(time, "HEX");
                let hmac = hmacObj.getHMAC(this.base32tohex(secretKey), "HEX", "SHA-1", "HEX");
                let offset = this.hex2dec(hmac.substring(hmac.length - 1));
                var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
                otp = (otp).substr(otp.length - 6, 6);
                this.errorSecretkey = "";
                this.flag = 1;
            } catch (error) {
                console.log("Error occured");
                this.errorSecretkey = commonString.editAccPage.errorSecretkey;
                this.flag = 0;
            }
        });
    }


    browseImgClick() {

        if (this.accountName) {
            localStorage.setItem('accName', this.accountName);
        }
        if (this.accountId) {
            localStorage.setItem('accId', this.accountId);
        }
        if (this.secretKey) {
            localStorage.setItem('barcodeResult', this.secretKey);
        }
        if (this.imageSrc) {
            localStorage.setItem('imageSrc', this.imageSrc);
        }
        this.navCtrl.push(DefaulticonPage, { 'pageName': 'editAccount', 'accountIndex': this.accountIndex });
    }



    // Delete Confirm Box code
    removeItemConfirm() {
        try {
            let alert = this.alertCtrl.create({
                title: '',
                message: commonString.editAccPage.deletAccMes,
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
                            console.log('Buy clicked');

                            let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                            let index = oldgetStorage.findIndex(obj => obj.accountId == this.accountId);
                            oldgetStorage.splice(index, 1);
                            localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                            this.navCtrl.popToRoot();
                        }
                    }
                ]
            });
            alert.present();
        } catch (error) { console.log("Error occured"); }

    }
    // end code


    // Toggle Click Function
    toggleClick() {
        this.keyUpFlag = true;
        let newacc = this.accountProtectionEnable;
        if (newacc == true) {
            let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorage) {
                if (oldgetStorage.accountProtection != 0) {
                    this.accountProtectionEnable = true;
                }
                else {
                    let alert = this.alertCtrl.create({
                        title: '',
                        message: commonString.editAccPage.toggleClickMsg,
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

                                    this.checkAccount();
                                    if (this.flag == 0) {
                                        alert.dismiss();
                                        this.accountProtectionEnable = false;
                                        return;
                                    }
                                    let oldStorage = JSON.parse(localStorage.getItem("accounts"));
                                    let selectedAcc = oldStorage.find(x => x.accountIndex == this.accountIndex);
                                    selectedAcc = JSON.stringify(selectedAcc);
                                    selectedAcc = JSON.parse(selectedAcc);
                                    this.accountName = selectedAcc.accountName;
                                    this.accountId = selectedAcc.accountId;
                                    this.secretKey = selectedAcc.secretKey;
                                    this.imageSrc = selectedAcc.imageSrc;
                                    this.accountProtectionEnable = newacc;
                                    let index = oldStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
                                    oldStorage[index].accountProtectionEnable = newacc;
                                    localStorage.setItem("accounts", JSON.stringify(oldStorage));
                                    this.enableGoogleDrive();
                                    this.navCtrl.push(SettingPage);
                                }
                            }
                        ]
                    });
                    alert.present();
                }
            }
            else {
                let alert = this.alertCtrl.create({
                    title: '',
                    message: commonString.editAccPage.toggleClickMsg,
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
                                this.checkAccount();
                                if (this.flag == 0) {
                                    alert.dismiss();
                                    this.accountProtectionEnable = false;
                                    return;
                                }
                                let oldStorage = JSON.parse(localStorage.getItem("accounts"));
                                let selectedAcc = oldStorage.find(x => x.accountIndex == this.accountIndex);
                                selectedAcc = JSON.stringify(selectedAcc);
                                selectedAcc = JSON.parse(selectedAcc);
                                this.accountName = selectedAcc.accountName;
                                this.accountId = selectedAcc.accountId;
                                this.secretKey = selectedAcc.secretKey;
                                this.imageSrc = selectedAcc.imageSrc;
                                this.accountProtectionEnable = newacc;
                                let index = oldStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
                                oldStorage[index].accountProtectionEnable = newacc;
                                localStorage.setItem("accounts", JSON.stringify(oldStorage));
                                this.enableGoogleDrive();
                                this.navCtrl.push(SettingPage);
                            }
                        }
                    ]
                });
                alert.present();
            }
        }
    }



    // account backup function 

    enableGoogleDrive() {
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

    }

    formatDateTime() {
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

    }


    CancelButton() {
        this.navCtrl.popToRoot();

    }

    userProfileClick() {
        this.navCtrl.push(UserProfilePage, { 'backTo': 'editAccount' });
    }

}





