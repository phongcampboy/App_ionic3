import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { ToastController } from "ionic-angular";
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  defaultBranch: any = "0";

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public toastCtrl: ToastController,
    private storage: Storage,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    this.getBranchSetting();
  }

  ToastMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }
  
  getBranchSetting() {
    this.storage.get('settingBranch').then((data) => {
      if (data) {
        this.defaultBranch = data;

      }
    });
  }
  settingBranch(data, message) {
    this.storage.set('settingBranch', data).then(() => {
      this.ToastMessage('เลือก ' + message + ' เป็นค่าเริ่มต้น');
      this.events.publish('settingBranch', data);
    });
  }


}
