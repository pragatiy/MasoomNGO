import { Component, NgZone } from '@angular/core';
import { Platform, Events, reorderArray } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { NavController, App, MenuController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { trigger, state, animate, style, transition } from '@angular/animations';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NativeAudio } from '@ionic-native/native-audio';
import { AddAccountPage } from "../add-account/add-account";
import { EditAccountPage } from "../edit-account/edit-account";
import { SettingPage } from '../setting/setting';
import { LicencePage } from '../licence/licence';
import { GeneratePinPage } from '../generate-pin/generate-pin';
import { PasswordPolicyPage } from '../password-policy/password-policy';
import { ModifyOrderPage } from '../modify-order/modify-order';
import { Vibration } from '@ionic-native/vibration';
import * as jsSHA from "jssha";
import { TouchID } from '@ionic-native/touch-id';
import { Deeplinks } from '@ionic-native/deeplinks';
import { FCM } from '@ionic-native/fcm';
import { Toast } from '@ionic-native/toast';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { ConfirmationScreenPage } from '../confirmation-screen/confirmation-screen';
import { UserProfilePage } from "../user-profile/user-profile";
import { GeneratePasswordPage } from "../generate-password/generate-password";
import { GenerateTotpPage } from '../generate-totp/generate-totp';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { WelcomePage } from '../welcome/welcome';
import { AppVersion } from '@ionic-native/app-version';
import { TranslateService } from '@ngx-translate/core';
import { IconlistPage } from '../iconlist/iconlist';
import { UnlockPage } from '../unlock/unlock';


declare var iCloudKV: any;
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
	public buttonClicked: boolean = false;
	accountIndex: any = 1;
	accountIndexOld: number = -1;
	current: number = 100;
	max: number = 100;
	radius: number;
	stroke: number;
	semicircle: boolean;
	rounded: boolean;
	clockwise: boolean;
	responsive: boolean;
	duration: number;
	animation: string;
	animationDelay: number;
	accountProtectionEnable: number;
	isTOTPopen: Boolean;
	isUserRegister: Boolean = false;
	loading: any;
	playVibration: Boolean = true;
	str: any;
	fileName: any;
	ringtonePath: any;
	str1: any;
	accountName: string = "Account Details";
	divHeight: number = 0;
	lang: any;
	issuer_accountName: any;
	issuer_logo: any;
	resaccountid: any;
	keySize: any;
	iterationCount: any;
	activeClass: any;
	reorderIsEnabled: Boolean = false;
	isenableBlock: String = 'block';

	constructor(app: App, menu: MenuController,
		public touchId: TouchID,
		public navCtrl: NavController,
		public platform: Platform,
		public navParams: NavParams,
		private barcodeScanner: BarcodeScanner,
		private nativeAudio: NativeAudio,
		private vibration: Vibration,
		private deeplinks: Deeplinks,
		private fcm: FCM,
		public restProvider: A2cApiProvider,
		private loadingCtrl: LoadingController,
		private toast: Toast,
		private ringtones: NativeRingtones,
		private alertCtrl: AlertController,
		private appVersion: AppVersion,
		private file: File,
		private zone: NgZone,
		public events: Events,
		public translate: TranslateService) {

		let policyPassword = localStorage.getItem('policyPassword');

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		this.lang = 'en';
		this.translate.setDefaultLang('en');
		this.translate.use('en');

		this.translate.get('APPLE').subscribe((res: string) => {
			console.log(res);
		});


		// Ringtone Sound

		this.ringtonePath = "assets/sound/default.mp3";
		platform.ready().then(() => {
			this.imageFunction();
			this.setDeeplinking();
			this.setPushToken();
			let getStorage = JSON.parse(localStorage.getItem("accounts"));
			this.names = getStorage;
			localStorage.setItem("accounts", JSON.stringify(getStorage));
		})

		menu.enable(true);
		let accountName = localStorage.getItem("accountsName");
		this.accountName = accountName;
		this.platform.ready().then(() => {
			this.platform.registerBackButtonAction(() => this.backbtnFuc());
			this.touchId.isAvailable()
				.then(
					res => {
						localStorage.setItem('isFingerPrintEnable', 'yes');
						console.log('TouchID is available!')
					},
					err => {
						localStorage.setItem('isFingerPrintEnable', 'no');
						console.error('TouchID is not available', err)
					}
				);


			iCloudKV.sync(syncSuccess, syncError);

			function syncSuccess(_dictionary) {
				var playerID = _dictionary['playerID'];
				var deviceUUID = _dictionary['deviceUUID'];
			}

			function syncError() {
				console.log("iCloudKVError");
			}
		})
	}


	// Set Push Notification Token

	setPushToken() {
		try {
			this.fcm.subscribeToTopic('chetu');
			this.fcm.getToken().then(token => {
				localStorage.setItem('token', token);
			});

			this.fcm.onNotification().subscribe(data => {
				this.zone.run(() => {
					if (data.wasTapped) {
						let PushFlag = localStorage.getItem("PushFlag");
						if (data.tag == "confirmUserID") {
							if (PushFlag == "RsetPasswordPush") {
								this.navCtrl.push(ConfirmationScreenPage, {
									notification: data,
									PushFlag: "RsetPasswordPush"
								});
							} else if (PushFlag == "UnlockAccountPush") {
								//this.navCtrl.push(ConfirmationScreenPage, {notification: data,PushFlag: "UnlockAccountPush"	});
								this.navCtrl.push(UnlockPage, { notification: data, PushFlag: "UnlockAccountPush" });
							} else { }
						} else if (data.tag == "resetPassword") {
						} else if (data.tag == "sendAppPush") {
							let pageName = "LoginAccountYes";
							this.CheckSecurity(data, pageName);
						} else {

						}
						console.log("Received in background");
					} else {

						let PushFlag = localStorage.getItem("PushFlag");
						let Ringtone = localStorage.getItem("RingToneData");
						if (Ringtone) {
							this.ringtones.playRingtone(Ringtone);
						} else {
							this.nativeAudio.preloadComplex('default', 'assets/sound/default.mp3', 1, 1, 0);
							console.log("Musique Play");
							this.nativeAudio.play('default', () => console.log('uniqueId1 is done playing'));
						}

						// Set vibration setting
						let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
						if (oldgetStorage) {
							this.playVibration = oldgetStorage.vibration;
							if (this.playVibration == true) {
								this.vibration.vibrate(1000);
							}
						} else {
							this.vibration.vibrate(1000);
						}
						if (data.tag == "confirmUserID") {
							if (PushFlag == "RsetPasswordPush") {
								this.navCtrl.push(ConfirmationScreenPage, {
									notification: data,
									PushFlag: "RsetPasswordPush"
								});
							} else if (PushFlag == "UnlockAccountPush") {
								//this.navCtrl.push(ConfirmationScreenPage, {notification: data,PushFlag: "UnlockAccountPush"});
								 this.navCtrl.push(UnlockPage, { notification: data, PushFlag: "UnlockAccountPush" });
							} else { }
							//} else if (data.tag == "resetPasswordPush") {

						} else if (data.tag == "resetPassword") {

							//this.navCtrl.push(GeneratePasswordPage, {notification: data});
						} else if (data.tag == "sendAppPush") {
							let pageName = "LoginAccountYes";
							this.CheckSecurity(data, pageName);
						} else { }

						console.log("Received in foreground");
					};

				});

			});

			this.fcm.onTokenRefresh().subscribe(token => {
				localStorage.setItem('token', token);
			});
			this.fcm.unsubscribeFromTopic('marketing');
		} catch (error) {
			console.log('error');
		}
	}

	// Deep Linking

	setDeeplinking() {
		try {
			this.zone.run(() => {
			this.deeplinks.route({
				'/:company/:licenceid': LicencePage,
			}).subscribe((match) => {

				let isToken = localStorage.getItem("token");
				if (isToken == null) {
					this.setPushToken();
				}
				let companyName = match.$args.company;
				let NewlicenceId = match.$args.licenceid;
				console.log('Successfully matched route', match);
				let apiUrlA2c = match.$link.host;
				localStorage.setItem('apiUrlA2c', apiUrlA2c);
				let isregistered = localStorage.getItem("isRegister");
				if (isregistered == 'Yes') {
					let OldlicenceId = localStorage.getItem("licenseId");
					if (OldlicenceId != NewlicenceId) {
						
						this.navCtrl.push(LicencePage, {
							licenceId: NewlicenceId,
							companyName: companyName
						});
					}
					else {
						let userDataGet = localStorage.getItem("UserRegisterInfo");
						if (userDataGet) {

						}
						else {
						
							this.navCtrl.push(LicencePage, { licenceId: NewlicenceId, companyName: companyName });
						}
					}
				} else {
					//this.app.getRootNav().setRoot(HomePage);
					this.navCtrl.push(LicencePage, {
						licenceId: NewlicenceId,
						companyName: companyName
					});
				}
			}, (nomatch) => {
				console.error('Got a deeplink that didn\'t match', nomatch.$link.url);
			});
		});
		} catch (error) {
			console.log('error');
		}
	}

	fingerPrintEnable(accIndex, index) {

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

		if (minutesDifference >= 2) {
			this.touchId.isAvailable()
				.then(
					res => console.log('TouchID is available!'),
					err => console.error('TouchID is not available', err)
				);

			let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
			if (oldgetStorageNew.accountProtectionPin != 0) {
				this.touchId.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel('Scan your fingerprint please', '')
					.then(
						res => {
							console.log('Ok', res);

							let date = new Date();
							let oldtimeStamp: any;
							oldtimeStamp = date.getTime();
							localStorage.setItem('oldtimeStamp', oldtimeStamp);

							this.generateTOTP(accIndex, index);
						},
						err => {
							localStorage.setItem('redirectTo', 'HomePageTOTP');
							isFirstTotp = 1;
							console.log("4 digit pin");
							localStorage.setItem('accountIndex', accIndex);
							localStorage.setItem('index', index);
							if (err.code == -1) {

								let alert = this.alertCtrl.create({
									title: '',
									message: 'Do you want to use 4 digit PIN?',
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
												this.navCtrl.push(GeneratePinPage);
												console.log('Buy clicked');
											}
										}
									]
								});
								alert.present();
							}
							else if (err.code == -8) {
								this.touchId.verifyFingerprint('Scan your fingerprint please').then(
									res => {
										console.log('Ok', res);
										let date = new Date();
										let oldtimeStamp: any;
										oldtimeStamp = date.getTime();
										localStorage.setItem('oldtimeStamp', oldtimeStamp);
										this.generateTOTP(accIndex, index);
									},
									err => {

										console.log('error' + err);
									});


							}
							else {
								let alert = this.alertCtrl.create({
									subTitle: 'You need to unlock your device with correct password to start your applicaton',
									buttons: ['Ok']
								});
								alert.present();
							}
							console.error('Error', err)
						}
					);
			}
			else {
				this.touchId.verifyFingerprint('Scan your fingerprint please')
					.then(
						res => {
							console.log('Ok', res);
							let date = new Date();
							let oldtimeStamp: any;
							oldtimeStamp = date.getTime();
							localStorage.setItem('oldtimeStamp', oldtimeStamp);
							this.generateTOTP(accIndex, index);
						},
						err => {
							console.log('error' + err);
						}
					);
			}

		} else {
			this.generateTOTP(accIndex, index);
		}
	}

	backbtnFuc() {
		this.navCtrl.popToRoot();
	}




	ionViewWillEnter() {

		//////////////// restore backup 

		let isFirstAppLaunch = localStorage.getItem('isFirstAppLaunch');
		if (isFirstAppLaunch == null || isFirstAppLaunch == undefined) {
			this.setPushToken();
			this.navCtrl.push(WelcomePage);
		}
		//////////////////////////////end 



		if (sessionStorage["AddEdit"] != undefined) {
			this.imageFunction();
			console.log("willEnter");
		}
		console.log("Storage ", sessionStorage["AddEdit"]);
	}




	imageFunction() {
		clearInterval(intervalId);
		let getAccountData = JSON.parse(localStorage.getItem("accounts"));
		if (getAccountData) {
			if (getAccountData.length > 0) {
				for (let i = 0; i < getAccountData.length; i++) {
					if (getAccountData[i].imageSrc != null && getAccountData[i].imageSrc != "") {
						getAccountData[i].imageSrc = getAccountData[i].imageSrc;
					}
				}
			}
			localStorage.setItem("accounts", JSON.stringify(getAccountData));
		}

		let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
		if (registerUsered) {
			this.isUserRegister = true;
		} else {
			this.isUserRegister = false;
		}
		this.accountIndexOld = -1;
		this.isTOTPopen = JSON.parse(localStorage.getItem("isTOTPopen"));
		let getStoragettt = JSON.parse(localStorage.getItem("accounts"));
		this.names = getStoragettt;
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
		try {
			this.zone.run(() => {
				let accDivIndex = document.querySelector("#totpdiv");
				if (accDivIndex) {
					clearInterval(intervalId);
					accDivIndex.innerHTML = '';
				}
				this.buttonClicked = !this.buttonClicked;
			});
		} catch (error) {
			console.log("Error occured");
		}
	}

	// Hide the Menu when clicks anywhere
	menuClick() {
		try {
			this.zone.run(() => {
				this.buttonClicked = false;
			});
		} catch (error) {
			console.log("Error occured");
		}


	}

	LongPressed() {
		this.reorderIsEnabled = true;
		this.isenableBlock = 'none';
	}

	// set the position of the items

	reorderItems($event) {
		this.names = reorderArray(this.names, $event);
		localStorage.setItem("accounts", JSON.stringify(this.names));
		let enableTxt = localStorage.getItem('isEnable');
		if (enableTxt == 'Enable') {
			this.events.publish('backup:icloud');
		}
		this.reorderIsEnabled = false;
		this.isenableBlock = 'block';
	}
	manualAddAccount() {
		try {

			
			this.navCtrl.push(AddAccountPage,
				{
					barcodeResult: this.getBarcodeResult,
					issuer_accountName: this.issuer_accountName,
					resaccountid: this.resaccountid
					
				});
				this.getBarcodeResult=undefined;
				this.issuer_accountName=undefined;
				this.resaccountid=undefined;

		} catch (error) {
			console.log("Error occured");
		}
	}

	public checkProtection(accountIndex: any, index) {

		//	this.navCtrl.push(GenerateTotpPage, { accountIndex: accountIndex, index: index });
		try {

			this.zone.run(() => {
				let newTOTPSet = localStorage.getItem("isgeneratedTOTP");
				if (newTOTPSet == 'true') {
					this.accountIndexOld = -1;
					localStorage.setItem("isgeneratedTOTP", 'false');
				}

				localStorage.setItem('indexvalue', index);
				

				this.zone.run(() => {
					this.accountIndex = accountIndex;
					index = index;
					let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
					localStorage.setItem('redirectTo', 'HomePageTOTP');
					let getStorage = JSON.parse(localStorage.getItem("accounts"));
					if ((getStorage[index].accountProtectionEnable) == true && (getStorage[index].accountProtectionEnable != undefined)) {
						if (oldgetStorage) {
							if (oldgetStorage.accountProtection) {
								let protectionType = oldgetStorage.accountProtection;
								if (protectionType == 2) {
									isFirstTotp = 1;
									console.log("4 digit pin");
									localStorage.setItem('accountIndex', accountIndex);
									localStorage.setItem('index', index);
									if (this.isTOTPopen == false || this.accountIndexOld != index) {
										this.navCtrl.push(GeneratePinPage, { accountIndexTOTP: accountIndex, indexTOTP: index, getStorageTOTP: getStorage });
									} else {
										this.generateTOTP(this.accountIndex, index);
									}
								} else if (protectionType == 1) {
									isFirstTotp = 1;
									console.log("Biomatrics");
									if (this.isTOTPopen == false || this.accountIndexOld != index) {
										this.fingerPrintEnable(this.accountIndex, index);
									} else {
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
					}
				});
			});
		} catch (error) {
			console.log('Error occured');
		}

	}

	public generateTOTP(accountId: any, index) {
		try {
			clearInterval(intervalId);
			let selectedAcc = this.names.find(x => x.accountIndex == accountId);
			let selectedACCinString = JSON.stringify(selectedAcc);
			let selectedACCinObj = JSON.parse(selectedACCinString);
			let getStorage = JSON.parse(localStorage.getItem("accounts"));
			let SettLocalStorage = JSON.parse(localStorage.getItem("Appsetting"));

			this.zone.run(() => {
				if (SettLocalStorage !== null && SettLocalStorage !== undefined) {
					if (SettLocalStorage.vibration == true) {
						this.vibration.vibrate(1000);
					}
				} else {
					this.vibration.vibrate(1000);
				}
				// Play Audio Sound 
				let Ringtone = localStorage.getItem("RingToneData");
				if (Ringtone !== null && Ringtone !== undefined) {
					this.ringtones.playRingtone(Ringtone);
				} else {
					this.nativeAudio.preloadComplex('default', 'assets/sound/default.mp3', 1, 1, 0);
					console.log("Musique Play");
					this.nativeAudio.play('default', () => console.log('uniqueId1 is done playing'));
				}
			});
			this.navCtrl.push(GenerateTotpPage, { accountIndexTOTP: accountId, indexTOTP: index, selectedACCinObj: selectedACCinObj, getStorage: getStorage });
			this.index = index;
			getAccountId = accountId;
			index = this.index;
			indexAccountChetu = this.index;
			//this.getOTP(selectedACCinObj, index);
		} catch (error) {
			console.log("Error occured");
		}

	}

	barcodeClick() {
		try {
			localStorage.removeItem('accountName');
			localStorage.removeItem('accountId');
			localStorage.removeItem('getBarcodeResult');
			localStorage.removeItem('imageSrc');

			this.activeClass = 'activeClassAdd';
			debugger;
			this.zone.run(() => {
			this.barcodeScanner.scan().then((barcodeData) => {
				console.log(barcodeData.text);
				if (barcodeData.text == "BACK_PRESSED") {
					this.navCtrl.popToRoot();
				} else if (barcodeData.text == "BUTTON_PRESSED") {
					localStorage.setItem('IsScanAllow', 'false');
					this.navCtrl.push(IconlistPage);
				} else if (barcodeData.text === '') {				
					localStorage.setItem('IsScanAllow', 'false');
					this.navCtrl.push(IconlistPage);
					
				}
				else {
					let newSecretKey;
					if (barcodeData.text.includes("secret") == true) {
						if ((barcodeData.text.includes('secret')) === true && (barcodeData.text.includes('issuer') === true)) {
							let resIssuer: any;
							resIssuer = decodeURIComponent(barcodeData.text);
							resIssuer = resIssuer.split('issuer');
							this.resaccountid = resIssuer[0].split(':');
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
						localStorage.setItem('IsScanAllow', 'true');
						let res = barcodeData.text.split('secret');
						res = res[1].split('=');
						newSecretKey = res[1];
						if (res.length > 2) {
							newSecretKey = newSecretKey.substring(0, newSecretKey.indexOf("&"));
						}
						this.getBarcodeResult = newSecretKey;
						this.manualAddAccount();
					} else if (barcodeData.text.includes("/") == true) {
						localStorage.setItem('IsScanAllow', 'true');
						let res = barcodeData.text.split('/');
						let barcodeDataresult = res[res.length - 1];
						this.getBarcodeResult = barcodeDataresult;
						this.manualAddAccount();
					} else {
						localStorage.setItem('IsScanAllow', 'true');
						this.getBarcodeResult = barcodeData.text;
						this.manualAddAccount();
					}
				}

			}, (err) => {
				console.log("Error occured : " + err);
				localStorage.setItem('IsScanAllow', 'false');
				//this.navCtrl.push(IconlistPage);
			});
		});
		} catch (error) {
			console.log("Error occured");
		}
	}

	

	NewClick() {

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


	// Edit Account 

	public editAccount(accountIndex: any, index) {
		localStorage.removeItem('accountName');
		localStorage.removeItem('accountId');
		localStorage.removeItem('getBarcodeResult');
		localStorage.removeItem('imageSrc');
		
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
						this.navCtrl.push(GeneratePinPage, {
							accountIndex: accountIndex, 'PushFlagTitle': 'editAccount'
						});
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

						if (minutesDifference >= 2) {
							this.touchId.isAvailable()
								.then(
									res => console.log('TouchID is available!'),
									err => console.error('TouchID is not available', err)
								);
							let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
							if (oldgetStorageNew.accountProtectionPin != 0) {
								this.touchId.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel('Scan your fingerprint please', '')
									.then(
										res => {
											console.log('Ok', res);
											let date = new Date();
											let oldtimeStamp: any;
											oldtimeStamp = date.getTime();
											localStorage.setItem('oldtimeStamp', oldtimeStamp);
									     	this.navCtrl.push(EditAccountPage, {accountIndex: accountIndex
											});
										},
										err => {
											if (err.code == -1) {

												let alert = this.alertCtrl.create({
													title: '',
													message: 'Do you want to use 4 digit PIN?',
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
																this.navCtrl.push(GeneratePinPage, {
																	accountIndex: accountIndex, 'PushFlagTitle': 'editAccount'
																});
																console.log('Buy clicked');
															}
														}
													]
												});
												alert.present();
											}
											else if (err.code == -8) {
												this.touchId.verifyFingerprint('Scan your fingerprint please').then(
													res => {
														console.log('Ok', res);
														let date = new Date();
														let oldtimeStamp: any;
														oldtimeStamp = date.getTime();
														localStorage.setItem('oldtimeStamp', oldtimeStamp);
														this.navCtrl.push(EditAccountPage, {
															accountIndex: accountIndex
														});
													},
													err => {

														console.log('error' + err);
													});


											}
											else {
												let alert = this.alertCtrl.create({
													subTitle: 'You need to unlock your device with correct password to start your applicaton',
													buttons: ['Ok']
												});
												alert.present();
											}

											console.error('Error', err);
										}
									);
							}
							else {
								this.touchId.verifyFingerprint('Scan your fingerprint please')
									.then(
										res => {
											console.log('Ok', res);
											let date = new Date();
											let oldtimeStamp: any;
											oldtimeStamp = date.getTime();
											localStorage.setItem('oldtimeStamp', oldtimeStamp);
											this.navCtrl.push(EditAccountPage, {
												accountIndex: accountIndex
											});
										},
										err => {
											console.error('Error', err);
										}
									);
							}

						} else {

							this.navCtrl.push(EditAccountPage, {
								accountIndex: accountIndex
							});
						}


					} else {
						this.navCtrl.push(EditAccountPage, {
							accountIndex: accountIndex
						});
						console.log("None");
					}
				} else {
					this.navCtrl.push(EditAccountPage, {
						accountIndex: accountIndex
					});
					console.log("accountProtection empty");
				}
			} else {
				this.navCtrl.push(EditAccountPage, {
					accountIndex: accountIndex
				});
				console.log("old storage empty");
			}
		} else {
			this.navCtrl.push(EditAccountPage, {
				accountIndex: accountIndex
			});
		}
	}


	// Modify order of accounts Click Button 
	public modifyOrder() {
		clearInterval(intervalId);
		this.hideMenu();
		this.navCtrl.push(ModifyOrderPage);
	}

	// Edit Setting

	public editSettings() {

		this.activeClass = 'activeClassSetting';


		let accDivIndex = document.querySelector("#totpdiv");
		if (accDivIndex) {
			accDivIndex.innerHTML = '';
		}
		clearInterval(intervalId);
		let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
		localStorage.setItem('redirectTo', 'settingPage');
		if (oldgetStorage !== undefined && oldgetStorage !== null) {
			if (oldgetStorage.settingProtectionType != 0 && oldgetStorage.isSettingProtect == true) {
				let protectionType = oldgetStorage.settingProtectionType;
				if (protectionType == 2) {
					console.log("4 digit pin");
					this.navCtrl.push(GeneratePinPage, { 'PushFlagTitle': 'settingPage' });
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

					if (minutesDifference >= 2) {
						this.touchId.isAvailable()
							.then(
								res => console.log('TouchID is available!'),
								err => { console.error('TouchID is not available', err) }
							);

						let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
						if (oldgetStorageNew.accountProtectionPin != 0) {

							this.touchId.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel('Scan your fingerprint please', '').then(
								res => {
									console.log('Ok', res);
									let date = new Date();
									let oldtimeStamp: any;
									oldtimeStamp = date.getTime();
									localStorage.setItem('oldtimeStamp', oldtimeStamp);
									this.navCtrl.push(SettingPage);
								},
								err => {
									if (err.code == -1) {
										let alert = this.alertCtrl.create({
											title: '',
											message: 'Do you want to use 4 digit PIN?',
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
														this.navCtrl.push(GeneratePinPage, { 'PushFlagTitle': 'settingPage' });
														console.log('Buy clicked');
													}
												}
											]
										});
										alert.present();

									}
									else if (err.code == -8) {
										this.touchId.verifyFingerprint('Scan your fingerprint please').then(
											res => {
												console.log('Ok', res);
												let date = new Date();
												let oldtimeStamp: any;
												oldtimeStamp = date.getTime();
												localStorage.setItem('oldtimeStamp', oldtimeStamp);
												this.navCtrl.push(SettingPage);
											},
											err => {
												console.log('error' + err);
											});


									}
									else {
										let alert = this.alertCtrl.create({
											subTitle: 'You need to unlock your device with correct password to start your applicaton',
											buttons: ['Ok']
										});
										alert.present();
									}

								});
						}
						else {

							this.touchId.verifyFingerprint('Scan your fingerprint please').then(
								res => {
									console.log('Ok', res);
									let date = new Date();
									let oldtimeStamp: any;
									oldtimeStamp = date.getTime();
									localStorage.setItem('oldtimeStamp', oldtimeStamp);
									this.navCtrl.push(SettingPage);
								},
								err => {
									console.log('erroe' + err);
								});

						}

						console.log("Biomatrics");
					} else {
						this.navCtrl.push(SettingPage);
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
	}


	ConfirmUser(PageName) {
		debugger;
		this.hideMenu();
		let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
		if (PageName == "ResetPassword") {
			this.activeClass = 'activeClassReset';
			localStorage.setItem('redirectTo', 'ResetPassword');
			localStorage.setItem('PushFlag', 'RsetPasswordPush');
		} else {
			this.activeClass = 'activeClassUnlock';
			localStorage.setItem('redirectTo', 'UnlockAccount');
			localStorage.setItem('PushFlag', 'UnlockAccountPush');
		}

		if (oldgetStorage) {
			if (oldgetStorage.accountProtection) {
				let protectionType = oldgetStorage.accountProtection;
				if (protectionType == 2) {
					console.log("4 digit pin");
					this.navCtrl.push(GeneratePinPage, { PushFlagTitle: PageName });
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

					if (minutesDifference >= 2) {
						this.touchId.isAvailable()
							.then(
								res => console.log('TouchID is available!'),
								err => console.error('TouchID is not available', err)
							);
						let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
						if (oldgetStorageNew.accountProtectionPin != 0) {
							this.touchId.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel('Scan your fingerprint please', '')
								.then(
									res => {
										console.log('Ok', res);

										let date = new Date();
										let oldtimeStamp: any;
										oldtimeStamp = date.getTime();
										localStorage.setItem('oldtimeStamp', oldtimeStamp);
										this.CallResetAPI(PageName);


									},
									err => {
										if (err.code == -1) {

											let alert = this.alertCtrl.create({
												title: '',
												message: 'Do you want to use 4 digit PIN?',
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
															this.navCtrl.push(GeneratePinPage, { PushFlagTitle: PageName });
															console.log('Buy clicked');
														}
													}
												]
											});
											alert.present();
										}
										else if (err.code == -8) {
											this.touchId.verifyFingerprint('Scan your fingerprint please').then(
												res => {
													console.log('Ok', res);
													let date = new Date();
													let oldtimeStamp: any;
													oldtimeStamp = date.getTime();
													localStorage.setItem('oldtimeStamp', oldtimeStamp);

													this.CallResetAPI(PageName);
												},
												err => {

													console.log('error' + err);
												});


										}
										else {
											let alert = this.alertCtrl.create({
												subTitle: 'You need to unlock your device with correct password to start your applicaton',
												buttons: ['Ok']
											});
											alert.present();
										}
										console.error('Error', err)
									}
								);
						}
						else {
							this.touchId.verifyFingerprint('Scan your fingerprint please')
								.then(
									res => {
										console.log('Ok', res);
										let date = new Date();
										let oldtimeStamp: any;
										oldtimeStamp = date.getTime();
										localStorage.setItem('oldtimeStamp', oldtimeStamp);

										this.CallResetAPI(PageName);
									},
									err => {
										console.error('Error', err)
									}
								);
						}

					} else {

						this.CallResetAPI(PageName);
					}

				} else {

					this.CallResetAPI(PageName);
					console.log("accountProtection empty");
				}
			} else {

				this.CallResetAPI(PageName);
				console.log("old storage empty");
			}
		} else {

			this.CallResetAPI(PageName);
		}
	}

	// Call Reset Password API 

	CallResetAPI(PageName) {
		debugger;
		if (PageName == "ResetPassword") {
			this.loading.present();
			this.restProvider.resetPassword().subscribe(
				(result) => {
					let resultObj = JSON.stringify(result);
					let resultData = JSON.parse(resultObj);
					if (resultData.Result.SuccessCode == 200) {
						localStorage.setItem('resetPasswordKey', resultData.Result.resetPasswordKey);
						localStorage.setItem('sessionId', resultData.Result.sessionId);
						localStorage.setItem('passwordPolicy', JSON.stringify(resultData.Result.passwordPolicy));
						this.loading.dismiss();
						console.log(resultData.Result.sessionId);
					} else if (resultData.Result.SuccessCode == 100) {
						this.loading.dismiss();
						let alert = this.alertCtrl.create({
							subTitle: 'Registration key not found on the database.',
							buttons: ['Ok']
						});
						alert.present();
					} else if (resultData.Result.SuccessCode == 400) {
						this.loading.dismiss();

						let alert = this.alertCtrl.create({
							subTitle: 'Request Failed.',
							buttons: ['Ok']
						});
						alert.present();
					} else if (resultData.Result.SuccessCode == 700) {
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
							buttons: ['Ok']
						});
						alert.present();
					}
				},
				(error) => {
					console.log("error api" + JSON.stringify(error));
				}
			);

		} else {
			this.loading.present();
			this.restProvider.unlockAccount().subscribe(
				(result) => {
					let resultObj = JSON.stringify(result);
					let resultData = JSON.parse(resultObj);

					if (resultData.Result.SuccessCode == 200) {
						localStorage.setItem('sessionId', resultData.Result.sessionId);
						this.loading.dismiss();
						console.log(resultData.Result.sessionId);

					} else if (resultData.Result.SuccessCode == 100) {
						this.loading.dismiss();
						let alert = this.alertCtrl.create({
							subTitle: 'Registration key not found on the database.',
							buttons: ['Ok']
						});
						alert.present();
					} else if (resultData.Result.SuccessCode == 400) {
						this.loading.dismiss();

						let alert = this.alertCtrl.create({
							subTitle: 'Request Failed.',
							buttons: ['Ok']
						});
						alert.present();
					} else if (resultData.Result.SuccessCode == 700) {
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
							buttons: ['Ok']
						});
						alert.present();
					}
				},
				(error) => {
					console.log("error api" + JSON.stringify(error));
				}
			);

		}
	}



	// User Profile Page

	userProfileClick() {

		  this.navCtrl.push(UserProfilePage);
		//this.navCtrl.push(UnlockPage);
	}



	// Check Security

	CheckSecurity(notification, PushFlag) {

		if (notification.responseUrl) {
			localStorage.setItem('dataResponseUrl', notification.responseUrl);
		}

		let oldgetStorage = JSON.parse(localStorage.getItem("Appsetting"));
		localStorage.setItem('redirectTo', 'ConfirmationScreen');
		if (oldgetStorage) {
			if (oldgetStorage.accountProtection) {
				let protectionType = oldgetStorage.accountProtection;
				if (protectionType == 2) {
					console.log("4 digit pin");
					this.navCtrl.push(GeneratePinPage, {
						notification: notification,
						PushFlag: PushFlag
					});
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

					if (minutesDifference >= 2) {

						this.touchId.isAvailable()
							.then(
								res => console.log('TouchID is available!'),
								err => console.error('TouchID is not available', err)
							);
						let oldgetStorageNew = JSON.parse(localStorage.getItem("Appsetting"));
						if (oldgetStorageNew.accountProtectionPin != 0) {
							this.touchId.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel('Scan your fingerprint please', '')
								.then(
									res => {
										console.log('Ok', res);
										let date = new Date();
										let oldtimeStamp: any;
										oldtimeStamp = date.getTime();
										localStorage.setItem('oldtimeStamp', oldtimeStamp);

										this.navCtrl.push(ConfirmationScreenPage, {
											notification: notification,
											PushFlag: PushFlag
										});
									},
									err => {
										if (err.code == -1) {
											let alert = this.alertCtrl.create({
												title: '',
												message: 'Do you want to use 4 digit PIN?',
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
															this.navCtrl.push(GeneratePinPage, {
																notification: notification,
																PushFlag: PushFlag
															});
															console.log('Buy clicked');
														}
													}
												]
											});
											alert.present();
										}
										else if (err.code == -8) {
											this.touchId.verifyFingerprint('Scan your fingerprint please').then(
												res => {
													console.log('Ok', res);
													let date = new Date();
													let oldtimeStamp: any;
													oldtimeStamp = date.getTime();
													localStorage.setItem('oldtimeStamp', oldtimeStamp);
													this.navCtrl.push(ConfirmationScreenPage, {
														notification: notification,
														PushFlag: PushFlag
													});
												},
												err => {

													console.log('error' + err);
												});


										}
										else {
											let alert = this.alertCtrl.create({
												subTitle: 'You need to unlock your device with correct password to start your applicaton',
												buttons: ['Ok']
											});
											alert.present();
										}
										console.error('Error', err)
									}
								);
						}
						else {
							this.touchId.verifyFingerprint('Scan your fingerprint please')
								.then(
									res => {
										console.log('Ok', res);
										let date = new Date();
										let oldtimeStamp: any;
										oldtimeStamp = date.getTime();
										localStorage.setItem('oldtimeStamp', oldtimeStamp);
										this.navCtrl.push(ConfirmationScreenPage, {
											notification: notification,
											PushFlag: PushFlag
										});
									},
									err => {
										console.error('Error', err)
									}
								);

						}
					} else {
						this.navCtrl.push(ConfirmationScreenPage, {
							notification: notification,
							PushFlag: PushFlag
						});
					}


				} else {
					this.navCtrl.push(ConfirmationScreenPage, {
						notification: notification,
						PushFlag: PushFlag
					});
					console.log("accountProtection empty");
				}
			} else {
				console.log("old storage empty");
				this.navCtrl.push(ConfirmationScreenPage, {
					notification: notification,
					PushFlag: PushFlag
				});
			}
		} else {
			this.navCtrl.push(ConfirmationScreenPage, {
				notification: notification,
				PushFlag: PushFlag
			});
		}
	}

	// Call API for Reset Password

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
				} else { }
			},
			(error) => {
				console.log("error api" + JSON.stringify(error));
			}
		);
	}

	logoClick(){
		this.reorderIsEnabled = false;
		this.isenableBlock = 'block';
	}
}



let countDown: number = 30;
var intervalId;
let indexAccountChetu: number = 0;
let globalOTP: string;
let getAccountId: any;
let isFirstTotp: number;