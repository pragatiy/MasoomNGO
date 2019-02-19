import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeAudio } from '@ionic-native/native-audio';
import { HomePage } from '../pages/home/home';
import { Keyboard } from '@ionic-native/keyboard';
import { AppVersion } from '@ionic-native/app-version';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { TouchID } from '@ionic-native/touch-id';

declare var iCloudKV: any;
declare var AesUtil;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  token: any;
  MobileAppVersion: any;
  @ViewChild('myNav') nav: NavController // <--- Reference to the Nav

  rootPage: any = HomePage;
  constructor(public events: Events, public touchId: TouchID, platform: Platform, private uniqueDeviceID: UniqueDeviceID, statusBar: StatusBar, private appVersion: AppVersion, private nativeAudio: NativeAudio, public splashScreen: SplashScreen, private keyboard: Keyboard) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      statusBar.styleLightContent();
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#192740');
     
     
      keyboard.disableScroll(false);
      this.nativeAudio.preloadSimple('default', 'assets/sound/default.mp3');
      this.appVersion.getVersionNumber().then(version => {
        localStorage.setItem('MobileAppVersion', version);
      });

      this.uniqueDeviceID.get()
        .then((uuid: any) => {
          console.log(uuid);
          localStorage.setItem('uuid', uuid);
        }
        )
        .catch((error: any) => console.log(error));

      this.touchId.isAvailable()
        .then(
          res => {
            localStorage.setItem('isFingerPrintEnable', 'yes');
            console.log('TouchID is available!')
          },
          err => {
            localStorage.setItem('isFingerPrintEnable', 'no');
            console.error('TouchID is not available', err)
          }
        );

    })

    events.subscribe('backup:icloud', () => {
      this.loggedIn();
    });

  }


  loggedIn() {
    console.log("logged in");
    let enableTxt = localStorage.getItem('isEnable');
    if (enableTxt == 'Enable') {
      let getAccountData = localStorage.getItem("accounts");
      let oldgetStorageSetting = localStorage.getItem("Appsetting");

      let getStorageToDisplayval = getAccountData.concat('NOSETTING' + oldgetStorageSetting);
      iCloudKV.save("BaackupData", getStorageToDisplayval, this.saveSuccess);
    }
  }

  saveSuccess() {
    console.log("save data sucessfully");
    newtime = formatDateTime();
    localStorage.setItem('lastBackupTime', newtime);
  }



  backbtnFuc() {
    this.nav.popToRoot();
  }
}


var newtime;

function formatDateTime() {
  let minutes: any;
  var date = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var hours = date.getHours();
  minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'    
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;

  return strTime;

  //document.getElementById("demo").innerHTML = strTime;

}

