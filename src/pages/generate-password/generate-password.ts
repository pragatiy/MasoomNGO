import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.notification = navParams.get("notification");
  }

  ionViewDidLoad() {
    if (this.notification) {   
    }
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.navCtrl.popToRoot();
    }
    console.log('ionViewDidLoad GeneratePasswordPage');
    localStorage.setItem('PushFlag', '');
  }

}