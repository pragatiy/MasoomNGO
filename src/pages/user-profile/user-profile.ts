import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
import { Platform } from 'ionic-angular';
import { AddAccountPage } from '../add-account/add-account';
import { EditAccountPage } from '../edit-account/edit-account';
import { SettingPage } from '../setting/setting';
import { LicencePage } from '../licence/licence';
import { ShowTotpPage } from '../show-totp/show-totp';
import { IconlistPage } from '../iconlist/iconlist';
import { DefaulticonPage } from '../defaulticon/defaulticon';
/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',

})
export class UserProfilePage {
  @ViewChild(Navbar) navBar: Navbar;
  userName: String;
  companyName: any;
  displayName: String;
  mobileNumber: number;
  emailAddress: any;
  users: any;
  licenceId: any;
  isRegister: any;
  loading: any;
  UserInfoStorage: any;
  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public restProvider: LicenceAgreementProvider) {
    let pageName = navParams.get('backTo');
    this.licenceId = localStorage.getItem("licenseId");
    this.UserInfoStorage = localStorage.getItem("UserRegisterInfo");
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        debugger;
        if (pageName == 'home') {
          this.navCtrl.popToRoot();
        } else if (pageName == 'addAccount') {
          this.navCtrl.push(AddAccountPage);
        } else if (pageName == 'editAccount') {
          this.navCtrl.push(EditAccountPage);
        } else if (pageName == 'settings') {
          this.navCtrl.push(SettingPage);
        } else if (pageName == 'iconlist') {
          this.navCtrl.push(IconlistPage);
        } else if (pageName == 'defaulticon') {
          this.navCtrl.popToRoot();
        } else if (pageName == 'showtotp') {
          this.navCtrl.popToRoot();
        } else if (pageName =='license') {
         this.navCtrl.popToRoot();
        } else {
          this.navCtrl.popToRoot();
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  ionViewWillEnter() {
    this.getUsersData();
  }


  backLogoClick() {
    this.navCtrl.popToRoot();
  }

  getUsersData() {
    try{
    let UserInfoStorageArr = JSON.parse(this.UserInfoStorage);   
     console.log('user CN ',UserInfoStorageArr.CN);
    if (UserInfoStorageArr) {
      this.userName = UserInfoStorageArr.userName;
      this.companyName = UserInfoStorageArr.CN;
      this.mobileNumber = UserInfoStorageArr.mobile;
      this.displayName = UserInfoStorageArr.name;
      this.emailAddress = UserInfoStorageArr.email;
    }
  }catch(error){
          console.log("Error occured",error);
  }
  }

}
