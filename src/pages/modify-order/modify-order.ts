import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { reorderArray } from 'ionic-angular';

/**
 * Generated class for the ModifyOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var iCloudKV: any;
@IonicPage()
@Component({
    selector: 'page-modify-order',
    templateUrl: 'modify-order.html',
})

export class ModifyOrderPage {
    index: any;
    names: any;
    protectionPin: number = 0;
    reorderIsEnabled: Boolean = true;
    accountName: string = "Account Details";
    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    ionViewDidLoad() {
        sessionStorage.setItem("AddEdit", "YES");
    }

    ionViewWillEnter() {
        let getStorage = JSON.parse(localStorage.getItem("accounts"));
        this.names = getStorage;
    }

    // Modify Account Order and Redirect to Home Page

    modifyAccountOrder() {
        localStorage.setItem("accounts", JSON.stringify(this.names));
        this.SaveBackupData();
        this.navCtrl.popToRoot();
    }

    SaveBackupData() {
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

    // set the position of the items
    reorderItems($event) {
        this.names = reorderArray(this.names, $event);
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
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;

    return strTime;
}