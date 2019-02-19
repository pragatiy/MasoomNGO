import {
    Component,
    ViewChild
} from '@angular/core';
import {
    IonicPage,
    NavController,
    LoadingController,
    NavParams,
    Navbar
} from 'ionic-angular';
import {
    ActionSheetController
} from 'ionic-angular';
import {
    GeneratePinPage
} from '../generate-pin/generate-pin';

import { LicencePage } from '../licence/licence';
import { AppVersion } from '@ionic-native/app-version';

import { NativeRingtones } from '@ionic-native/native-ringtones';
import { Select } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DriveBackupPage } from '../drive-backup/drive-backup';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { UserProfilePage } from '../user-profile/user-profile';
import { commonString } from "../.././app/commonString";
/**
* Generated class for the SettingPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html',
})

export class SettingPage {

    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild('myselect') select: Select;
    accountProtection: number = 0;
    vibration: boolean = true;
    accountProtectionPin: number = 0;
    isSettingProtect = false;
    settingProtectionType = 0;
    accountProtectionName: string = "Not Set";
    PinButtonName: string = "Create";
    isRegister: string;
    isRegisterYes: boolean = false;
    MobileAppVersion: any;
    ring: String;
    toppings: any;
    isDisable: Boolean = false;
    countProtection: number;
    isEnable: String = 'Disabled';
    isRestore: Boolean = true;
    deviceId: any;
    protectionPin: any = 0;
    companyName: any;
    licenceId: any;
    A2CapiUrl: any;
    newdeviceId: any;
    fingerprint: any;
    defaultimageSrc: any;
    ISpeotection: any;
    fingerYes: boolean;
    fingerNo: boolean;
    isUserRegister: Boolean = false;
    btnDisableBio: any = 'btnDisable';
    btnDisablePin: any = 'btnDisable';


    //   MobileAppVersion:any = commonString.settingPage.MobileAppVersion;

    constructor(public restProvider: LicenceAgreementProvider, public androidFingerprintAuth: AndroidFingerprintAuth, private transfer: FileTransfer, private file: File, public navCtrl: NavController, private device: Device, private Camera: Camera, public loadingCtrl: LoadingController, public platform: Platform, public navParams: NavParams, private appVersion: AppVersion, public actionSheetCtrl: ActionSheetController, private ringtones: NativeRingtones, private alertCtrl: AlertController) {

        let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        }
        else {
            this.isUserRegister = false;
        }
        debugger;
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        let isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');
        this.deviceId = localStorage.getItem('deviceId');
        this.newdeviceId = localStorage.getItem('deviceId');

        if (oldgetStorage != undefined && oldgetStorage != null) {
            oldgetStorage.deviceId = this.deviceId;
            localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
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
        if (enableTxt) {
            this.isEnable = enableTxt;
        }

        localStorage.setItem('redirectTo', '');

        this.appVersion.getVersionNumber().then(version => {
            this.MobileAppVersion = version;
            console.log(this.MobileAppVersion);
        });

        this.ringtones.getRingtone().then((ringtones) => {
            console.log(ringtones);
            this.ring = ringtones;
        });

        platform.ready().then(() => {
            debugger;
            if (isFingerPrintEnable == 'yes') {
                this.fingerYes = true;
            }
            else {
                this.fingerNo = true;
            }
            this.androidFingerprintAuth.isAvailable()
                .then((result) => {
                    if (result.isAvailable) {
                        this.fingerprint = true;
                    } else {
                        this.fingerprint = false;
                    }
                })
                .catch(error => {
                    //alert("last cancel called ");
                    console.error(error)
                });


            platform.registerBackButtonAction(() => {
                if (this.select) {
                    this.select.close();
                }
                this.navCtrl.popToRoot();
            });
        })


    }

    ionViewDidLoad() {
        this.androidFingerprintAuth.isAvailable()
            .then((result) => {
                if (result.isAvailable) {
                    this.fingerprint = true;
                } else {
                    this.fingerprint = false;
                }
            })
            .catch(error => {
                //alert("last cancel called ");
                console.error(error)
            });


        let enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            this.isEnable = enableTxt;
        }

        let ringtoneUrl = localStorage.getItem('ringtoneUrl');
        if (ringtoneUrl) {
            this.toppings = ringtoneUrl;
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

        debugger;
        if (oldgetStorage) {
            this.vibration = oldgetStorage.vibration;
            this.isSettingProtect = oldgetStorage.isSettingProtect;

            if (oldgetStorage.accountProtection == 1) {
                this.ISpeotection = 1;
                this.accountProtectionName = "Biometric";
                this.btnDisableBio = 'btnGreen';
                this.btnDisablePin = 'btnDisable';

            }
            else if (oldgetStorage.accountProtection == 0) {
                this.accountProtectionName = "Not Set ";
                this.ISpeotection = 0;
            }
            else {
                this.accountProtectionName = "4 Digit PIN";
                this.ISpeotection = 2;
                this.btnDisableBio = 'btnDisable';
                this.btnDisablePin = 'btnGreen';
            }

            if (oldgetStorage.accountProtectionPin != 0) {
                this.accountProtection = oldgetStorage.accountProtection;
                let myObj = {
                    appicationBackup: false,
                    accountProtection: this.accountProtection,
                    accountProtectionPin: oldgetStorage.accountProtectionPin,
                    notificationSound: oldgetStorage.notificationSound,
                    vibration: this.vibration,
                    userRegister: "unregister",
                    settingProtectionType: oldgetStorage.settingProtectionType,
                    isSettingProtect: oldgetStorage.isSettingProtect,
                    deviceId: oldgetStorage.deviceId
                };
                AccountSetting(myObj);
                this.PinButtonName = "Reset";
            } else if (oldgetStorage.accountProtectionPin == 0) {

            } else {
                let myObj = {
                    appicationBackup: false,
                    accountProtection: this.accountProtection,
                    accountProtectionPin: 0,
                    notificationSound: oldgetStorage.notificationSound,
                    vibration: this.vibration,
                    userRegister: "unregister",
                    settingProtectionType: oldgetStorage.settingProtectionType,
                    isSettingProtect: oldgetStorage.isSettingProtect,
                    deviceId: oldgetStorage.deviceId
                };
                AccountSetting(myObj);
                this.PinButtonName = "Create";
            }
        } else {
            let myObj = {
                appicationBackup: false,
                accountProtection: this.accountProtection,
                accountProtectionPin: 0,
                notificationSound: "default",
                vibration: this.vibration,
                userRegister: "unregister",
                settingProtectionType: this.settingProtectionType,
                isSettingProtect: this.isSettingProtect,
                deviceId: this.deviceId
            };
            AccountSetting(myObj);
            this.PinButtonName = "Create";
        }

        console.log('deviceid did load' + this.deviceId);

    }

    // ion will enter 
    ionViewWillEnter() {
        this.androidFingerprintAuth.isAvailable()
            .then((result) => {
                if (result.isAvailable) {
                    this.fingerprint = true;
                } else {
                    this.fingerprint = false;
                }
            })
            .catch(error => {
                //alert("last cancel called ");
                console.error(error)
            });

        let enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            this.isEnable = enableTxt;
        }

        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldgetStorage.accountProtection == 1) {
            this.accountProtectionName = "Biometric";
            this.ISpeotection = 1;

        }
        else if (oldgetStorage.accountProtection == 0) {
            this.ISpeotection = 0;
            if (oldgetStorage.isSettingProtect == true) {
                this.isSettingProtect = oldgetStorage.isSettingProtect;
            }
            else {
                this.isSettingProtect = false;
            }
            this.accountProtectionName = "Not Set ";
        }
        else {
            this.ISpeotection = 2;
            if (oldgetStorage.isSettingProtect == true) {
                this.isSettingProtect = oldgetStorage.isSettingProtect;
            }
            else {
                this.isSettingProtect = false;
            }
            this.accountProtectionName = "4 Digit PIN";
        }

    }

    ionViewWillLeave() {

        console.log("page will leave ");

    }



    // get ringtone url for push notification 
    selectedRingtone(url) {

        localStorage.setItem('ringtoneUrl', url);
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        oldgetStorage.notificationSound = url;
        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        this.enableGoogleDrive();

    }




    AccountProtectionClick() {
        debugger;

        let oldtimeStamp = localStorage.getItem('oldtimeStamp');
        let actionSheet;
        this.accountProtection = 0;
        let isFingerPrintEnable = localStorage.getItem('isFingerPrintEnable');
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (isFingerPrintEnable == 'yes' && oldgetStorage.accountProtectionPin != 0) {

        } else {
            let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorage.accountProtectionPin != 0) {

                oldgetStorage.accountProtection = 2;
                oldgetStorage.settingProtectionType = 2;
                localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
                this.ISpeotection = 2;
                this.accountProtectionName = "4 Digit PIN";

            }
            else {
                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 1 });
            }
        }
        this.enableGoogleDrive();
    }




    SetProtectionClick(ISpeotection) {
        if (ISpeotection == 1) {
            this.btnDisableBio = 'btnGreen';
            this.btnDisablePin = 'btnDisable';
            let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorage.accountProtectionPin != 0) {
                this.AccountProtectionClickBIO();
            } else {
                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 5 });
            }
        }
        else if (ISpeotection == 2) {
            this.btnDisablePin = 'btnGreen';
            this.btnDisableBio = 'btnDisable';
            this.AccountProtectionClickPIN();
        }
        else {
            console.log('none');
        }
        this.enableGoogleDrive();
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
        }
        else {
            this.accountProtectionName = "4 Digit PIN";
            this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 1 });
        }
        this.enableGoogleDrive();
    }



    AccountProtectionClickBIO() {
        console.log('Biometric clicked');
        this.accountProtection = 1;
        this.accountProtectionName = "Biometric";
        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        oldgetStorage.accountProtection = 1;
        oldgetStorage.settingProtectionType = 1;
        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        this.enableGoogleDrive();

    }




    // Protection Setting Set
    protectionSetting() {
      try{
        let oldtimeStamp = localStorage.getItem('oldtimeStamp');
        let seetingpronewstate = this.isSettingProtect;
        if (seetingpronewstate == true) {
            let oldgetStorageprotect = JSON.parse(localStorage.getItem("Appsetting"));
            if (oldgetStorageprotect.accountProtection == 0) {
                debugger;
                if (oldgetStorageprotect.accountProtectionPin != 0) {
                    oldgetStorageprotect.isSettingProtect = true;
                    oldgetStorageprotect.settingProtectionType = 2;
                    localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageprotect));

                }
                else {
                    this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 2 });
                }


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


        this.enableGoogleDrive();
          } catch (error) { console.log("Error occured"); }
    }


    // Update Vibration

    updateVibrationfun() {
        let newstate = this.vibration;
        this.vibration = newstate;
        var oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        oldgetStorage.vibration = this.vibration;
        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
        this.enableGoogleDrive();
    }
    // Update AppSettings

    clickfun() {
        this.navCtrl.push(GeneratePinPage);
    }

    // open license button click
    openLicence() {
        this.navCtrl.push(LicencePage,{'status': 'no' });
    }


    openBackUpPage() {
        this.navCtrl.push(DriveBackupPage);
    }





    restoreBackup() {
     try{
        let loading = this.loadingCtrl.create({
            content: commonString.settingPage.restoreMsg,
        });
        loading.present();
        this.appVersion.getVersionCode().then(driveData => {
            loading.dismiss();
            localStorage.setItem('isFirstAppLaunch', 'Yes');
            localStorage.setItem('isEnable', 'Enabled');
            this.isEnable = 'Enabled';
            let decryptedData = window.atob(driveData)
            console.log(window.atob(driveData));
            localStorage.removeItem("UserRegisterInfo");
            let splittedBackup = decryptedData.split("splitSet", 2);
            console.log('splitted ' + splittedBackup);
            console.log('splitted 0 indexc  ' + splittedBackup[0]);
            console.log('splitted 1 indexc  ' + splittedBackup[1]);
            localStorage.setItem("accounts", splittedBackup[0]);
            let getAccountData = JSON.parse(localStorage.getItem("accounts"));
            if (getAccountData) {
                if (getAccountData.length > 0) {
                    for (let i = 0; i < getAccountData.length; i++) {
                        if (getAccountData[i].accountProtectionPin != 0) {
                            this.protectionPin = getAccountData[i].accountProtectionPin;
                            this.accountProtection = 2;
                        } else {
                            this.protectionPin = 0;
                            this.accountProtection = 0;
                        }
                        if (getAccountData[i].imageSrc != null && getAccountData[i].imageSrc != "") {
                            if (getAccountData[i].CompanyIcon != '' && getAccountData[i].CompanyIcon != undefined) {
                                // getAccountData[i].imageSrc = getAccountData[i].CompanyIcon;
                                this.companyName = getAccountData[i].companyname;
                                this.licenceId = getAccountData[i].licenseId;
                                this.A2CapiUrl = getAccountData[i].A2CapiUrl;
                                localStorage.setItem('apiUrlA2c', this.A2CapiUrl);
                                this.getUsersData();
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
                                    imageSrc: getAccountData[i].CompanyIcon,
                                    secretKey: getAccountData[i].OTPSecretKey,
                                    isRegister: false,
                                    accountIndex: 1,
                                    accountProtectionEnable: getAccountData[i].PasswordProtected,
                                    A2CapiUrl: getAccountData[i].A2CapiUrl,
                                    licenseId: getAccountData[i].licenseId,
                                    accountProtectionPin: getAccountData[i].accountProtectionPin,
                                };
                                localStorage.setItem("UserRegisterInfo", JSON.stringify(userAcc));
                            }
                        }
                    }
                }
                localStorage.setItem("accounts", JSON.stringify(getAccountData));
                if (splittedBackup[1] == undefined) {
                    let myObj = {
                        appicationBackup: false,
                        accountProtection: this.accountProtection,
                        accountProtectionPin: this.protectionPin,
                        notificationSound: "default",
                        vibration: true,
                        userRegister: "unregister",
                        settingProtectionType: 0,
                        isSettingProtect: false
                    };
                    localStorage.setItem("Appsetting", JSON.stringify(myObj));
                    this.navCtrl.popToRoot();
                } else {
                    localStorage.setItem("Appsetting", splittedBackup[1]);
                    let settingBackup = JSON.parse(localStorage.getItem("Appsetting"));
                    let oldDeviceId = settingBackup.deviceId;
                    debugger;
                    console.log('device id from backup' + settingBackup.deviceId);

                    let newDeviceBackup = JSON.parse(localStorage.getItem("Appsetting"));

                    if (this.newdeviceId != oldDeviceId) {
                        console.log("new device");
                        localStorage.setItem('ringtoneUrl', 'null');
                        if (this.fingerprint == false) {
                            if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin != 0) {
                                let alert = this.alertCtrl.create({
                                    title: '',
                                    subTitle: commonString.settingPage.biometricMsg,
                                    buttons: ['OK']
                                });
                                alert.present();
                                newDeviceBackup.accountProtection = 2;
                                newDeviceBackup.settingProtectionType = 2;
                                this.navCtrl.popToRoot();
                            }
                            else if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin == 0) {
                                debugger;
                                let alert = this.alertCtrl.create({
                                    title: '',
                                    subTitle: commonString.settingPage.biometricNfourDigi,
                                    buttons: ['OK']
                                });
                                alert.present();
                                newDeviceBackup.accountProtection = 2;
                                newDeviceBackup.settingProtectionType = 2;
                                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 3 });
                            }
                            else if (newDeviceBackup.accountProtection == 2 && newDeviceBackup.accountProtectionPin != 0) {
                                let alert = this.alertCtrl.create({
                                    title: '',
                                    subTitle: commonString.settingPage.notificationMsg,
                                    buttons: ['OK']
                                });
                                alert.present();
                                newDeviceBackup.accountProtection = 2;
                                this.navCtrl.popToRoot();

                            } else {
                                let alert = this.alertCtrl.create({
                                    title: '',
                                    subTitle:  commonString.settingPage.notificationMsg,
                                    buttons: ['OK']
                                });
                                alert.present();
                                newDeviceBackup.accountProtection = 0;
                                this.navCtrl.popToRoot();

                            }
                            localStorage.setItem("Appsetting", JSON.stringify(newDeviceBackup));
                        } else {

                            let alert = this.alertCtrl.create({
                                title: '',
                                subTitle: commonString.settingPage.notificationMsg,
                                buttons: ['OK']
                            });
                            alert.present();
                            localStorage.setItem("Appsetting", JSON.stringify(newDeviceBackup));
                            this.navCtrl.popToRoot();
                        }


                    }
                    else {

                        if (settingBackup.notificationSound != 'default') {
                            localStorage.setItem('ringtoneUrl', settingBackup.notificationSound);
                        }

                        console.log("old device");

                        if (this.fingerprint == false) {
                            if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin != 0) {

                                newDeviceBackup.accountProtection = 2;
                                newDeviceBackup.settingProtectionType = 2;
                                this.navCtrl.popToRoot();
                            } else if (newDeviceBackup.accountProtection == 1 && newDeviceBackup.accountProtectionPin == 0) {

                                newDeviceBackup.accountProtection = 2;
                                newDeviceBackup.settingProtectionType = 2;
                                this.navCtrl.push(GeneratePinPage, { settingProtectionIndex: 3 });
                            }
                            else if (newDeviceBackup.accountProtection == 2 && newDeviceBackup.accountProtectionPin != 0) {

                                newDeviceBackup.accountProtection = 2;
                                this.navCtrl.popToRoot();

                            } else {

                                newDeviceBackup.accountProtection = 0;
                                this.navCtrl.popToRoot();

                            }
                            localStorage.setItem("Appsetting", JSON.stringify(newDeviceBackup));
                        }
                        else {

                            localStorage.setItem("Appsetting", JSON.stringify(newDeviceBackup));
                            this.navCtrl.popToRoot();
                        }
                    }
                }
            }
        });
     } catch (error) { console.log("Error occured"); }
}

    // get registered user data api respoonse
  getUsersData() {
      try{
        let fileTransfer: FileTransferObject = this.transfer.create();
        this.restProvider.getUsers(this.licenceId, this.companyName).subscribe(
            (result) => {
                let resultObj = JSON.stringify(result);
                let resultData = JSON.parse(resultObj);
                console.log(resultObj);
                let sucessCode = resultData.Result.SuccessCode;
                if (sucessCode == 200) {
                    let url = resultData.Result.CompanyIcon;
                    let passwordPolicy = JSON.stringify(resultData.Result.passwordPolicy);
                    console.log('passwordPolicy' + passwordPolicy);
                    localStorage.setItem('passwordPolicy', passwordPolicy);
                    fileTransfer.download(url, this.file.dataDirectory + 'file.png').then((entry) => {
                        console.log('download complete: ' + entry.toURL());
                        this.defaultimageSrc = this.file.dataDirectory + 'file.png';
                    }, (error) => {
                        this.defaultimageSrc = resultData.Result.CompanyIcon;
                    });
                }
                else if (sucessCode == 100) {
                    let alert = this.alertCtrl.create({
                        title: '',
                        subTitle:  commonString.settingPage.errRegistrationKey,
                        buttons: ['OK']
                    });
                }
                else if (sucessCode == 400) {
                    let alert = this.alertCtrl.create({
                        title: '',
                        subTitle:  commonString.settingPage.requestFailed,
                        buttons: ['OK']
                    });
                }
                else if (sucessCode == 700) {
                    let alert = this.alertCtrl.create({
                        title: '',
                        subTitle:  commonString.settingPage.userIdMsg,
                        buttons: ['OK']
                    });
                }
                else {
                    console.log("Sucess data" + JSON.stringify(result));
                }
            },
            (error) => {
                console.log("error api" + JSON.stringify(error));

            }
        );
          } catch (error) { console.log("Error occured"); }

    }



    // account backup function 

    enableGoogleDrive() {
        debugger;
        let enableTxt = localStorage.getItem('isEnable');
        if (enableTxt) {
            if (enableTxt == 'Enabled') {
                localStorage.setItem('isEnable', 'Enabled');

                let getAccountData = JSON.parse(localStorage.getItem("accounts"));
                let totpProtection = JSON.parse(localStorage.getItem("Appsetting"));


                if (totpProtection) {
                    this.protectionPin = totpProtection.accountProtectionPin;
                    totpProtection.deviceId = this.deviceId;

                }
                if (getAccountData) {
                    if (getAccountData.length > 0) {
                        for (let i = 0; i < getAccountData.length; i++) {
                            getAccountData[i].accountProtectionPin = this.protectionPin;
                        }
                    }
                }

                localStorage.setItem("accounts", JSON.stringify(getAccountData));
                localStorage.setItem("Appsetting", JSON.stringify(totpProtection));

                let accountsString = localStorage.getItem("accounts");
                let settingsString = localStorage.getItem("Appsetting");
                let backupString = accountsString.concat('splitSet' + settingsString);

                console.log('accounts ' + accountsString);
                console.log('settings' + settingsString);
                console.log('backkup' + backupString);


                //  let getStorage = localStorage.getItem("accounts"); 
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
        this.navCtrl.push(UserProfilePage, { 'backTo': 'settings' });
    }

    FinishButton() {
        this.navCtrl.popToRoot();
    }

}

interface LabelledValue {
    appicationBackup: boolean;
    accountProtection: number;
    accountProtectionPin: number;
    notificationSound: any;
    vibration: boolean;
    userRegister: any;
    settingProtectionType: number;
    isSettingProtect: boolean;
    deviceId: any;
}

function AccountSetting(LabelledValue: LabelledValue) {
    localStorage.setItem("Appsetting", JSON.stringify(LabelledValue));
}