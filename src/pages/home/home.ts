import { Component, ViewChild } from "@angular/core";
import { NavController, Slides, LoadingController, Platform, AlertController,NavParams } from "ionic-angular";
import { ServicePage } from "../service/service";
import { CablePage } from "../cable/cable";
import { AboutPage } from "../about/about";
import { ContactPage } from "../contact/contact";
import { MemberPage } from "../member/member";
import { Storage } from "@ionic/storage";
import { LoginPage } from "../login/login";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { UtubePage } from "../utube/utube";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { ToastController } from "ionic-angular";
import { NewsPage } from "../news/news";
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {

  memberId: any = null;  
  isLoggedIn: Boolean = false;
  user: any = null;
  name: any;
  lastname: any;

  @ViewChild(Slides) slides: Slides;
  user_log: any = "root";
  pass_log: any = "wsx96300";
  dataitem: any;
  Pay: number;

  img_home: boolean = false;
  img_member: any;
  LogMember: any;
  img_log: any;
  img_login: any;
  img_cabletv: any;
  img_net: any;
  img_cctv: any;
  img_news: any;
  img_it: any;
  img_contact: any;
  img_paytmn: any;
  img_hot: any;
  img_cable_net: any;
  img_p_cctv: any;
  img_memEN:any;
  receipt_pay: any;
  loop: boolean = true;
  News_tmn: any;
  rerun_news: any;
  checked: boolean = true;
  news_version: any;
  Slide1: any;
  Slide2: any;
  Slide3: any;
  imageContainer: any;
  testCheckboxOpen: boolean;
  testCheckboxResult: any;
  items: any;
  results: Object;
  data: any;
  conn: any;
  formLanguage:any = '0';


  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private iab: InAppBrowser,
    public http: HttpClient,
    public platform: Platform,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public api: ApiProvider,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) 
    {
      this.Pay = 1;
      this.dataitem = "";

    }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Home");
    this.getLanguageSetting();
 
   //เช็คคอนเน็คดาต้าเบส
    //let url: string = "http://tmnoffice.dyndns.tv:8000/tmn/appdata/tmn_conn.php";
    let url: string = "http://tmnoffice.dyndns.tv:8000/App_New/tmn_conn.php";
    let datapost = new FormData();

    datapost.append("user_log", this.user_log);
    datapost.append("pass_log", this.pass_log);

    let data: Observable<any> = this.http.post(url, datapost);

    data.subscribe(async (call) => {

      if (call.status == 200) {
          //alert(call.msg);
        await this.platform.ready().then(() => {

          //console.log(call.msg);
          this.Home_img(); 
          this.login();

        });

      } else if (call.status == 405) {
        alert(call.msg);
        this.navCtrl.setRoot(UtubePage);
      }

    }, error => {
      
      this.navCtrl.setRoot(UtubePage);

    });

    if(this.isLoggedIn){
      console.log('Login True');
    }

  }

  ToastMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'top'
    });

    toast.present();
  }
 /*  changeTab() {
    this.formLanguage = "0";
    if (this.pendientes = !this.pendientes) {

   
      this.storage.set('settingLanguage', this.formLanguage).then(() => {
        this.formLanguage = "0";
        //this.ToastMessage('Switch Language English Success');
       // this.events.publish('settingLanguage', this.formLanguage);
       console.log("Tha =",this.formLanguage);
      });
     
    }else{
      this.formLanguage = "1";
  
      this.storage.set('settingLanguage', this.formLanguage).then(() => {
        this.formLanguage = "1";
        //this.ToastMessage('เลือกภาษา Thai เป็นค่าเริ่มต้น');
      //this.events.publish('settingLanguage', this.formLanguage);
      console.log("Eng =",this.formLanguage);
     
      });
    }
} */
   getLanguageSetting(){
    this.storage.get('settingLanguage').then((data) => {
      if(data){
        this.formLanguage = data;    
        console.log("Home Language ",this.formLanguage);       
      }
    });
  } 


  Home_img() { // เรียกรูปภาพมาแสดง


    let postdataset = new FormData();

    postdataset.append("Page", "Home");

    let callback: Observable<any> = this.http.post(this.api.rounte_img_home, postdataset);

    let loading = this.loadingCtrl.create({
      //spinner: 'hide',
      content: 'กำลังโหลดข้อมูล...'
    });

    loading.present();

    callback.subscribe(async (call) => {

      if (await call.status == 'Home') {

        this.imageContainer = call;
        this.img_log = call.log;
        this.img_login = call.login;
        this.Slide1 = call.Slide1;
        this.Slide2 = call.Slide2;
        this.Slide3 = call.Slide3;
        this.img_member = call.member;
        this.LogMember = call.LogMember;
        this.img_memEN = call.memEN;
        this.img_cabletv = call.cabletv;
        this.img_net = call.net;
        this.img_cctv = call.cctv;
        this.img_news = call.news;
        this.News_tmn = call.News_tmn;
        this.rerun_news = call.rerun_news;
        this.img_hot = call.hot;
        this.img_cable_net = call.cable_net;
        this.img_p_cctv = call.p_cctv;
        this.img_it = call.it;
        this.img_contact = call.contact;
        this.img_paytmn = call.paytmn;
        //console.log("Call", this.imageContainer);          
      }

      else if (call.status == 400) {

        console.log("Call=Null");
      }

    },
      (error) => {
        // console.log(error); //แสดง errors  หากเกิด errors
        loading.dismiss() //ให้ Loading หายไปกรณีเกิด error  
        this.navCtrl.setRoot(UtubePage);
      },
      () =>
        setTimeout(() => {
          loading.dismiss() //ให้ Loading หายไปกรณีเกิดการทำงานเสร็จสมบูรณ์
        }, 1000)
    );

  } //Home_img  */

  cabletv() {
    setTimeout(() => {
      this.navCtrl.push(CablePage);
    }, 300);
  }

  internet() {
    setTimeout(() => {
      this.navCtrl.push(AboutPage);
    }, 300);
  }
  cctv() {
    setTimeout(() => {
      this.navCtrl.push(ContactPage);
    }, 300);
  }

  //เช็คล็อกอินก่อนไปหน้าสมาชิก
  member() {
    this.storage.get("MemberID").then((val) => {
      this.memberId = val;
      console.log("Your IDmem", this.memberId);
      if (this.memberId) {

        this.isLoggedIn = true;
          setTimeout(() => {
            this.navCtrl.push(MemberPage, { memID: this.memberId });
          }, 300);
          console.log("Status Login", this.isLoggedIn);
             
      } else {
        this.isLoggedIn = false;
        this.navCtrl.push(LoginPage);
        console.log("Status Login", this.isLoggedIn);
      }

    });

  }


  login() {
    this.storage.get("MemberID").then((val) => {

      this.memberId = val;
      console.log("Your ID Login", this.memberId);  // ถ้าได้ null คือยังไม่ได้ Login

      if (this.memberId != null) {
        this.storage.get("Name").then((val) => {
          this.name = val;
          console.log("Your Name", this.name);
        });
        this.storage.get("LastName").then((val) => {
          this.lastname = val;
          console.log("LastName", this.lastname);
        });

        this.storage.get("user").then((user) => {
          this.user = user;
          console.log("Username=", user);
        });
      }
    });

  }

   srevice() {
    setTimeout(() => {
      this.navCtrl.push(ServicePage);
    }, 300);
  } 

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", currentIndex);
  }


  rerunnews() {
        
   //this.iab.create('https://tmncabletv.com/index.html','_blank');
   this.iab.create('https://www.facebook.com/tmnnewscabletv','_blank');
   //this.iab.create('https://www.facebook.com/tmnnewscabletv/videos/?ref=page_internal', '_blank');
   //window.open('https://www.facebook.com/tmnnewscabletv', '_system');

  }  

  it() {
    
    this.iab.create('http://line.me/ti/p/~ittmn','_system');
    //this.iab.create('http://line.me/ti/p/~ittmn','_self',{location:'no'});
  }

  contact(){

    this.iab.create('http://line.me/ti/p/~@tmn.pattaya','_system');
    //this.iab.create('http://line.me/ti/p/~@tmn.pattaya','_self',{location:'no'});
  }

  News() {
    this.navCtrl.push(NewsPage);
  }

}
