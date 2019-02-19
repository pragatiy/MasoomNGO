import { Component, NgZone } from '@angular/core';
import { IonicPage, NavParams, NavController,  Platform, Events } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { SettingPage } from '../setting/setting';
import * as jsSHA from "jssha";
import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';
import { commonString } from "../.././app/commonString";
import { UserProfilePage } from "../user-profile/user-profile";
import { DefaulticonPage  } from '../defaulticon/defaulticon';
/**
 * Generated class for the AddAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var iCloudKV: any;
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
	accountIndex: number = 1;
	accountArr: any = [];
	accountArr1: any = [];
	errorSecretkey: string;
	erroraccountName: string;
	erroraccountId: string;
	flag: number;
	//imageSrc: any = 'assets/imgs/user_img.png';
	imageSrc: any;
	accountProtectionEnable: Boolean = false;
	protectionSet: string = "Disable";
	isDisable: Boolean = false;
	isScan: string;
	lastBackupTime: any;
	protectionPin: number = 0;
	ScanAllow: boolean;
	isUserRegister: Boolean = false;
	newImgSrc: any;

	constructor(public events: Events,
		platform: Platform,
		public navParams: NavParams,
		private zone: NgZone,
		public navCtrl: NavController,		
		private barcodeScanner: BarcodeScanner,
		private file: File,
		private Camera: Camera,
		public actionSheetCtrl: ActionSheetController,
		private alertCtrl: AlertController,
		private toast: Toast) 
    {
		
	platform.ready().then(() => {	
				this.getBarcodeResult = navParams.get('barcodeResult');
			let issuer_accountName = navParams.get('issuer_accountName');
				this.accountId = navParams.get('resaccountid');
				const iconName = navParams.get('iconName');
				let imageSrc = navParams.get('imageSrc');
				console.log("imageSrc",imageSrc);
				
				
				if (imageSrc) {
					this.newImgSrc = imageSrc;
				}else{
					this.imageSrc = localStorage.getItem('imageSrc');
					console.log("imageSrc222",imageSrc);
				}	
			
				debugger;
					if (iconName) {	
						console.log("iconName111",iconName);
						this.accountName = iconName;
						if ( this.accountName == 'other1' ||  this.accountName == 'other2' ||  this.accountName == 'other3' ||  this.accountName == 'other4'){
						this.accountName = '';
						}else{
						this.accountName = iconName;
						}
						this.imageSrc = 'assets/account_icon/' + iconName + '.png';
					}else{
						console.log("iconNameelse",this.accountName);
						this.accountName = '';
					}
				
				if (this.accountName == '') {
					console.log("accountName",this.accountName);
						this.imageSrc = 'assets/account_icon/' + iconName + '.png';   
				}   
				else{   
					console.log("iconNameelse",this.accountName);
					this.imageSrc = 'assets/account_icon/' + this.accountName + '.png';
				}

					platform.registerBackButtonAction(() => {
						this.backbuttonClick();
					});
					this.navBar.backButtonClick = (e: UIEvent) => {
						this.backbuttonClick();
					}

					iCloudKV.load("BaackupData", successCallback, failCallback);
					function successCallback(data) {
						console.log("called load sucess function");
					}
					function failCallback() {
						console.log("called load failCallback function");
					}

					if(localStorage.getItem('accountName')){
						this.accountName= localStorage.getItem('accountName');
					 }
					 if(localStorage.getItem('accountId')){
						this.accountId= localStorage.getItem('accountId');
					 }
					 if(localStorage.getItem('getBarcodeResult')){
						this.getBarcodeResult= localStorage.getItem('getBarcodeResult');
					 }


					 if(this.newImgSrc){
						this.imageSrc = this.newImgSrc;
					}else{
						this.imageSrc = localStorage.getItem('imageSrc');
					}
                        if(issuer_accountName){
							this.accountName = issuer_accountName;
							this.imageSrc = 'assets/account_icon/' + issuer_accountName + '.png';
						}

					//  if(localStorage.getItem('imageSrc')){
					// 	this.imageSrc= localStorage.getItem('imageSrc');
					//  }
					



		})

		//Common String 
		if (this.getBarcodeResult) {
			this.pageHeading = commonString.addAccPage.pageHeadingQR;
		} else {
			this.pageHeading = commonString.addAccPage.pageHeadingManual;
		}
		
		let IsScanAllow = localStorage.getItem('IsScanAllow');
		if (IsScanAllow == 'false') {
			this.ScanAllow = false;
		}
		else {
			if (this.getBarcodeResult) {
				this.isScan = commonString.addAccPage.isRescan;
			} else {
				this.isScan = commonString.addAccPage.isScan;
			}
			this.ScanAllow = true;
		}		

	}

	// if back button is clicked without saving data

	backbuttonClick() {
		if (this.accountName || this.accountId || this.getBarcodeResult) {
			this.backbuttonAlert();
		} else {
			this.navCtrl.popToRoot();
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

	backbuttonAlert() {
		let alert = this.alertCtrl.create({
			title: '',
			message: commonString.addAccPage.alertMessage,
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
						this.addAccountCheck();
						console.log('Yes clicked');
					}
				}
			]
		});
		alert.present();

	}

	ionViewDidLoad() {
		sessionStorage.setItem("AddEdit", "YES");
		if(this.accountName){   
			this.imageSrc = 'assets/account_icon/' + this.accountName + '.png';
		}
		else if(this.newImgSrc){
			this.imageSrc = this.newImgSrc;
		}else{
			this.imageSrc = localStorage.getItem('imageSrc');
		}

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
			console.log('Error occured');
		}
	}


	// User Profile Method

	userProfileClick() {
		try {
			this.navCtrl.push(UserProfilePage);
		} catch (error) {
			console.log('Error occured');
		}
	}
	// add account details function

	addAccountCheck() {
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
			let personAcc = {
				accountId: this.accountId,
				accountName: this.accountName,
				secretKey: this.getBarcodeResult,
				accountIndex: 2,
				otpValue: '',
				imageSrc: this.imageSrc,
				accountProtectionEnable: this.accountProtectionEnable,
				isRegister: true,
			};

			let oldgetStorage = JSON.parse(localStorage.getItem('accounts'));
			personAcc.accountId = this.accountId.trim();
			personAcc.accountName = this.accountName.trim();
			personAcc.secretKey = this.getBarcodeResult.trim();

			if (oldgetStorage) {
				if (oldgetStorage.length > 0) {
					let newarr = JSON.stringify(oldgetStorage);
					this.accountArr1 = JSON.parse(newarr);
					let maxId = Math.max.apply(Math, this.accountArr1.map(function (item) {
						return item.accountIndex;
					})) + 1;
					personAcc.accountIndex = maxId;
					oldgetStorage.push(personAcc);
					localStorage.setItem('accounts', JSON.stringify(oldgetStorage));
					let enableTxt = localStorage.getItem('isEnable');
					if (enableTxt == 'Enable') {
						this.events.publish('backup:icloud');
					}
					this.toast.show(commonString.addAccPage.accountAdd, '500', 'bottom').subscribe(
						toast => {
							console.log(toast);
						}
					);
					this.navCtrl.popToRoot();
				} else {
					personAcc.accountIndex = 2;
					this.accountArr.push(personAcc);
					localStorage.setItem('accounts', JSON.stringify(this.accountArr));
					let enableTxt = localStorage.getItem('isEnable');
					if (enableTxt == 'Enable') {
						this.events.publish('backup:icloud');
					}
					this.toast.show(commonString.addAccPage.accountAdd, '500', 'bottom').subscribe(
						toast => {
							console.log(toast);
						}
					);
					this.navCtrl.popToRoot();

				}
			} else {
				personAcc.accountIndex = 2;
				this.accountArr.push(personAcc);
				localStorage.setItem('accounts', JSON.stringify(this.accountArr));
				let enableTxt = localStorage.getItem('isEnable');
				if (enableTxt == 'Enable') {
					this.events.publish('backup:icloud');
				}
				this.toast.show(commonString.addAccPage.accountAdd, '500', 'bottom').subscribe(
					toast => {
						console.log(toast);
					}
				);
				this.navCtrl.popToRoot();
			}

			localStorage.removeItem('accountName');
			localStorage.removeItem('accountId');
			localStorage.removeItem('getBarcodeResult');
			localStorage.removeItem('imageSrc');
		} catch (error) {
			console.log('Error occured');
		}

	}


	// Form Validation 

	checkAccount() {
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
		} catch (error) {
			console.log('Error occured');
		}
	}

	onKeySecret(event) {
		try {
			this.checkSecrekey(this.getBarcodeResult);
		} catch (error) {
			console.log('Error occured');
		}
	}

	checkSecrekey(getBarcodeResult) {
		try {

			this.checValidKey(getBarcodeResult);
		} catch (error) {
			console.log('Error occured');
		}

	}


	// Check Account Name
	onKeyAccountName(event) {
		this.checkAccountName();
	}
	checkAccountName() {
		try {
			let accountName = this.accountName;
			this.flag = 1;
			if (accountName.length <= 0) {
				this.erroraccountName = commonString.addAccPage.erroraccountName;
				this.flag = 0;
			} else {
				this.erroraccountName = '';
				this.flag = 1;
			}
		} catch (error) {
			console.log('Error occured');
		}
	}

	// Check Account ID
	onKeyAccountID(event) {
		this.checkAccountID();
	}

	checkAccountID() {
		try {
			let accountId = this.accountId;
			this.flag = 1;

			if (accountId.length <= 0) {
				this.erroraccountId = commonString.addAccPage.erroraccountId;
				this.flag = 0;
			} else {
				this.erroraccountId = '';
				this.flag = 1;
			}
		} catch (error) {
			console.log('Error occured');
		}
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

	checValidKey(getBarcodeResult) {
		try {

			let epoch = Math.round(new Date().getTime() / 1000.0);
			let time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, "0");
			let hmacObj = new jsSHA(time, "HEX");
			let hmac = hmacObj.getHMAC(this.base32tohex(getBarcodeResult), "HEX", "SHA-1", "HEX");
			let offset = this.hex2dec(hmac.substring(hmac.length - 1));
			var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
			otp = (otp).substr(otp.length - 6, 6);

			this.errorSecretkey = '';
			this.flag = 1;
		} catch (error) {
			console.log('Error occured');
			this.errorSecretkey = 'Invalid Secret Key';
			this.flag = 0;

		}
	}

	// Browse Image  Code

	browseImgClick() {	
		if(this.accountName){
       localStorage.setItem('accountName', this.accountName);
		}
		if(this.accountId){
	    localStorage.setItem('accountId', this.accountId);
	   }
	   if(this.getBarcodeResult){
		localStorage.setItem('getBarcodeResult', this.getBarcodeResult);
        }
       if(this.imageSrc){
      	localStorage.setItem('imageSrc', this.imageSrc);
        }
      this.navCtrl.push(DefaulticonPage,{'pageName':'addAccount'});

	}	

	barcodeClick() {
		debugger;
		try {
			this.barcodeScanner.scan().then((barcodeData) => {
				console.log(barcodeData.text);
				if (barcodeData.text) {
					this.isScan = 'RESCAN';
				} else {
					this.isScan = 'SCAN';
				}
				let newSecretKey;
				if (barcodeData.text.includes("secret") == true) {
					let res = barcodeData.text.split('secret');
					res = res[1].split('=');
					newSecretKey = res[1];
					if (res.length > 2) {
						newSecretKey = newSecretKey.substring(0, newSecretKey.indexOf("&"));
					}
					this.getBarcodeResult = newSecretKey;
					this.checkSecrekey(this.getBarcodeResult);

				} else if (barcodeData.text == 'BACK_PRESSED') {
					this.getBarcodeResult = '';
					this.checkSecrekey(this.getBarcodeResult);
				} else if (barcodeData.text == 'BUTTON_PRESSED') {
					this.getBarcodeResult = '';
					this.checkSecrekey(this.getBarcodeResult);

				} else if (barcodeData.text.includes("/") == true) {

					let res = barcodeData.text.split('/');
					let barcodeDataresult = res[res.length - 1];
					this.getBarcodeResult = barcodeDataresult;
					this.checkSecrekey(this.getBarcodeResult);
				} else {
					this.getBarcodeResult = barcodeData.text;
					this.checkSecrekey(this.getBarcodeResult);
				}

			}, (err) => {
				console.log("Error occured : " + err);
			});
		} catch (error) {
			console.log('Error occured');
		}
	}

	//Account Protection Click

	toggleClick() {
		let newacc = this.accountProtectionEnable;
		if (newacc == true) {
			let oldgetStorage = JSON.parse(localStorage.getItem('Appsetting'));
			if (oldgetStorage) {
				if (oldgetStorage.accountProtection != 0) {
					this.protectionSet = 'Enable';
				} else {
					try {
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
											isRegister: true
										};

										let oldgetStorage = JSON.parse(localStorage.getItem('accounts'));
										personAcc.accountId = this.accountId.trim();
										personAcc.accountName = this.accountName.trim();
										personAcc.secretKey = this.getBarcodeResult.trim();


										if (oldgetStorage) {

											if (oldgetStorage.length > 0) {

												let newarr = JSON.stringify(oldgetStorage);
												this.accountArr1 = JSON.parse(newarr);
												let maxId = Math.max.apply(Math, this.accountArr1.map(function (item) {
													return item.accountIndex;
												})) + 1;
												personAcc.accountIndex = maxId;
												oldgetStorage.push(personAcc);
												localStorage.setItem('accounts', JSON.stringify(oldgetStorage));
												let enableTxt = localStorage.getItem('isEnable');
												if (enableTxt == 'Enable') {
													this.events.publish('backup:icloud');

												}

												this.toast.show(commonString.addAccPage.accountAdd, '500', 'bottom').subscribe(
													toast => {
														console.log(toast);
													}
												);
													
												localStorage.removeItem('accountName');
												localStorage.removeItem('accountId');
												localStorage.removeItem('getBarcodeResult');
												localStorage.removeItem('imageSrc');
												this.navCtrl.push(SettingPage);
											} else {
												personAcc.accountIndex = 2;
												this.accountArr.push(personAcc);
												localStorage.setItem('accounts', JSON.stringify(this.accountArr));

												let enableTxt = localStorage.getItem('isEnable');
												if (enableTxt == 'Enable') {
													this.events.publish('backup:icloud');
												}
												this.toast.show(commonString.addAccPage.accountAdd, '500', 'bottom').subscribe(
													toast => {
														console.log(toast);
													}
												);
												localStorage.removeItem('accountName');
												localStorage.removeItem('accountId');
												localStorage.removeItem('getBarcodeResult');
												localStorage.removeItem('imageSrc');
												this.navCtrl.push(SettingPage);

											}
										} else {

											personAcc.accountIndex = 2;
											this.accountArr.push(personAcc);
											localStorage.setItem('accounts', JSON.stringify(this.accountArr));

											let enableTxt = localStorage.getItem('isEnable');
											if (enableTxt == 'Enable') {
												this.events.publish('backup:icloud');
											}
											this.toast.show(commonString.addAccPage.accountAdd, '500', 'bottom').subscribe(
												toast => {
													console.log(toast);
												}
											);
											localStorage.removeItem('accountName');
											localStorage.removeItem('accountId');
											localStorage.removeItem('getBarcodeResult');
											localStorage.removeItem('imageSrc');
											this.navCtrl.push(SettingPage);
										}
									}
								}
							]
						});
						alert.present();
					} catch (error) {
						console.log('Error occured');
					}
				}
			} else {
				try {
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
										isRegister: true
									};

									let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
									personAcc.accountId = this.accountId.trim();
									personAcc.accountName = this.accountName.trim();
									personAcc.secretKey = this.getBarcodeResult.trim();

									if (oldgetStorage) {
										if (oldgetStorage.length > 0) {
											let newarr = JSON.stringify(oldgetStorage);
											this.accountArr1 = JSON.parse(newarr);
											let maxId = Math.max.apply(Math, this.accountArr1.map(function (item) {
												return item.accountIndex;
											})) + 1;
											personAcc.accountIndex = maxId;
											oldgetStorage.push(personAcc);
											localStorage.setItem("accounts", JSON.stringify(oldgetStorage));

											let enableTxt = localStorage.getItem('isEnable');
											if (enableTxt == 'Enable') {
												this.events.publish('backup:icloud');
											}
											this.toast.show(commonString.addAccPage.accountAdd, '500', 'bottom').subscribe(
												toast => {
													console.log(toast);
												}
											);
											localStorage.removeItem('accountName');
											localStorage.removeItem('accountId');
											localStorage.removeItem('getBarcodeResult');
											localStorage.removeItem('imageSrc');
											this.navCtrl.push(SettingPage);
										} else {
											personAcc.accountIndex = 2;
											this.accountArr.push(personAcc);
											localStorage.setItem('accounts', JSON.stringify(this.accountArr));
											let enableTxt = localStorage.getItem('isEnable');
											if (enableTxt == 'Enable') {
												this.events.publish('backup:icloud');

											}
											this.toast.show(commonString.addAccPage.accountAdd, '500', 'bottom').subscribe(
												toast => {
													console.log(toast);
												}
											);
											localStorage.removeItem('accountName');
											localStorage.removeItem('accountId');
											localStorage.removeItem('getBarcodeResult');
											localStorage.removeItem('imageSrc');
											this.navCtrl.push(SettingPage);

										}
									} else {
										personAcc.accountIndex = 2;
										this.accountArr.push(personAcc);
										localStorage.setItem('accounts', JSON.stringify(this.accountArr));

										let enableTxt = localStorage.getItem('isEnable');
										if (enableTxt == 'Enable') {
											this.events.publish('backup:icloud');
										}
										this.toast.show(commonString.addAccPage.accountAdd, '500', 'bottom').subscribe(
											toast => {
												console.log(toast);
											}
										);
										localStorage.removeItem('accountName');
										localStorage.removeItem('accountId');
										localStorage.removeItem('getBarcodeResult');
										localStorage.removeItem('imageSrc');
										this.navCtrl.push(SettingPage);
									}
								}
							}
						]
					});
					alert.present();
				} catch (error) {
					console.log('Error occured');
				}

				this.protectionSet = 'Disable';
			}
		} else {
			this.protectionSet = 'Disable';
		}
	}

	saveSuccess() {
		console.log("save data sucessfully");
		newtime = formatDateTime();
		localStorage.setItem('lastBackupTime', newtime);
	}
	// Cancel Button 

	CancelButton() {
		localStorage.removeItem('accountName');
		localStorage.removeItem('accountId');
		localStorage.removeItem('getBarcodeResult');
		localStorage.removeItem('imageSrc');
		this.navCtrl.popToRoot();
	
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
	hours = hours ? hours : 12; // the hour '0' should be '12'    
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;

	return strTime;
}