import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { EditAccountPage } from "../edit-account/edit-account";
import { ConfirmationScreenPage } from '../confirmation-screen/confirmation-screen';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Toast } from '@ionic-native/toast';
import { PasswordPolicyPage } from '../password-policy/password-policy';
import { GenerateTotpPage } from '../generate-totp/generate-totp';
import { UserProfilePage } from "../user-profile/user-profile";

/**
 * Generated class for the GeneratePinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var iCloudKV: any;
@IonicPage()
@Component({
    selector: 'page-generate-pin',
    templateUrl: 'generate-pin.html',
})
export class GeneratePinPage {

    image1: any = 'assets/imgs/EmptyDot.png';
    image2: any = 'assets/imgs/EmptyDot.png';
    image3: any = 'assets/imgs/EmptyDot.png';
    image4: any = 'assets/imgs/EmptyDot.png';
    isUserRegister: Boolean = false;
    num: any = '';
    newpin: any = '';
    oldPIN: any = '';
    repass: any = '';
    newUserPIN: any = '';
    confirmPIN: any = '';
    userType: any = '';
    numtype = '';
    accountProtectionIndex: number;
    settingProtectionIndex: number;
    IsRegisterAcc; string;
    pageTitle: string = 'Enter your user PIN';
    pageHeading: string = 'Verify PIN';
    accountIndex: number;
    index: number;
    accountProtection: number = 0;
    vibration: boolean = true;
    accountProtectionPin: number = 0;
    accountProtectionName: string = "None";
    editpage: number;
    notification: string;
    PushFlag: string;
    PushFlagTitle: string;
    resultDataGet: any = [];
    defaultimageSrc: any;
    apiUrlA2c: any;
    licenceId: any
    accountArr: any = [];
    accountArr1: any = [];
    protectionPin: number = 0;
    uuid: any;
    redirectWelcome: any;
    accountIndexTOTP: any;
    indexTOTP: any;
    getStorageTOTP: any;
    redirectPin : any;

    constructor(private toast: Toast, private zone: NgZone, public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController, public restProvider: A2cApiProvider, private transfer: FileTransfer, private file: File) {
        this.uuid = localStorage.getItem('uuid');

        this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
        this.accountIndex = navParams.get("accountIndex");
        this.index = navParams.get("index");
        this.notification = navParams.get("notification");
        this.resultDataGet = navParams.get("resultDataGet");
        this.PushFlag = navParams.get("PushFlag");
        this.IsRegisterAcc = navParams.get("IsRegisterAcc");
        this.editpage = navParams.get("editpage");
        this.PushFlagTitle = navParams.get("PushFlagTitle");
        this.redirectWelcome = navParams.get("redirectWelcome");

        this.accountIndexTOTP = navParams.get("accountIndexTOTP");
        this.indexTOTP = navParams.get("indexTOTP");
        this.getStorageTOTP = navParams.get("getStorageTOTP");
        this.redirectPin = navParams.get("redirectPin");
        


        if (this.PushFlagTitle == "ResetPassword") {
            this.pageHeading = 'Password Reset';

        } else if (this.PushFlagTitle == "UnlockAccount") {
            this.pageHeading = 'Unlock Account';
        } else if (this.PushFlagTitle == "editAccount") {
            this.pageHeading = 'Account Settings';
        } else if (this.PushFlagTitle == "settingPage") {
            this.pageHeading = 'Settings';
        }

        else {
        }

        if (navParams.get("accountProtectionIndex") != undefined) {
            this.accountProtectionIndex = navParams.get("accountProtectionIndex");

        }


        else if (navParams.get("accountIndex") != null) {
            this.accountIndex = navParams.get("accountIndex");
        }
        else if (navParams.get("settingProtectionIndex") != undefined) {
            this.settingProtectionIndex = navParams.get("settingProtectionIndex");
        }

        else {

        }

        let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
        if (oldgetStorage != null && oldgetStorage != undefined) {
            let userProtectinPin = oldgetStorage.accountProtectionPin;
            this.oldPIN = "";
            if (userProtectinPin) {
                this.userType = 'old';
                this.numtype = 'oldpass';
            } else {
                this.userType = 'new';
                this.numtype = 'newpass';
                this.pageHeading = 'Configure PIN';
                this.pageTitle = 'Please setup a new PIN';
                
            }
        }
        else {
            let myObj = { appicationBackup: "Disabled", accountProtection: this.accountProtection, accountProtectionPin: 0, notificationSound: "default", vibration: this.vibration, userRegister: "unregister", uuid: this.uuid };
            localStorage.setItem("Appsetting", JSON.stringify(myObj));
            let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            let userProtectinPin = oldgetStorage.accountProtectionPin;
            this.oldPIN = "";
            if (userProtectinPin) {
                this.userType = 'old';
                this.numtype = 'oldpass';
            } else {
                this.userType = 'new';
                this.numtype = 'newpass';
                this.pageHeading = 'Configure PIN';
                this.pageTitle = 'Please setup a new PIN';
            }
        }


        // set the heading
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad GeneratePinPage');
        sessionStorage.setItem("AddEdit", "YES");
    }

    ionViewWillEnter() {
        let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        } else {
            this.isUserRegister = false;
        }
    }


    CheckNumber() {

        if (this.numtype == 'oldpass') {
            let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
            console.log(oldgetStorage.accountProtectionPin);
            if (oldgetStorage.accountProtectionPin == this.num) {
                let redirectTo = localStorage.getItem('redirectTo');
                if (redirectTo == 'HomePage') {
                    this.navCtrl.popToRoot();
                } else if (redirectTo == 'settingPage') {
                    this.navCtrl.push(SettingPage);
                }
                else if (redirectTo == 'HomeEditFunc') {

                    this.navCtrl.push(EditAccountPage, { accountIndex: this.accountIndex });
                }
                else if (redirectTo == 'ResetPassword') {
                    this.CallResetAPI(redirectTo);
                }
                else if (redirectTo == 'UnlockAccount') {
                    this.CallResetAPI(redirectTo);
                }
                else if (redirectTo == 'ConfirmationScreen') {
                    this.navCtrl.push(ConfirmationScreenPage, { notification: this.notification, PushFlag: this.PushFlag });
                }
                else if (redirectTo == 'HomePageTOTP') {
                    //  localStorage.setItem('redirectTo', 'TOTPprotection');
                    this.navCtrl.push(GenerateTotpPage, { accountIndexTOTP: this.accountIndexTOTP, indexTOTP: this.indexTOTP, getStorage: this.getStorageTOTP, GeneratepinPage: 'Yes' });

                    //  this.navCtrl.pop();
                }
                else {
                    this.numtype = 'newpass';
                    this.num = '';
                    this.pageHeading = 'Configure PIN';
                    this.pageTitle = 'Enter the new PIN';
                    this.btn1Click('');
                }
            } else {
                let alert = this.alertCtrl.create({
                    subTitle: 'Incorrect PIN Entered',
                    buttons: ['Try Again']

                });
                alert.present();
                this.num = '';
                this.btn1Click('');
            }
        }
        else if (this.numtype == 'newpass') {

            this.newpin = this.num;
            this.numtype = 'repass';
            this.num = '';
            this.pageHeading = 'Confirm PIN'
            this.pageTitle = 'Re-enter the new PIN';
            this.btn1Click('');
        }
        else if (this.numtype == 'repass') {
            this.repass = this.num;
            if (this.repass == this.newpin) {
                if (this.accountProtectionIndex != undefined) {
                    let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                    oldgetStorageNew.accountProtectionPin = this.repass;
                    oldgetStorageNew.accountProtection = 2;
                    oldgetStorageNew.settingProtectionType = 2;
                    localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));

                    if ((this.IsRegisterAcc == 'YES') && (this.resultDataGet != undefined)) {
                        this.defaultimageSrc = localStorage.getItem('defaultimageSrc');
                        this.licenceId = localStorage.getItem("licenseId");
                        localStorage.setItem('isRegister', 'Yes');
                        let userAcc = {
                            pushPin: this.resultDataGet.Result.App_Push_Pin,
                            companyname: this.resultDataGet.Result.companyname,
                            SuccessCode: this.resultDataGet.Result.SuccessCode,
                            sessionId: this.resultDataGet.Result.sessionId,
                            tag: this.resultDataGet.Result.tag,
                            CN: this.resultDataGet.Result.CN,
                            CompanyIcon: this.resultDataGet.Result.CompanyIcon,
                            OTPSecretKey: this.resultDataGet.Result.OTPSecretKey,
                            email: this.resultDataGet.Result.data.email,
                            mobile: this.resultDataGet.Result.data.mobile,
                            name: this.resultDataGet.Result.data.name,
                            userName: this.resultDataGet.Result.userName,
                            accountName: this.resultDataGet.Result.CN,
                            imageSrc: this.defaultimageSrc,
                            imageSrcUrl: this.resultDataGet.Result.CompanyIcon,
                            secretKey: this.resultDataGet.Result.OTPSecretKey,
                            isRegister: false,
                            accountIndex: 1,
                            accountProtectionEnable: this.resultDataGet.Result.PasswordProtected,
                            apiUrlA2c: this.apiUrlA2c,
                            licenseId: this.licenceId

                        };

                        localStorage.setItem("UserRegisterInfo", JSON.stringify(userAcc));
                        localStorage.setItem("passwordPolicy", JSON.stringify(this.resultDataGet.Result.passwordPolicy));
                        let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
                        if (oldgetStorage) {
                            if (oldgetStorage.length > 0) {
                                let index = oldgetStorage.findIndex(obj => obj.accountIndex == 1);
                                if (index == -1) {

                                } else {
                                    let oldAccount = oldgetStorage[index].pushPin;
                                    if (oldAccount) {
                                        oldgetStorage.splice(index, 1);
                                    }
                                }
                                let newarr = JSON.stringify(oldgetStorage);
                                this.accountArr1 = JSON.parse(newarr);
                                oldgetStorage.splice(0, 0, userAcc);
                                localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
                            } else {
                                userAcc.accountIndex = 1;
                                this.accountArr.push(userAcc);
                                localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                            }
                        } else {
                            this.accountArr.push(userAcc);
                            userAcc.accountIndex = 1;
                            localStorage.setItem("accounts", JSON.stringify(this.accountArr));
                        }

                        this.navCtrl.popToRoot();
                    }
                    else {
                        this.navCtrl.push(SettingPage);
                    }
                }
                else if (this.settingProtectionIndex == 2) {

                    let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                    oldgetStorageNew.accountProtectionPin = this.repass;
                    oldgetStorageNew.settingProtectionType = 2;
                    oldgetStorageNew.isSettingProtect = true;
                    oldgetStorageNew.accountProtection = 2;
                    localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                    this.navCtrl.push(SettingPage);

                }
                else if (this.settingProtectionIndex == 1) {
                    if ((this.redirectWelcome != undefined) && (this.redirectWelcome == 'YES')) {
                        let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                        oldgetStorageNew.accountProtectionPin = this.repass;
                        oldgetStorageNew.accountProtection = 2;
                        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                        this.navCtrl.popToRoot();
                    }
                    else {
                        let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                        oldgetStorageNew.accountProtectionPin = this.repass;
                        oldgetStorageNew.accountProtection = 2;
                        oldgetStorageNew.settingProtectionType = 2;
                        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                        this.navCtrl.push(SettingPage );
                    }
                }

                else {
                    let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
                    oldgetStorageNew.accountProtectionPin = this.repass;
                    if (this.accountIndex != null) {
                        oldgetStorageNew.accountProtection = 2;
                        oldgetStorageNew.settingProtectionType = 2;
                        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                        this.navCtrl.push(EditAccountPage, { accountIndex: this.accountIndex });
                    }
                    else {
                        localStorage.setItem("Appsetting", JSON.stringify(oldgetStorageNew));
                        this.navCtrl.push(SettingPage);
                    }
                }
                this.SaveBackupData();
            }
            else {

                let alert = this.alertCtrl.create({
                    subTitle: 'Incorrect PIN Entered',
                    buttons: ['Try Again']
                });
                alert.present();
                this.num = '';
                this.btn1Click('');
            }
        }

    }

    // Bck button Click 

    public backLogoClick() {
        try {
            if(this.redirectPin == 'true'){
                this.navCtrl.push(SettingPage);
            }
            else{
                this.navCtrl.popToRoot();
            }
        } catch (error) {
          console.log('error');
        }
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


    // Call Reset Password API 

    CallResetAPI(PageName) {

        if (PageName == "ResetPassword") {         
            let loading = this.loadingCtrl.create({
                content: 'Please wait...',
                duration: 5000
            });
            this.restProvider.resetPassword().subscribe(
                (result) => {
                    let resultObj = JSON.stringify(result);
                    let resultData = JSON.parse(resultObj);
                    if (resultData.Result.SuccessCode == 200) {
                        localStorage.setItem('sessionId', resultData.Result.sessionId);
                        localStorage.setItem('resetPasswordKey', resultData.Result.resetPasswordKey);
                        let passwordPolicy = localStorage.setItem('passwordPolicy', JSON.stringify(resultData.Result.passwordPolicy));

                        loading.dismiss();
                        console.log(resultData.Result.sessionId);

                    }
                    else if (resultData.Result.SuccessCode == 100) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            subTitle: 'Registration key not found on the database.',
                            buttons: ['Ok']
                        });
                        alert.present();
                    }
                    else if (resultData.Result.SuccessCode == 400) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            subTitle: 'Request Failed.',
                            buttons: ['Ok']
                        });
                        alert.present();
                    }
                    else if (resultData.Result.SuccessCode == 700) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            subTitle: 'User ID not found.',
                            buttons: ['Ok']
                        });
                        alert.present();
                    }
                    else {
                        console.log("Sucess data" + JSON.stringify(result));
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
                content: 'Please wait...',
                duration: 5000
            });
            this.restProvider.unlockAccount().subscribe(
                (result) => {
                    let resultObj = JSON.stringify(result);
                    let resultData = JSON.parse(resultObj);
                    if (resultData.Result.SuccessCode == 200) {
                        localStorage.setItem('sessionId', resultData.Result.sessionId);
                        loading.dismiss();
                    }
                    else if (resultData.Result.SuccessCode == 100) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            subTitle: 'Registration key not found on the database.',
                            buttons: ['Ok']
                        });
                        alert.present();
                    }
                    else if (resultData.Result.SuccessCode == 400) {
                        let alert = this.alertCtrl.create({
                            subTitle: 'Request Failed.',
                            buttons: ['Ok']
                        });
                        alert.present();
                    }
                    else if (resultData.Result.SuccessCode == 700) {
                        let alert = this.alertCtrl.create({
                            subTitle: 'User ID not found.',
                            buttons: ['Ok']
                        });
                        alert.present();
                    }
                    else {
                        console.log("Sucess data" + JSON.stringify(result));
                    }

                },
                (error) => {
                    console.log("error api" + JSON.stringify(error));

                }
            );
            loading.present();

        }

    }
    // end

    btn1Click(num) {
        if (num == 'delete') {
            this.num = this.num.substring(0, this.num.length - 1);
        }
        else {
            if (this.num.length >= 4) {
                return;
            } else {
                this.num += num;
            }
        }
        this.zone.run(() => {
            this.image1 = 'assets/imgs/EmptyDot.png';
            this.image2 = 'assets/imgs/EmptyDot.png';
            this.image3 = 'assets/imgs/EmptyDot.png';
            this.image4 = 'assets/imgs/EmptyDot.png';
        });
        if (this.num.length > 3) {
            this.zone.run(() => {
                this.image1 = 'assets/imgs/BlackDot.png';
                this.image2 = 'assets/imgs/BlackDot.png';
                this.image3 = 'assets/imgs/BlackDot.png';
                this.image4 = 'assets/imgs/BlackDot.png';
            });
        }
        else if (this.num.length > 2) {
            this.zone.run(() => {
                this.image1 = 'assets/imgs/BlackDot.png';
                this.image2 = 'assets/imgs/BlackDot.png';
                this.image3 = 'assets/imgs/BlackDot.png';
            });
        }
        else if (this.num.length > 1) {
            this.zone.run(() => {
                this.image1 = 'assets/imgs/BlackDot.png';
                this.image2 = 'assets/imgs/BlackDot.png';
            });
        }
        else if (this.num.length > 0) {
            this.zone.run(() => { this.image1 = 'assets/imgs/BlackDot.png'; })
        }

        if (this.num.length == 4) {
            setTimeout(() => {
                this.CheckNumber();
            }, 500);
        }
    }

    	// User Profile Page
	userProfileClick() {
		this.navCtrl.push(UserProfilePage);
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