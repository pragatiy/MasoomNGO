import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the GeneratePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-generate-password',
  templateUrl: 'generate-password.html',
})
export class GeneratePasswordPage {
  @ViewChild(Navbar) navBar: Navbar;
  account_password: any;
  notification: any;
  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams) {
    this.notification = navParams.get("notification");
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        this.navCtrl.popToRoot();
      });
    })
  }

  ionViewDidEnter() {
    // when click on cancel option from sheet then go back by page back arrow button to home page 
    this.navBar.backButtonClick = () => {
      this.navCtrl.popToRoot();
    };
  }

  ionViewDidLoad() {
    if (this.notification) {
      this.account_password = this.notification.additionalData.pswd;
    }
    console.log('ionViewDidLoad GeneratePasswordPage');
    localStorage.setItem('PushFlag', '');
  }

}
