import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { A2cApiProvider } from '../../providers/a2c-api/a2c-api';
import { HomePage } from '../home/home';
@IonicPage()
@Component({
    selector: 'page-reset-password',
    templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
    constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: A2cApiProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ResetPasswordPage');
    }

    // Call API for Reset Password Yes
    ResetPasswordYes() {
        try{
        let sessionid = localStorage.getItem('sessionId');
        this.restProvider.resetPasswordYes(sessionid).subscribe(
            (result) => {
                this.navCtrl.push(HomePage);
            },
            (error) => {
                console.log('error api' + JSON.stringify(error));
            });
          } catch (error) { console.log("Error occured"); }
    }
    // End

}
