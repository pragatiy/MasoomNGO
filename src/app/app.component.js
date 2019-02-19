var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeAudio } from '@ionic-native/native-audio';
import { HomePage } from '../pages/home/home';
import { Device } from '@ionic-native/device';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
var MyApp = /** @class */ (function () {
    function MyApp(platform, uniqueDeviceID, device, statusBar, nativeAudio) {
        var _this = this;
        this.uniqueDeviceID = uniqueDeviceID;
        this.device = device;
        this.nativeAudio = nativeAudio;
        this.rootPage = HomePage;
        platform.ready().then(function () {
            platform.registerBackButtonAction(function () { return _this.backbtnFuc(); });
            _this.nativeAudio.preloadSimple('default', 'assets/sound/default.mp3');
            localStorage.setItem('deviceId', device.uuid);
            console.log('app component device id ' + device.uuid);
        });
    }
    MyApp.prototype.backbtnFuc = function () { this.nav.pop({}); };
    __decorate([
        ViewChild('myNav'),
        __metadata("design:type", NavController)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform, UniqueDeviceID,
            Device, StatusBar, NativeAudio])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map