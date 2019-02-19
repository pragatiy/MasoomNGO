import {Component,NgZone,ViewChild} from '@angular/core';
import {Platform,IonicPage,App,NavController,NavParams,AlertController,LoadingController,Content} from 'ionic-angular';
import {LicenceAgreementProvider} from '../../providers/licence-agreement/licence-agreement';
import {GeneratePinPage} from '../generate-pin/generate-pin';
import {ActionSheetController} from 'ionic-angular';
import {FileTransfer,FileUploadOptions,FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import { UserProfilePage } from "../user-profile/user-profile";
import { SettingPage } from '../setting/setting';
import { HomePage } from '../home/home';



/**
 * Generated class for the LicencePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var iCloudKV: any;
@IonicPage()
@Component({
	selector: 'page-licence',
	templateUrl: 'licence.html',
})
export class LicencePage {
	@ViewChild(NavController) nav : NavController;
	@ViewChild(Content) content: Content;
	users: any;
	licenceId: any;
	companyName: any;
	isRegister: any;
	viewLicence: boolean = true;
	accountArr: any = [];
	accountArr1: any = [];
	isAccountProtectionEnable: boolean = true;
	accountProtection: number = 0;
	accountProtectionName: string = "None";
	accountProtectionPin: number = 0;
	settingProtectionType = 0;
	isSettingProtect = true;
	vibration: boolean = true;
	loading: any;
	previousUrl: any;
	defaultimageSrc: any;
	lastBackupTime: any;
	apiUrlA2c: any;
	protectionPin: number = 0;
	isUserRegister: Boolean = false;
	removeSpan:boolean = false;
	moreBtn:boolean =true;
	lessBtn:boolean = false;
	doneBtn:boolean;
	showLicense:boolean = true;

	constructor(public platform: Platform,public app:App, public navCtrl: NavController,public zone:NgZone, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public restProvider: LicenceAgreementProvider, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private transfer: FileTransfer, private file: File) {
		this.licenceId = navParams.get("licenceId");
		this.apiUrlA2c = localStorage.getItem("apiUrlA2c");
		this.companyName = navParams.get("companyName");
		this.viewLicence = navParams.get("status");
		platform.ready().then(() => {	
			this.zone.run(() => {	 
			if (this.viewLicence == undefined) {
			this.viewLicence = true;
			this.doneBtn = false;
			}else{
				this.doneBtn = true;
			}
			if(!this.licenceId && !this.companyName === true){
				this.companyName = localStorage.getItem("companyName");
				this.licenceId = localStorage.getItem("licenseId");
                
			}else{
				localStorage.setItem("licenseId", this.licenceId);
			    localStorage.setItem("companyName", this.companyName);
				
			}
			

			this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
			});
	      })
		})
	}
	ionViewDidLoad() {
		this.zone.run(() => {
		sessionStorage.setItem("AddEdit", "YES");
		});
	}

	ionViewWillEnter() {
		this.zone.run(() => {
        let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
        if (registerUsered) {
            this.isUserRegister = true;
        } else {
            this.isUserRegister = false;
		}
	});

	}



	// User Profile Method
	
	userProfileClick() {
        this.navCtrl.push(UserProfilePage);
	}

	// Back Button Click

	public backLogoClick() {
        try {			
				this.navCtrl.popToRoot();			
        } catch (error) {
          console.log('error');
        }
      }
	
	LicenceAccept() {
		let token = localStorage.getItem("token");
		if (token) {
			this.getUsersData();
		}
	}

	// Show More Click

	
	showMore() {
	this.zone.run(() => {
	  this.removeSpan = true;
	  this.moreBtn = false;
	  this.lessBtn = true;
	  this.showLicense = true;
	});
		// let accDivIndex = document.querySelector("#link");
		// accDivIndex.classList.remove('class2');
		// accDivIndex.classList.add('class1');
		// let newDiv = document.querySelector("#linkLess");
		// newDiv.classList.remove('class1');
		// newDiv.classList.add('class2');
		// let accDivIndexmore = document.querySelector("#more");
		// accDivIndexmore.classList.remove('class1');
		// accDivIndexmore.classList.add('class2');
	}




	showLess(divId) {
	this.zone.run(() => {
			this.removeSpan = false;
			this.moreBtn = true;
			this.lessBtn = false;
			this.showLicense = true;
			this.content.resize();
			// var curDivContent = document.getElementById('more').innerHTML;
			// console.log("curDivContent",curDivContent);
            // document.getElementById('more').innerHTML = curDivContent;
			// console.log("get this.file.cacheDirectory",this.file.cacheDirectory);
            // this.file.removeRecursively(this.file.cacheDirectory, 'com.authen2cate.a2cmobile').catch(err => console.log(err))
			// if(this.navCtrl.getActive().component.name == 'LicencePage'){
			// 	console.log("get activated component",this.navCtrl.getActive().component.name);
			// 	//this.navCtrl.push(LicencePage);
			// 	this.nav.setRoot(LicencePage);
			// }else{
			// 	console.log("else get activated component",this.navCtrl.getActive().component);
			// 	this.nav.setRoot(LicencePage);
			// }
		});
		// let accDivIndex = document.querySelector("#link");
		// accDivIndex.classList.remove('class1');
		// accDivIndex.classList.add('class2');

		// let newDiv = document.querySelector("#linkLess");
		// newDiv.classList.remove('class2');
		// newDiv.classList.add('class1');

		// let accDivIndexmore = document.querySelector("#more");
		// accDivIndexmore.classList.remove('class2');
		// accDivIndexmore.classList.add('class1');
	}


	CancelButton() {
		this.navCtrl.popToRoot();
		// this.nav.setRoot(HomePage);
	 }

	 
	getUsersData() {
		this.loading.present();
		const fileTransfer: FileTransferObject = this.transfer.create();
		this.restProvider.getUsers(this.licenceId, this.companyName).subscribe(
			(result) => {
				let resultObj = JSON.stringify(result);
				let resultData = JSON.parse(resultObj);
				let sucessCode = resultData.Result.SuccessCode;
				if (sucessCode == 200) {
                   
					const url = resultData.Result.CompanyIcon;
					this.getDataUri(url,resultData);

				} else if (sucessCode == 100) {
					this.loading.dismiss();
					let alert = this.alertCtrl.create({
						subTitle: 'Registration key not found on the database.',
						buttons: ['Ok']
					});
					alert.present();
				} else if (sucessCode == 400) {
					this.loading.dismiss();
					let alert = this.alertCtrl.create({
						subTitle: 'Request Failed.',
						buttons: ['Ok']
					});
					alert.present();
				} else if (sucessCode == 700) {
					this.loading.dismiss();
					let alert = this.alertCtrl.create({
						subTitle: 'User ID not found.',
						buttons: ['Ok']
					});
					alert.present();
				} else {
					this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        subTitle: 'connectivity error.',
                        buttons: ['Try again']
                    });
                    alert.present();
					console.log('Sucess data' + JSON.stringify(result));
				}
			},
			(error) => {
				console.log('error api' + JSON.stringify(error));
			}
		);

		
	}

	SaveUserData(resultData) {

		let oldgetStorageSetting = JSON.parse(localStorage.getItem("Appsetting"));
		if (oldgetStorageSetting) {
			if ((resultData.Result.PasswordProtected == true) && (oldgetStorageSetting.accountProtection == 0)) {
				this.loading.dismiss();
				this.AccountProtectionClick(resultData);
			} else {
				this.loading.dismiss();
				this.SvaeAccountData(resultData);
				this.navCtrl.popToRoot();
			}
		} else {
			this.loading.dismiss();
			this.AccountProtectionClick(resultData);
		}

		this.loading.present();
	}


	SvaeAccountData(resultData) {
		this.defaultimageSrc = localStorage.getItem('defaultimageSrc');
		localStorage.setItem('isRegister', 'Yes');
		let userAcc = {
			pushPin: resultData.Result.App_Push_Pin,
			companyname: resultData.Result.companyname,
			SuccessCode: resultData.Result.SuccessCode,
			sessionId: resultData.Result.sessionId,
			tag: resultData.Result.tag,
			CN: resultData.Result.CN,
			CompanyIcon: resultData.Result.CompanyIcon,
			OTPSecretKey: resultData.Result.OTPSecretKey,
			email: resultData.Result.data.email,
			mobile: resultData.Result.data.mobile,
			name: resultData.Result.data.name,
			userName: resultData.Result.userName,
			accountName: resultData.Result.CN,
			imageSrc: this.defaultimageSrc,
			imageSrcUrl: resultData.Result.CompanyIcon,
			secretKey: resultData.Result.OTPSecretKey,
			isRegister: false,
			accountIndex: 1,
			accountProtectionEnable: resultData.Result.PasswordProtected,
			apiUrlA2c: this.apiUrlA2c,
			licenseId: this.licenceId

		};

		localStorage.setItem("UserRegisterInfo", JSON.stringify(userAcc));	
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
				this.SaveBackupData();
			} else {
				userAcc.accountIndex = 1;
				this.accountArr.push(userAcc);
				localStorage.setItem("accounts", JSON.stringify(this.accountArr));
				this.SaveBackupData();

			}
		} else {
			this.accountArr.push(userAcc);
			userAcc.accountIndex = 1;
			localStorage.setItem("accounts", JSON.stringify(this.accountArr));
			this.SaveBackupData();

		}

	}

	AccountProtectionClick(resultData) {
		let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
		if (oldgetStorage) {
			if (oldgetStorage.accountProtectionPin != 0) {
				oldgetStorage.accountProtection = 2;
				localStorage.setItem("Appsetting", JSON.stringify(oldgetStorage));
				this.accountProtectionName = "4 Digit PIN";
				this.SvaeAccountData(resultData);
				this.navCtrl.popToRoot();
			} else {
				this.navCtrl.push(GeneratePinPage, { accountProtectionIndex: 2, IsRegisterAcc: 'YES', resultDataGet: resultData });

			}
		} else {
			this.navCtrl.push(GeneratePinPage, {
				accountProtectionIndex: 2,
				IsRegisterAcc: 'YES', resultDataGet: resultData
			});
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

	getDataUri(url,resultData) {
		this.loading.present();
		var image = new Image();
		image.onload = function () {
			var canvas = document.createElement('canvas');
			canvas.width = image.naturalWidth; 
            canvas.height = image.naturalHeight; 
			canvas.getContext('2d').drawImage(image, 0, 0);
		    localStorage.setItem('defaultimageSrc', canvas.toDataURL('image/png'));
		   
		};
		image.src = url;
		setTimeout(() => { this.SaveUserData(resultData);   }, 3000);
		
	}
	doneButton(){
		this.navCtrl.push(SettingPage);
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