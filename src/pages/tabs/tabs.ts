import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { SendmailPage } from '../sendmail/sendmail';
import { CablePage } from '../cable/cable';
import { NavController} from "ionic-angular";
import { Storage } from "@ionic/storage";

@Component({
  templateUrl: 'tabs.html'

})
export class TabsPage {
  formLanguage = '0';
  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = SendmailPage;
  tab5Root = CablePage;


  constructor(public navCtrl: NavController,private storage: Storage ) 
  {

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Home");
   this.getLanguageSetting();
  }
  getLanguageSetting(){
    this.storage.get('settingLanguage').then((data) => {
      if(data){
        this.formLanguage = data;
        //console.log("Language ",this.formLanguage);;
      }
    });
  }

}