import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddAccountPage } from '../add-account/add-account';
import { UserProfilePage } from "../user-profile/user-profile";
import { DefaulticonPage  } from '../defaulticon/defaulticon';
/**
 * Generated class for the IconlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-iconlist',
  templateUrl: 'iconlist.html',
})
export class IconlistPage {

  accIcons: any;
  isUserRegister: Boolean = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    debugger;
    this.accIcons = [
      { 'name': 'Amazon' },
      { 'name': 'AWS' },
      { 'name': 'Bitbucket' },
      { 'name': 'Dropbox' },
      { 'name': 'Facebook' },
      { 'name': 'GitHub' },
      { 'name': 'GitLab' },
      { 'name': 'Gmail' },
      { 'name': 'Google' },
      { 'name': 'Instagram' },
      { 'name': 'Jira' },
      { 'name': 'Linkedin' },
      { 'name': 'Microsoft' },
      { 'name': 'Salesforce' },
      { 'name': 'Slack' },
      { 'name': 'Snapchat' },
      { 'name': 'Twitter' }
    ];

    console.log(this.accIcons[0].name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IconlistPage');
  }

  ionViewWillEnter() {

    let registerUsered = JSON.parse(localStorage.getItem("UserRegisterInfo"));
    if (registerUsered) {
      this.isUserRegister = true;
    } else {
      this.isUserRegister = false;
    }
  }

  // logo Click
  public backbtnFun() {
    try {
      this.navCtrl.popToRoot();
    } catch (error) {
      console.log('error');
    }
  }

  userProfileClick() {
    this.navCtrl.push(UserProfilePage);
  }

  chooseIcon(getIconName) {
    debugger;
    localStorage.setItem('hideScanBtn', 'yes');
    if (getIconName === 'Other') {
      this.navCtrl.push(AddAccountPage);
    } else {
      this.navCtrl.push(AddAccountPage, { 'iconName': getIconName });
    }

  }

  chooseOtherIcon(getIconName){
    debugger;
    this.navCtrl.push(DefaulticonPage,{'pageName':'iconList'});   
    }
    
     
}
