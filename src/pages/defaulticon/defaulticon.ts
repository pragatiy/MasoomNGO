import { Component, NgZone } from '@angular/core';
import { IonicPage, NavParams, NavController  } from 'ionic-angular';
import { AddAccountPage } from "../add-account/add-account";
import { EditAccountPage } from '../edit-account/edit-account';
import { UserProfilePage } from '../user-profile/user-profile';
import { AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { IconlistPage } from '../iconlist/iconlist';
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
  pageName:any;
  accountIndex: number ;
  constructor(public navCtrl: NavController,public navParams: NavParams, private Camera: Camera, private zone: NgZone,private alertCtrl: AlertController) {
   debugger;
   
    this.pageName = navParams.get('pageName');
    this.accountIndex = navParams.get('accountIndex');
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

  }

 
  chooseIcon(getIconName) {
    debugger;
    localStorage.setItem('hideScanBtn', 'yes');
    localStorage.removeItem("imageSrc");
    let imgNewSrc = 'assets/account_icon/' + getIconName + '.png';

  if (this.pageName == 'addAccount') {
    this.navCtrl.push(AddAccountPage, {'imageSrc': imgNewSrc, 'iconName': getIconName });
   }else if (this.pageName == 'editAccount') {

    // let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));         
    // let index = oldgetStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
    // oldgetStorage[index].imageSrc = 'assets/account_icon/' + getIconName + '.png';;
    // localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
    this.navCtrl.push(EditAccountPage, {'imageSrc': imgNewSrc, 'iconName': getIconName , 'accountIndex': this.accountIndex});  
   
   }else if (this.pageName == 'iconList'){
    this.navCtrl.push(AddAccountPage, {'imageSrc': imgNewSrc, 'iconName': getIconName });
   }else{
     this.navCtrl.popToRoot();
   }

   
}

 

chooseGallery(){
  debugger;
    localStorage.removeItem("imageSrc");

    let cameraOptions = {
      sourceType: this.Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit:true,
      destinationType: this.Camera.DestinationType.DATA_URL,
      quality: 50,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.Camera.EncodingType.JPEG,
      correctOrientation: true,
    }
    this.Camera.getPicture(cameraOptions)
      .then(sourcePath => {
        debugger;
        // let base64Image = 'data:image/jpeg;base64,' + sourcePath;
        let base64Image = "data:image/jpeg;base64," + sourcePath;
        let imgNewSrc = base64Image;
        if (this.pageName == 'iconList' || this.pageName == 'addAccount') {
          localStorage.setItem('imageSrc', imgNewSrc);
          this.navCtrl.push(AddAccountPage);
       }else if (this.pageName == 'editAccount') {
          // let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));         
          // let index = oldgetStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
          // oldgetStorage[index].imageSrc = imageSrc;
          // localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
          // localStorage.setItem('imageSrc', imageSrc);
          this.navCtrl.push(EditAccountPage, {'imageSrc': imgNewSrc, accountIndex: this.accountIndex});
      }else{                                        

    }  
      },
        err => console.log(err));
}

 

chooseCamera(){
  debugger;
    localStorage.removeItem("imageSrc");

    let cameraOptions = {
      sourceType: this.Camera.PictureSourceType.CAMERA,
      allowEdit:true,
      destinationType: this.Camera.DestinationType.DATA_URL,
      quality: 50,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.Camera.EncodingType.JPEG,
      correctOrientation: true,
      
    }

    this.Camera.getPicture(cameraOptions)
      .then(sourcePath => {
        // let base64Image = 'data:image/jpeg;base64,' + sourcePath;
        let base64Image = "data:image/jpeg;base64," + sourcePath;
        debugger;
          let imgNewSrc = base64Image;
        if (this.pageName == 'iconList' || this.pageName == 'addAccount') {
          localStorage.setItem('imageSrc', imgNewSrc);
            this.navCtrl.push(AddAccountPage);
         }else if (this.pageName == 'editAccount') {
            //  let oldgetStorage = JSON.parse(localStorage.getItem("accounts"));
            //  let index = oldgetStorage.findIndex(obj => obj.accountIndex == this.accountIndex);
            //  oldgetStorage[index].imageSrc = imageSrc;
            //  localStorage.setItem("accounts", JSON.stringify(oldgetStorage));
            // localStorage.setItem('imageSrc', imgNewSrc);
            this.navCtrl.push(EditAccountPage, {'imageSrc': imgNewSrc, accountIndex: this.accountIndex});
         }else{                                        
               }
      },
        err => console.log(err));
}

 

doneClick(){
  console.log(this.pageName );
  if (this.pageName == 'addAccount') {
           this.navCtrl.push(AddAccountPage);
        }else if (this.pageName == 'editAccount') {
           this.navCtrl.push(EditAccountPage);
        }else if (this.pageName == 'iconList'){
          this.navCtrl.push(IconlistPage);
        }else{
          this.navCtrl.popToRoot();
        }
}

 

backLogoClick(){  
  this.navCtrl.popToRoot();
}

 

userProfileClick() {    
  localStorage.removeItem("imageSrc");
        this.navCtrl.push(UserProfilePage);
    }
}



 

 