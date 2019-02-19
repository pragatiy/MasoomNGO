import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import * as jsSHA from "jssha";
import { Platform } from 'ionic-angular';
import { commonString } from "../.././app/commonString";
import { UserProfilePage } from "../user-profile/user-profile";
import { DefaulticonPage  } from '../defaulticon/defaulticon';
/**
 * Generated class for the EditAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var iCloudKV: any;
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
    public imageSrc: any ;
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
    public newImgSrc: any;
    protectionPin: number = 0;
    isUserRegister: Boolean = false;


    constructor(public navCtrl: NavController,
        public platform: Platform,
        public navParams: NavParams,
        private barcodeScanner: BarcodeScanner,
        private file: File, private Camera: Camera,
        public actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController) 
        
        {
        localStorage.setItem('redirectTo', '');
        debugger;    
               platform.ready().then(() => {
            this.accountIndex = navParams.get('accountIndex');   
            const iconName = navParams.get('iconName');
            let imageSrc = navParams.get('imageSrc');
            console.log("imageSrc edit",imageSrc);
            if (imageSrc) {
                this.newImgSrc = imageSrc;
            }else{
                this.imageSrc = localStorage.getItem('imageSrc');
            }	    
            if (iconName) {	
                this.accountName = iconName;
                if ( this.accountName == 'other1' ||  this.accountName == 'other2' ||  this.accountName == 'other3' ||  this.accountName == 'other4'){
                this.accountName = '';
                }else{
                this.accountName = iconName;
                }
                this.imageSrc = 'assets/account_icon/' + iconName + '.png';
               

            }
        
        if (this.accountName == '') {
                this.imageSrc = 'assets/account_icon/' + iconName + '.png';  
               
        }   
        else{   
            this.imageSrc = 'assets/account_icon/' + this.accountName + '.png';
           
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
            
                if(localStorage.getItem('accountName')){
                    this.accountName= localStorage.getItem('accountName');
                }
                if(localStorage.getItem('accountId')){
                    this.accountId= localStorage.getItem('accountId');
                }
                if(localStorage.getItem('getBarcodeResult')){
                    this.secretKey= localStorage.getItem('getBarcodeResult');
                }
                if(localStorage.getItem('imageSrc')){
                    this.imageSrc= localStorage.getItem('imageSrc');
                }

               
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
        let alert = this.alertCtrl.create({
            title: '',
            message: commonString.addAccPage.alertButonMessage,
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

    }


    ionViewDidLoad() {
        // device back button event 
        this.platform.registerBackButtonAction(() => {
            this.backbuttonClick();
        });

        // app back button event 
        this.navBar.backButtonClick = (e: UIEvent) => {
            this.backbuttonClick();
        }
        console.log('ionViewDidLoad EditAccountPage');
        sessionStorage.setItem("AddEdit", "YES");
    }

    ionViewWillEnter() {
        try {
            let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
            if (registerUsered) {
                this.isUserRegister = true;
            } else {
                this.isUserRegister = false;
            }
        } catch (error) {
            console.log('error');
        }

    }

    // User Profile Method

    userProfileClick() {
        try {
            this.navCtrl.push(UserProfilePage);
        } catch (error) {
            console.log('error');
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

    CancelButton() {
        this.navCtrl.popToRoot();
       
		
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
            // this.imageSrc = selectedAcc.imageSrc;
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
        try {
            debugger;
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

            let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
            let index = oldgetStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
            oldgetStorage[index].accountIndex = this.accountIndex;
            oldgetStorage[index].accountId = this.accountId.trim();
            oldgetStorage[index].accountName = this.accountName.trim();
            oldgetStorage[index].secretKey = this.secretKey.trim();
            oldgetStorage[index].imageSrc = this.imageSrc;
            oldgetStorage[index].accountProtectionEnable = this.accountProtectionEnable;
            localStorage.setItem("accounts", JSON.stringify(oldgetStorage));

            let enableTxt = localStorage.getItem('isEnable');
            if (enableTxt == 'Enable') {
                let getAccountData = localStorage.getItem("accounts");
                let oldgetStorageSetting = localStorage.getItem("Appsetting");

                let getStorageToDisplayval = getAccountData.concat('NOSETTING' + oldgetStorageSetting);
                iCloudKV.save("BaackupData", getStorageToDisplayval, this.saveSuccess);



            }
            this.navCtrl.popToRoot();
        } catch (error) { console.log("Error occured"); }
    }

    // Edit Account Form Validation
    checkAccount() {
        try {
            if (this.accountName.trim() == '') {
                this.erroraccountName = commonString.addAccPage.erroraccountName;
                this.flag = 0;
            }
            if (this.accountId == undefined) {
                this.erroraccountId = commonString.addAccPage.erroraccountId;
                this.flag = 0;
            }
            if (this.secretKey == "") {
                this.errorSecretkey = commonString.addAccPage.errorSecretkey;
                this.flag = 0;
            }
        }
        catch (error) { console.log("Error occured"); }
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
        try {
            this.flag = 1;
            let accountName = this.accountName;
            if (accountName.length <= 0) {
                this.erroraccountName = commonString.addAccPage.erroraccountName;
                this.flag = 0;
            }
            else {
                this.erroraccountName = "";
                this.flag = 1;
            }
        } catch (error) { console.log("Error occured"); }
    }

    // Check Account ID
    onKeyAccountID(event) {
        try {
            this.keyUpFlag = true;
            this.checkAccountID();
        } catch (error) { console.log("Error occured"); }
    }
    checkAccountID() {
        try {
            let accountId = this.accountId;
            this.flag = 1;
            if (accountId.length <= 0) {
                this.erroraccountId = "Enter account id";
                this.flag = 0;
            }
            else {
                this.erroraccountId = "";
                this.flag = 1;
            }
        } catch (error) { console.log("Error occured"); }
    }

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

    checValidKey(secretKey) {
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
            this.errorSecretkey = commonString.addAccPage.invalidSecret;
            this.flag = 0;
        }
    }

    browseImgClick() {
        if(this.accountName){
            localStorage.setItem('accountName', this.accountName);
             }
             if(this.accountId){
             localStorage.setItem('accountId', this.accountId);
            }
            if(this.secretKey){
             localStorage.setItem('getBarcodeResult', this.secretKey);
             }
            if(this.imageSrc){
               localStorage.setItem('imageSrc', this.imageSrc);
             }
           this.navCtrl.push(DefaulticonPage,{'pageName':'editAccount', accountIndex: this.accountIndex});

    }

   
    // Delete Confirm Box code

    removeItemConfirm() {
        try {
            let alert = this.alertCtrl.create({
                title: '',
                message: commonString.addAccPage.deleteMessage,
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
                        message: commonString.addAccPage.settingSave,
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
                                    this.navCtrl.push(SettingPage);
                                    let enableTxt = localStorage.getItem('isEnable');
                                    if (enableTxt == 'Enable') {
                                        let getAccountData = localStorage.getItem("accounts");
                                        let oldgetStorageSetting = localStorage.getItem("Appsetting");

                                        let getStorageToDisplayval = getAccountData.concat('NOSETTING' + oldgetStorageSetting);
                                        iCloudKV.save("BaackupData", getStorageToDisplayval, this.saveSuccess);



                                    }

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
                    message: commonString.addAccPage.settingSave,
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
                                this.navCtrl.push(SettingPage);
                                let enableTxt = localStorage.getItem('isEnable');
                                if (enableTxt == 'Enable') {
                                    let getAccountData = localStorage.getItem("accounts");
                                    let oldgetStorageSetting = localStorage.getItem("Appsetting");

                                    let getStorageToDisplayval = getAccountData.concat('NOSETTING' + oldgetStorageSetting);
                                    iCloudKV.save("BaackupData", getStorageToDisplayval, this.saveSuccess);



                                }

                            }
                        }
                    ]
                });
                alert.present();

            }
        }

    }

    saveSuccess() {
        console.log("save data sucessfully");
        newtime = formatDateTime();
        localStorage.setItem('lastBackupTime', newtime);
    }

}

var newtime;

function formatDateTime() {
    let minutes: any;
    var date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var hours = date.getHours();
    minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;

    return strTime;

}