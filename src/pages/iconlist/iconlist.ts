import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddAccountPage } from "../add-account/add-account";
import { UserProfilePage } from '../user-profile/user-profile';
import { AlertController } from 'ionic-angular';
import { DefaulticonPage } from '../defaulticon/defaulticon';
import { Platform } from 'ionic-angular';
/**
 * Generated class for the IconlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-iconlist',
  templateUrl: 'iconlist.html',
})
export class IconlistPage {
  accIcons: any;
  isUserRegister: Boolean = false;
  constructor(public navCtrl: NavController, public platform: Platform, private alertCtrl: AlertController, public navParams: NavParams) {
    this.accIcons = [
      { "name": 'Amazon' },
      { "name": 'Amazon Web Services' },
      { "name": 'BitBucket' },
      { "name": 'Dropbox' },
      { "name": 'Facebook' },
      { "name": 'GitHub' },
      { "name": 'GitLab' },
      { "name": 'Gmail' },
      { "name": 'Google' },
      { "name": 'Instagram' },
      { "name": 'Jira' },
      { "name": 'LinkedIn' },
      { "name": 'Microsoft' },
      { "name": 'Salesforce' },
      { "name": 'Slack' },
      { "name": 'Snapchat' },
      { "name": 'Twitter' }
    ]

    console.log(this.accIcons[0].name);

    let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
    if (registerUsered) {
      this.isUserRegister = true;
    }
    else {
      this.isUserRegister = false;
    }
    platform.registerBackButtonAction(() => {
      this.navCtrl.popToRoot();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IconlistPage');
  }

  chooseIcon(getIconName) {
    localStorage.setItem('hideScanBtn', 'yes');
    console.log("'iconName':getIconName,",getIconName)
    // let imgNewImgRrc = 'assets/accounticons/' + getIconName + '.png';
    if (getIconName == 'Other') {
      this.navCtrl.push(AddAccountPage, {'iconName':getIconName, 'page': 'IconList' });
    }
    else {
      console.log("chooseOtherIcon",getIconName)
      this.navCtrl.push(AddAccountPage, { 'iconName': getIconName, 'page': 'IconList', getIconName:getIconName});
    }
  }
  
  chooseOtherIcon(getIconName) {
    this.navCtrl.push(DefaulticonPage, { 'pageName': 'iconList' });
  }

  backLogoClick() {
    this.navCtrl.popToRoot();
  }

  userProfileClick() {
    this.navCtrl.push(UserProfilePage, { 'backTo': 'iconlist' });
  }
}
