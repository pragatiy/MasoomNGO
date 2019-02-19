import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { AlertController } from 'ionic-angular';
import { commonString } from "../.././app/commonString";


@IonicPage()
@Component({
    selector: 'page-confirm-user',
    templateUrl: 'confirm-user.html',
})
export class ConfirmUserPage {

    userId: any;
    erroruserId: String;
    PageName: String;
    pageTitle: String;

    constructor(public navCtrl: NavController,
        private alertCtrl: AlertController,
        public navParams: NavParams,
        public restProvider: A2cApiProvider,
        private loadingCtrl: LoadingController) {
        this.PageName = navParams.get('PageName');
        if (this.PageName == 'ResetPassword') {
            this.pageTitle = 'Reset Password';
        } else {
            this.pageTitle = 'Unlock Account';
        }

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConfirmUserPage');
    }

    // call Redirect To Page

    RedirectToPage() {
        if (this.PageName == 'ResetPassword') {
            this.ResetUserPassword();
        } else {
            this.UnlockUserAccount();
        }
    }

    // Call API for Reset Password
    ResetUserPassword() {
        try{
        if ((this.userId == undefined) || (this.userId == '')) {
            this.erroruserId = 'Please enter user id';
        } else {
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
                        loading.dismiss();
                        console.log(resultData.Result.sessionId);
                    } else if (resultData.Result.SuccessCode == 100) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.confirmUserPage.regKeyErr,
                            buttons: ['OK']
                        });
                        alert.present();

                    } else if (resultData.Result.SuccessCode == 400) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.confirmUserPage.reqFailedErr,
                            buttons: ['OK']
                        });
                        alert.present();
                    } else if (resultData.Result.SuccessCode == 700) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.confirmUserPage.userIdErr,
                            buttons: ['OK']
                        });
                        alert.present();
                    } else {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.confirmUserPage.unknownErr,
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                },
                (error) => {
                    console.log('error api' + JSON.stringify(error));
                });
            loading.present();
        }
        } catch (error) { console.log("Error occured",error); }
    }
    // End


    // Call API for Reset Password
    UnlockUserAccount() {
        try{
        if ((this.userId == undefined) || (this.userId == '')) {
            this.erroruserId = 'Please enter user id';
        } else {
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
                        console.log(resultData.Result.sessionId);
                    } else if (resultData.Result.SuccessCode == 100) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.confirmUserPage.regKeyErr,
                            buttons: ['OK']
                        });
                        alert.present();
                    } else if (resultData.Result.SuccessCode == 400) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.confirmUserPage.reqFailedErr,
                            buttons: ['OK']
                        });
                        alert.present();
                    } else if (resultData.Result.SuccessCode == 700) {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.confirmUserPage.userIdErr,
                            buttons: ['OK']
                        });
                        alert.present();
                    } else {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: '',
                            subTitle: commonString.confirmUserPage.unknownErr,
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                },
                (error) => {
                    console.log('error api' + JSON.stringify(error));
                });
            loading.present();
           }
         } catch (error) { console.log("Error occured",error); }
    }
    // End

}
