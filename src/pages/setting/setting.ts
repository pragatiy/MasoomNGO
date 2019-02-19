import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController, LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { GeneratePinPage } from '../generate-pin/generate-pin';
import { LicencePage } from '../licence/licence';
import { AppVersion } from '@ionic-native/app-version';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { DriveBackupPage } from '../drive-backup/drive-backup';
import { Toast } from '@ionic-native/toast';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
import { UserProfilePage } from "../user-profile/user-profile";
import { commonString } from "../.././app/commonString";
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var iCloudKV: any;
@IonicPage()
@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html',
})

export class SettingPage {

    @ViewChild(Navbar) navBar: Navbar;
    accountProtection: number = 0;
    vibration: boolean = true;
    isSettingProtect = false;
    settingProtectionType = 0;
    accountProtectionPin: number = 0;
    accountProtectionName: string = "Not Set";
    PinButtonName: string = " Create";
    isRegister: string;
    isRegisterYes: boolean = false;
    MobileAppVersion: any;
    ring: any;
    toppings: any;
    countProtection: number = 0;
    isEnable: String = 'Disabled';
    loading: any;
    uuid: any;
    file: any;
    notificationSound: any = 'default';
    ISpeotection: any;
    fingerYes: boolean = false;
    fingerNo: boolean = false;
    isUserRegister: Boolean = false;
    btnDisableBio :any = 'btnDisable';
    btnDisablePin :any = 'btnDisable';

    constructor(public restProvider: LicenceAgreementProvider, private transfer: FileTransfer, private toast: Toast, public navCtrl: NavController, public navParams: NavParams, private appVersion: AppVersion, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, private ringtones: NativeRingtones, private alertCtrl: AlertController) {

        alertdata = this.alertCtrl;
        navCtrlnew = navCtrl;
        restProviderdata = this.restProvider;
        filedata = this.file;
        transferdata = this.transfer;
        let isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');
        
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if(isFingerPrintEnable == 'yes'){
            this.fingerYes = true;

        }

        loadingdata = this.loading;
        toastdata = toast;
        this.uuid = localStorage.getItem('uuid');

        loadingdata = this.loadingCtrl.create({
            content: commonString.settingPage.icloudData,
            duration: 3000
        });

        let enableTxt = localStorage.getItem('isEnable');
        if (enableTxt == 'Enable') {
            this.isEnable = 'Enabled';
        }
        else {
            this.isEnable = 'Disabled';
        }

        localStorage.setItem('redirectTo', '');

        this.appVersion.getVersionNumber().then(version => {
            this.MobileAppVersion = version;
            console.log(JSON.stringify(this.MobileAppVersion));
        });
    }


    ionViewWillEnter() {

        let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
          this.isUserRegister = true;
        } else {
          this.isUserRegister = false;
        }

        let isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldgetStorage != undefined && oldgetStorage != null) {
            if ((isFingerPrintEnable == 'yes') && (oldgetStorage.accountProtectionPin != 0)) {
                this.fingerYes = true;
            }
            else {
                this.fingerNo = true;
            }
        }
        else {
            this.fingerNo = true;
        }

        let enableTxt = localStorage.getItem('isEnable');
        if (enableTxt == 'Enable') {
            this.isEnable = 'Enabled';
        }
        else {
            this.isEnable = 'Disabled';
        }


        this.isSettingProtect = oldgetStorage.isSettingProtect;
        if (oldgetStorage.accountProtection == 0) {
            this.ISpeotection = 0;
            this.accountProtectionName = "Not Set";
        } else if (oldgetStorage.accountProtection == 1) {
            this.ISpeotection = 1;
            this.accountProtectionName = "Biometric";
            this.btnDisableBio = 'btnGreen';
            this.btnDisablePin = 'btnDisable';
        }
        else {
            this.ISpeotection = 2;
            this.accountProtectionName = "4 Digit PIN";
            this.btnDisableBio = 'btnDisable';
            this.btnDisablePin = 'btnGreen';
       
            
        }
    }

    // logo Click
    public backbtnFun() {
        try {
            this.navCtrl.popToRoot();
        } catch (error) {
            console.log('error');
        }
    }

    userProfileClick() {
        this.navCtrl.push(UserProfilePage);
    }



    ionViewDidLoad() {
        this.ringtones.getRingtone().then((ringtones) => {

            let filterring = ringtones.filter(
                book => book.Category == "New");
            this.ring = filterring;
        });



        let Ringtone = localStorage.getItem("RingToneData");
        if (Ringtone) {
            this.toppings = Ringtone;
        }
        let userRegisterInfo = localStorage.getItem("UserRegisterInfo");
        if (userRegisterInfo) {
            this.isRegister = "Registered";
            this.isRegisterYes = true;
        }
        else {
            this.isRegister = "Not Registered";
            this.isRegisterYes = false;
        }
        this.navBar.backButtonClick = (e: UIEvent) => {
            this.navCtrl.popToRoot();
        }
        console.log('ionViewDidLoad SettingPage');
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        console.log("oldstotrage" + JSON.stringify(oldgetStorage));
        if (oldgetStorage) {
            this.vibration = oldgetStorage.vibration;
            this.isSettingProtect = oldgetStorage.isSettingProtect;
            if (oldgetStorage.accountProtection == 0) {
                this.ISpeotection = 0;
                localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
                this.accountProtectionName = "Not Set";
            }
            else if (oldgetStorage.accountProtection == 1) {
                this.ISpeotection = 1;
                this.accountProtectionName = "Biometric";
            }
            else {
                this.ISpeotection = 2;
                this.accountProtectionName = "4 Digit PIN";
            }
            if (oldgetStorage.accountProtectionPin != 0) {
                this.accountProtection = oldgetStorage.accountProtection;
                let myObj = { appicationBackup: this.isEnable, accountProtection: this.accountProtection, accountProtectionPin: oldgetStorage.accountProtectionPin, notificationSound: oldgetStorage.notificationSound, vibration: this.vibration, userRegister: "unregister", settingProtectionType: oldgetStorage.settingProtectionType, isSettingProtect: oldgetStorage.isSettingProtect, uuid: this.uuid };
                AccountSetting(myObj);
                this.PinButtonName = " Reset ";
            } else if (oldgetStorage.accountProtectionPin == 0) {
            } else {
                let myObj = { appicationBackup: this.isEnable, accountProtection: this.accountProtection, accountProtectionPin: 0, notificationSound: oldgetStorage.notificationSound, vibration: this.vibration, userRegister: "unregister", settingProtectionType: oldgetStorage.settingProtectionType, isSettingProtect: this.isSettingProtect, uuid: this.uuid };
                AccountSetting(myObj);
                this.PinButtonName = " Create";
            }
        } else {
            let myObj = { appicationBackup: this.isEnable, accountProtection: this.accountProtection, accountProtectionPin: 0, notificationSound: this.notificationSound, vibration: this.vibration, userRegister: "unregisdster", settingProtectionType: this.settingProtectionType, isSettingProtect: this.isSettingProtect, uuid: this.uuid };
            AccountSetting(myObj);
            this.PinButtonName = " Create";

        }


    }

    // Add Account Protection Method

    AccountProtectionClick() {
        let oldtimeStamp = localStorage.getItem('oldtimeStamp');
        let actionSheet;
        this.accountProtection = 0;
        let isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));

        if ((isFingerPrintEnable == 'yes') && (oldgetStorage.accountProtectionPin != 0)) {

        } else {
            let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorage.accountProtectionPin != 0) {
                oldgetStorage.accountProtection = 2;
                oldgetStorage.settingProtectionType = 2;
                localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
                this.ISpeotection = 2;
                this.accountProtectionName = "4 Digit PIN";
                this.SaveBackupData();
            }
            else {
                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 1 });
            }

        }
    }

    SetProtectionClick(ISpeotection) {
        
         debugger;

        if (ISpeotection == 1) {
            this.btnDisableBio = 'btnGreen';
            this.btnDisablePin = 'btnDisable';
       
            this.AccountProtectionClickBIO();
        }
        else if (ISpeotection == 2) {
            this.btnDisablePin = 'btnGreen';
            this.btnDisableBio = 'btnDisable';

            this.AccountProtectionClickPIN();
        }
        else {
            console.log('none');
        }
    }


    AccountProtectionClickPIN() {


        let oldtimeStamp = localStorage.getItem('oldtimeStamp');
        if (oldtimeStamp) {
            localStorage.setItem('oldtimeStamp', '');
        }
        console.log('Destructive clicked');
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldgetStorage.accountProtectionPin != 0) {
            oldgetStorage.accountProtection = 2;
            oldgetStorage.settingProtectionType = 2;
            localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
            this.accountProtectionName = "4 Digit PIN";
            this.SaveBackupData();
        }
        else {
            this.accountProtectionName = "4 Digit PIN";
            this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 1 , redirectPin: 'true'});
        }

    }

    AccountProtectionClickBIO() {
        console.log('Biometric clicked');
        this.accountProtection = 1;
        this.accountProtectionName = "Biometric";
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        oldgetStorage.accountProtection = 1;
        oldgetStorage.settingProtectionType = 1;
        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        this.SaveBackupData();
    }

    protectionSetting() {
        let oldtimeStamp = localStorage.getItem('oldtimeStamp');
        let seetingpronewstate = this.isSettingProtect;
        let isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');


        if (seetingpronewstate == true) {

            let oldgetStorageprotect = JSON.parse(localStorage.getItem("Appsetting"));

            if ((oldgetStorageprotect.accountProtectionPin == 0) && (oldgetStorageprotect.accountProtection != 1)) {
                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 2 , redirectPin: 'true'});
            }
            else {

                var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
                oldgetStorage.isSettingProtect = seetingpronewstate;
                oldgetStorage.settingProtectionType = oldgetStorage.accountProtection;
                localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
            }

        }

        else {

            var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            oldgetStorage.isSettingProtect = seetingpronewstate;
            oldgetStorage.settingProtectionType = 0;
            localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        }
        this.SaveBackupData();


    }


    // Update Vibration

    updateVibrationfun() {
        let newstate = this.vibration;
        this.vibration = newstate;
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        oldgetStorage.vibration = this.vibration;
        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        this.SaveBackupData();
    }
    // Update AppSettings

    clickfun() {
        this.navCtrl.push(GeneratePinPage, { redirectPin: 'true' });
    }

    // open license button click
    openLicence() {
        this.navCtrl.push(LicencePage, { status: false });
    }

    // Play Custone RingTone

    PlayRingtone(url) {

        localStorage.setItem("RingToneData", url);
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        oldgetStorage.notificationSound = url;
        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        this.SaveBackupData();
    }

    // Finish Button

    FinishButton(){
        try {
            this.navCtrl.popToRoot();
        } catch (error) {
            console.log('error');
        }

    }

    openBackUpPage() {
        this.navCtrl.push(DriveBackupPage);
    }

    restoreBackup() {

        if (this.isEnable == 'Enabled') {
            loadingdata.present();
            setTimeout(() => { iCloudKV.load("BaackupData", this.successCallback, this.failCallback); }, 3000);
        } else {
            loadingdata.present();
            console.log('disable');
            setTimeout(() => { iCloudKV.load("BaackupData", this.successCallback, this.failCallback); }, 3000);
        }

    }

    successCallback(returnedJSON) {
        loadingdata.dismiss();
        console.log("called load sucess function");
        localStorage.removeItem("UserRegisterInfo");
        str_array = returnedJSON.split('NOSETTING');
        let newSetting = str_array[1];
        localStorage.setItem("accounts", str_array[0]);

        deviceId = localStorage.getItem('uuid');
        let isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');

        if (newSetting == undefined) {

            SaveUserSucessData();
            let myObj = {
                appicationBackup: false,
                accountProtection: accountProtection,
                accountProtectionPin: protectionPin,
                notificationSound: "default",
                vibration: true,
                userRegister: "unregister",
                settingProtectionType: 0,
                isSettingProtect: false
            };
            localStorage.setItem("Appsetting", JSON.stringify(myObj));
            navCtrlnew.popToRoot();
        }
        else {
            localStorage.setItem("NewAppSetting", str_array[1]);
            let SettingStorage = JSON.parse(localStorage.getItem("NewAppSetting"));

            if (SettingStorage.uuid == deviceId) {

                if ((isFingerPrintEnable == 'no') && (SettingStorage.accountProtectionPin != 0)) {
                    SettingStorage.accountProtection = 2;
                    SettingStorage.settingProtectionType = 2;
                    localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));
                    localStorage.setItem("RingToneData", SettingStorage.notificationSound);
                    SaveUserSucessData();
                    navCtrlnew.popToRoot();
                }
                else if ((isFingerPrintEnable == 'no') && (SettingStorage.accountProtectionPin == 0)) {
                    SettingStorage.accountProtection = 0;
                    SettingStorage.settingProtectionType = 0;
                    SettingStorage.isSettingProtect = false;
                    localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));
                    localStorage.setItem("RingToneData", SettingStorage.notificationSound);
                    SaveUserSucessData();
                    navCtrlnew.popToRoot();

                }

                else {
                    console.log('Done Backup with same device id');
                    localStorage.setItem("Appsetting", str_array[1]);
                    localStorage.setItem("RingToneData", SettingStorage.notificationSound);
                    SaveUserSucessData();
                    navCtrlnew.popToRoot();
                }
            }
            else {

                if (SettingStorage.accountProtection == 2) {
                    localStorage.setItem("Appsetting", str_array[1]);
                    let alert = alertdata.create({
                        subTitle: commonString.settingPage.NotificationTxt,
                        buttons: ['Ok']
                    });
                    alert.present();
                    SaveUserSucessData();
                    navCtrlnew.popToRoot();
                }

                else if (SettingStorage.accountProtection == 1) {
                    if ((isFingerPrintEnable == 'yes') && (SettingStorage.accountProtection == 1)) {
                        localStorage.setItem("Appsetting", str_array[1]);
                        let alert = alertdata.create({
                            subTitle: commonString.settingPage.NotificationTxt,
                            buttons: ['Ok']
                        });
                        alert.present();
                        SaveUserSucessData();
                        navCtrlnew.popToRoot();
                    }
                    else if ((isFingerPrintEnable == 'no') && (SettingStorage.accountProtectionPin != 0)) {
                        let alert = alertdata.create({
                            subTitle: commonString.settingPage.BiometricTxt, 
                            buttons: ['Ok']
                        });
                        alert.present();
                        SettingStorage.accountProtection = 2;
                        SettingStorage.settingProtectionType = 2;
                        localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));

                        SaveUserSucessData();
                        navCtrlnew.popToRoot();
                    }

                    else if ((isFingerPrintEnable == 'no') && (SettingStorage.accountProtectionPin == 0)) {
                        try {
                            let alert = alertdata.create({
                                title: '',
                                message: commonString.settingPage.BiometricSet,
                                buttons: [
                                    {
                                        text: 'No',
                                        role: 'cancel',
                                        handler: () => {
                                            console.log('Cancel clicked');
                                            SettingStorage.accountProtection = 0;
                                            SettingStorage.settingProtectionType = 0;
                                            SettingStorage.isSettingProtect = false;
                                            localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));
                                            SaveUserSucessData();
                                            navCtrlnew.popToRoot();

                                        }
                                    },
                                    {
                                        text: 'Yes',
                                        handler: () => {
                                            console.log('Buy clicked');
                                            if (SettingStorage.isSettingProtect == true) {
                                                SettingStorage.settingProtectionType = 2;
                                                localStorage.setItem("Appsetting", JSON.stringify(SettingStorage));
                                            }
                                            SaveUserSucessData();
                                            navCtrlnew.push(GeneratePinPage, { settingProtectionIndex: 1, redirectWelcome: 'YES' });


                                        }
                                    }
                                ]
                            });
                            alert.present();
                        } catch (error) {
                            console.log('Error occured');
                        }
                    }
                    else {
                        let alert = alertdata.create({
                            subTitle: commonString.settingPage.NotificationTxt,
                            buttons: ['Ok']
                        });
                        alert.present();
                        localStorage.setItem("Appsetting", str_array[1]);
                        navCtrlnew.popToRoot();
                    }
                }

            }

        }


    }

    failCallback() {
        console.log("called load failCallback function");
        localStorage.setItem('isFirstAppLaunch', 'Yes');

    }


    SaveBackupData() {
        let enableTxt = localStorage.getItem('isEnable');
        if (enableTxt == 'Enable') {
            let getAccountData = localStorage.getItem("accounts");
            let oldgetStorageSetting = localStorage.getItem("Appsetting");
            let getStorageToDisplayval = getAccountData.concat('NOSETTING' + oldgetStorageSetting);

            iCloudKV.save("BaackupData", getStorageToDisplayval, this.saveSuccess);
        }
    }

    saveSuccess() {
        console.log("save data sucessfully");
        newtime = formatDateTime();
        localStorage.setItem('lastBackupTime', newtime);
    }
}

interface LabelledValue {
    appicationBackup: any;
    accountProtection: number;
    accountProtectionPin: number;
    notificationSound: any;
    vibration: boolean;
    userRegister: any;
    settingProtectionType: number;
    isSettingProtect: boolean;
    uuid: any;
}
function AccountSetting(LabelledValue: LabelledValue) {
    localStorage.setItem("Appsetting", JSON.stringify(LabelledValue));
}



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

function SaveUserSucessData() {
    let getAccountData = JSON.parse(localStorage.getItem("accounts"));
    if (getAccountData) {
        if (getAccountData.length > 0) {
            for (let i = 0; i < getAccountData.length; i++) {

                if (getAccountData[i].accountProtectionPin != 0) {
                    protectionPin = getAccountData[i].accountProtectionPin;
                    accountProtection = 2;
                }
                else {
                    protectionPin = 0;
                    accountProtection = 0;
                }

                //  localStorage.setItem('isEnable', 'Enable');

                if (getAccountData[i].imageSrc != null && getAccountData[i].imageSrc != "") {

                    if ((getAccountData[i].CompanyIcon != '') && (getAccountData[i].CompanyIcon != undefined)) {

                        companyNameset = getAccountData[i].companyname;
                        licenceIdset = getAccountData[i].licenseId;
                        apiUrlA2cset = getAccountData[i].apiUrlA2c;
                        localStorage.setItem('apiUrlA2c', apiUrlA2cset);

                        getUsersData();

                        let userAcc = {

                            pushPin: getAccountData[i].App_Push_Pin,
                            companyname: getAccountData[i].companyname,
                            SuccessCode: getAccountData[i].SuccessCode,
                            sessionId: getAccountData[i].sessionId,
                            tag: getAccountData[i].tag,
                            CN: getAccountData[i].CN,
                            CompanyIcon: getAccountData[i].CompanyIcon,
                            OTPSecretKey: getAccountData[i].OTPSecretKey,
                            email: getAccountData[i].email,
                            mobile: getAccountData[i].mobile,
                            name: getAccountData[i].name,
                            userName: getAccountData[i].userName,
                            accountName: getAccountData[i].CN,
                            imageSrc: getAccountData[i].imageSrc,
                            secretKey: getAccountData[i].OTPSecretKey,
                            isRegister: false,
                            accountIndex: 1,
                            accountProtectionEnable: getAccountData[i].PasswordProtected,
                            apiUrlA2c: getAccountData[i].apiUrlA2c,
                            licenseId: getAccountData[i].licenseId,
                        };
                        localStorage.setItem("UserRegisterInfo", JSON.stringify(userAcc));
                    }
                    ////

                }

            }
        }
    }
    localStorage.setItem("accounts", JSON.stringify(getAccountData));
    localStorage.setItem('isFirstAppLaunch', 'Yes');
    sessionStorage.setItem("AddEdit", "YES");

    toastdata.show(`Successfully Restored`, '3000', 'bottom').subscribe(
        toast => {
            console.log(toast);

        }
    );


}

function getUsersData() {

    const fileTransfer: FileTransferObject = transferdata.create();
    restProviderdata.getUsers(licenceIdset, companyNameset).subscribe(
        (result) => {
            let resultObj = JSON.stringify(result);
            let resultData = JSON.parse(resultObj);
            let sucessCode = resultData.Result.SuccessCode;
            if (sucessCode == 200) {
                console.log('sucess');
            } else if (sucessCode == 100) {
                let alert = alertdata.create({
                    subTitle: 'Registration key not found on the database.',
                    buttons: ['Ok']
                });
                alert.present();
            } else if (sucessCode == 400) {
                let alert = alertdata.create({
                    subTitle: 'Request Failed.',
                    buttons: ['Ok']
                });
                alert.present();
            } else if (sucessCode == 700) {
                let alert = alertdata.create({
                    subTitle: 'User ID not found.',
                    buttons: ['Ok']
                });
                alert.present();
            } else {
                console.log('Sucess data' + JSON.stringify(result));
            }
        },
        (error) => {
            console.log('error api' + JSON.stringify(error));
        }
    );


}


var toastdata;
var loadingdata;
var newtime;
var alertdata;
var navCtrlnew;
var restProviderdata;
var filedata;
var transferdata;
var companyNameset;
var licenceIdset;
var apiUrlA2cset;
var str_array;
var deviceId;
var accountProtection;
var protectionPin;


