import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeAudio } from '@ionic-native/native-audio';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { Device } from '@ionic-native/device';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

declare var AesUtil;
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    static token: any;
    @ViewChild('myNav') nav: NavController; // <--- Reference to the Nav
    rootPage: any = HomePage;
    constructor(platform: Platform, private uniqueDeviceID: UniqueDeviceID,
        private device: Device, statusBar: StatusBar, private nativeAudio: NativeAudio) {
        platform.ready().then(() => {
            platform.registerBackButtonAction(() => this.backbtnFuc());
            this.nativeAudio.preloadSimple('default', 'assets/sound/default.mp3');
            localStorage.setItem('deviceId', device.uuid);
            console.log('app component device id ' + device.uuid);
        });
    }
    backbtnFuc() {
     //this.nav.pop({}); 
           }
}

