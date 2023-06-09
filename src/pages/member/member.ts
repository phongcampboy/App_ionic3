import { Component } from "@angular/core";
import {IonicPage,NavController,NavParams,Platform,AlertController,LoadingController,Events} from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import { ListpayPage } from "../listpay/listpay";
import { BillPage } from "../bill/bill";
import { AddbillPage } from "../addbill/addbill";
import { ChangpassPage } from "../changpass/changpass";
import { ToastController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { HomePage } from '../home/home';
import { SendlinePage } from '../sendline/sendline';
import { AppversionPage } from '../appversion/appversion';
import { SendmailPage } from '../sendmail/sendmail';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { ApiProvider } from '../../providers/api/api';
import { Storage } from "@ionic/storage";
@IonicPage()
@Component({
  selector: "page-member",
  templateUrl: "member.html",
})
export class MemberPage {
  dataitem: any;
  Pay: number;
  billcode: number;
  createdCode: number;
  user_log: any = "root";
  pass_log: any = "wsx96300";
  img_member :boolean = false;
  img_pay : any;
  img_payhis : any;
  img_pass : any;
  img_service :any;
  img_sanamkaw:any;
  status:any;
  msg_status:any;
  img_manual:any;
  img_bth01:any;
  img_bth02:any;
  img_bth03:any;
  img_bth04:any;
  img_bth05:any;
  img_bth06:any;
  memberId: any = null;
  formLanguage :any = '0';
  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    public toastCtrl: ToastController,
    private iab: InAppBrowser,
    public api: ApiProvider,
    private storage: Storage,
    public events : Events,
    public navParams: NavParams
  ) 
  {
    this.img_member = true;
     this.storage.get('settingLanguage').then((data) => {
      if (data) {
        //this.defaultLanguage = data;
        //console.log("Language pub",this.defaultLanguage);
        this.events.publish('settingLanguage', data);
      }
    }); 
  }

 async ionViewDidLoad() {
  this.getLanguageSetting();
    this.Pay = 1;
    this.dataitem = "";

    let idget = this.navParams.get("memID");
    console.log("ID ที่ส่งมา=", idget);

   await this.platform.ready().then(() => {
      this.loaddata(idget);
      this.img();    
    });
  }

  getLanguageSetting(){
    this.storage.get('settingLanguage').then((data) => {
      if(data){
        this.formLanguage = data;
        console.log("Language ",this.formLanguage);;
      }
    });
  } 


  img(){

    //let url: string ="http://tmnoffice.dyndns.tv:8000/tmn/appdata/img_member.php";
      
      let postdataset = new FormData();
  
      postdataset.append("Page","Member");
  
      let callback: Observable<any> = this.http.post(this.api.rounte_img_member, postdataset);
  
      callback.subscribe(async(call) => {
       
        if (await call.status == 'Member') {
  
          this.img_pay = call.pay;
          this.img_payhis = call.payhis;
          this.img_pass = call.pass;
          this.img_service = call.service;
          this.img_sanamkaw = call.sanamkaw;
          this.img_manual = call.manual;

          this.img_bth01 = call.bth1;
          this.img_bth02 = call.bth2;
          this.img_bth03 = call.bth3;
          this.img_bth04 = call.bth4;
          this.img_bth05 = call.bth5;
          this.img_bth06 = call.bth6;
     
          //console.log("Call", call);
         
        }
        if(call.status==400){
  
          console.log("Call=Null");
        }
        
      });
  }
  
 async loaddata(id: string) {
     let postData = JSON.stringify({
      memberID: id,
    }); 
/*     let postData = new FormData();
    postData.append("memberID", id); */
    let result = await this.api.loaddata(this.api.route_load_member,postData,'กำลังโหลดขอมูล..');
    console.log(result);
     if (result) {
              
          this.dataitem = result;

          console.log("ข้อมูลที่โหลดมา:", result);

          this.Pay = result[0].IsPay;
          console.log("pay ",result[0].IsPay);
          this.billcode = result[0].BillingCode;
          this.createdCode = this.billcode;
          this.memberId = result[0].MemberID;

          this.status = result[0].MemberStatusID;
          console.log("status",this.status);

          if(this.status == "00001"){

            this.msg_status = "01";
            //this.msg_status = "สถานะปกติ";

          }
          else if(this.status == "00002"){

            this.msg_status = "02";
            //this.msg_status = "สถานะตัดสาย";

          }

          else if(this.status == "00010"){

            this.msg_status = "10";
            //this.msg_status = "สถานะบล็อกสัญญาณชั่วคราว";

          }else{

            this.api.errorAlert('!!กรุณาติดต่อเจ้าหน้าที่');
           // this.navCtrl.setRoot(HomePage);

          }

    }else{
      this.api.errorAlert('!!ไม่พบข้อมูล กรุณาติดต่อเจ้าหน้าที่');
      this.navCtrl.setRoot(HomePage);      
    }      

  }
 
  BillPage() {
    setTimeout(() => {
      this.navCtrl.push(BillPage, { memID: this.dataitem });
    }, 300);
  }

  sendaddbil() {
    setTimeout(() => {
    this.navCtrl.push(AddbillPage, { memID: this.dataitem });
  }, 300);
  }

  listpay() {
    setTimeout(() => {
    this.navCtrl.push(ListpayPage, { memID: this.dataitem });
  }, 300);
  }
  changpass() {
    this.navCtrl.push(ChangpassPage, { memID: this.dataitem });
  }
  service(){
    setTimeout(() => {
    this.navCtrl.push(SendlinePage, { memID: this.dataitem });
  }, 300);
  }
    Sanankaw() {
      this.iab.create('https://fb.watch/8MyQ3WCpBK/','_system');
  } 
  manual(){
    setTimeout(() => {
      this.navCtrl.push(AppversionPage);
    }, 500);
  }
  paybill(){
    setTimeout(() => {
      this.navCtrl.push(SendmailPage);
    }, 300);
     
  } 
}
