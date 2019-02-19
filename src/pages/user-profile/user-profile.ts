import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LicenceAgreementProvider } from '../../providers/licence-agreement/licence-agreement';
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
  isUserRegister: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: LicenceAgreementProvider) {
    this.licenceId = localStorage.getItem("licenseId");
    this.UserInfoStorage = localStorage.getItem("UserRegisterInfo");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }



  ionViewWillEnter() {
    try {
      this.getUsersData();
    } catch (error) {
      console.log("Error occured");
    }
  }

  // Get User Data Function 

  getUsersData() {
    let UserInfoStorageArr = JSON.parse(this.UserInfoStorage);
    if (UserInfoStorageArr) {
      this.userName = UserInfoStorageArr.userName;
      this.companyName = UserInfoStorageArr.CN;
      this.mobileNumber = UserInfoStorageArr.mobile;
      this.displayName = UserInfoStorageArr.name;
      this.emailAddress = UserInfoStorageArr.email;

    }
  }

  public backbtnFun() {
    this.navCtrl.popToRoot();
  }
}