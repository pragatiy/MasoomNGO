import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddAccountPage } from "../add-account/add-account";
import { EditAccountPage } from '../edit-account/edit-account';
import { UserProfilePage } from '../user-profile/user-profile';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions  } from '@ionic-native/camera';
import { IconlistPage } from '../iconlist/iconlist';
import { Platform } from 'ionic-angular';
/**
 * Generated class for the DefaulticonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-defaulticon',
  templateUrl: 'defaulticon.html',
})
export class DefaulticonPage {
  accIcons: any;
  isUserRegister: Boolean = false;
  pageName: any;
  accountIndex: any;
  constructor(public navCtrl: NavController, public platform: Platform, private Camera: Camera, private zone: NgZone, private alertCtrl: AlertController, public navParams: NavParams) {
    this.pageName = navParams.get('pageName');
    this.accountIndex = navParams.get("accountIndex");

    this.accIcons = [
      { "name": 'other1' },
      { "name": 'other2' },
      { "name": 'other3' },
      { "name": 'other4' },
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
      if (this.pageName == 'addAccount') {
        this.navCtrl.push(AddAccountPage, { 'page': 'defaultIcon' });
      } else if (this.pageName == 'editAccount') {
        this.navCtrl.push(EditAccountPage,{accountIndex: this.accountIndex});
      } else if (this.pageName == 'iconList') {
        this.navCtrl.push(IconlistPage,{accountIndex: this.accountIndex});
      } else {
        this.navCtrl.popToRoot();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefaulticonPage');
  }

//choose default icon for a2c account
  chooseIcon(getIconName) {
    try{
    localStorage.setItem('hideScanBtn', 'yes');
    localStorage.removeItem("imageSrc");
    let imgNewImgRrc = 'assets/accounticons/' + getIconName + '.png';
    if (this.pageName == 'addAccount') {
      this.navCtrl.push(AddAccountPage, {'imageSrc': imgNewImgRrc, 'iconName': getIconName });
    } else if (this.pageName == 'editAccount') {
      // let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
      // let index = oldgetStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
      // oldgetStorage[index].imageSrc = 'assets/accounticons/' + getIconName + '.png';;
      // localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
      
      this.navCtrl.push(EditAccountPage, {'imageSrc': imgNewImgRrc, 'iconName': getIconName, accountIndex: this.accountIndex});
    } else if (this.pageName == 'iconList') {
      this.navCtrl.push(AddAccountPage, { 'imageSrc': imgNewImgRrc,'iconName': getIconName, 'page': 'defaultIcon' });
    } else {
      this.navCtrl.popToRoot();
    }
    } catch (error) { console.log("Error occured",error); }
  }

//choose icon from gallery for a2c account
  chooseGallery() {
    try{
    localStorage.removeItem("imageSrc");
    let cameraOptions: CameraOptions  = {
       sourceType: this.Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.Camera.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      allowEdit:true,
      encodingType: this.Camera.EncodingType.JPEG,
      correctOrientation: true
    }
    this.Camera.getPicture(cameraOptions)
      .then(file_uri => {
        this.zone.run(() => {
          console.log("file_uri",file_uri)
          // let imageSrc = "data:image/jpeg;base64," + file_uri;
          let imgNewImgRrc = "data:image/jpeg;base64," + file_uri;
          console.log("file_uri imageSrc",imgNewImgRrc)
          if (this.pageName == 'iconList' || this.pageName == 'addAccount') {
            this.navCtrl.push(AddAccountPage, { 'imageSrc': imgNewImgRrc, 'page': 'defaultIcon' });
          } else if (this.pageName == 'editAccount') {
            // let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
            // let index = oldgetStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
            // oldgetStorage[index].imageSrc = imageSrc;
            // localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
            this.navCtrl.push(EditAccountPage, { 'imageSrc': imgNewImgRrc, accountIndex: this.accountIndex });
          } else {

          }
        });
      },
        err => console.log(err));
       } catch (error) { console.log("Error occured",error); }
   }

//choose icon from camera for a2c account
  chooseCamera() {
    try{
    localStorage.removeItem("imageSrc");
    let cameraOptions = {
      sourceType: this.Camera.PictureSourceType.CAMERA,
      destinationType: this.Camera.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      allowEdit:true,
      encodingType: this.Camera.EncodingType.JPEG,
      correctOrientation: true
    }
    this.Camera.getPicture(cameraOptions)
      .then(file_uri => {
        this.zone.run(() => {
          // let imageSrc = "data:image/jpeg;base64," + file_uri;
          let imgNewImgRrc = "data:image/jpeg;base64," + file_uri;
          if (this.pageName == 'iconList' || this.pageName == 'addAccount') {
            this.navCtrl.push(AddAccountPage, { 'imageSrc': imgNewImgRrc, 'page': 'defaultIcon' });
          } else if (this.pageName == 'editAccount') {
            // let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
            // let index = oldgetStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
            // oldgetStorage[index].imageSrc = imageSrc;
            // localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
            this.navCtrl.push(EditAccountPage, { 'imageSrc': imgNewImgRrc, accountIndex: this.accountIndex });
          } else {

          }
        });
      },
        err => console.log(err));
      } catch (error) { console.log("Error occured",error); }
  }

// done click method
  doneClick() {
    try{
    if (this.pageName == 'addAccount') {
      this.navCtrl.push(AddAccountPage, { 'page': 'defaultIcon' });
    } else if (this.pageName == 'editAccount') {
      this.navCtrl.push(EditAccountPage);
    } else if (this.pageName == 'iconList') {
      this.navCtrl.push(IconlistPage);
    } else {
      this.navCtrl.popToRoot();
    }
     } catch (error) { console.log("Error occured",error); }
  }

  backLogoClick() {
    this.navCtrl.popToRoot();
  }

  userProfileClick() {
    localStorage.removeItem("imageSrc");
    this.navCtrl.push(UserProfilePage, { 'backTo': 'defaulticon' });
  }
}
