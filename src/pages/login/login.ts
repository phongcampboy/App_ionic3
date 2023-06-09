import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController,Events} from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { RegisterPage } from "../register/register";
import { HomePage } from '../home/home';
import { MemberPage } from "../member/member";
import { AppversionPage } from '../appversion/appversion';
import { ApiProvider } from '../../providers/api/api';
import { ToastController } from "ionic-angular";
@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {

  logindata: any = {};
  memberId: any = null;
  isLoggedIn: Boolean = false;
  user: any = null;
  name: any;
  lastname: any;
  formLanguage:any = '0';

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public alertCtrl: AlertController,
    private storage: Storage,
    public api: ApiProvider,
    public events : Events,
    public toastCtrl: ToastController,
    public navParams: NavParams
  ) {
    this.logindata.user = "";
    this.logindata.pass = "";

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");

    this.getLanguageSetting();

    this.storage.get("user").then((user) => {
      this.user = user;
      console.log("Username=", user);

      if (this.user) {
        this.isLoggedIn = true;
        this.navCtrl.push(HomePage, { memID: this.memberId });
        //console.log("สถานะการล็อกอิน", this.isLoggedIn);
      } else {
        this.isLoggedIn = false;
        console.log("สถานะการล็อกอิน", this.isLoggedIn);
      }
    });
  }

   getLanguageSetting(){
    this.storage.get('settingLanguage').then((data) => {
      if(data){
        this.formLanguage = data;
        console.log("Login formLanguage =",data);
      }
    });
  }  

  ToastMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }


  async clicklogin() {

    if (this.logindata.user != "" && this.logindata.pass != "") {
      let FormLogin = new FormData();
      FormLogin.append("user", this.logindata.user);
      FormLogin.append("pass", this.logindata.pass);

      let result: any = await this.api.postdata(this.api.route_Login, FormLogin, 'กำลังเข้าสู่ระบบ..');
      console.log("Result = ",result);


       if (result['success']) {

        console.log('ข้อมูลล็อกอิน', result);
        this.memberId = result.MemberID;
        this.user = result.User_app;
        this.name = result.FirstName;
        this.lastname = result.LastName;

        return await this.storage.set("user", this.user).then(() => {
          this.storage.set("MemberID", this.memberId);
          this.storage.set("Name", this.name);
          this.storage.set("LastName", this.lastname);
          this.navCtrl.setRoot(MemberPage, { memID: this.memberId });
        });

      } else {

        const alert = this.alertCtrl.create({
          title: "waring!",
          subTitle: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง The username or password is incorrect.!!",
          buttons: ["OK"],
        });
        alert.present();
        //this.api.errorAlert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง The username or password is incorrect.!');

      } 
    } else {
      const alert = this.alertCtrl.create({
        title: "waring!",
        subTitle: "กรุณากรอกข้อมูลให้ครบทุกช่อง Complete information!",
        buttons: ["OK"],
      });
      alert.present();
    }
  }


  /* clicklogin() {
    if (this.logindata.user != "" && this.logindata.pass != "") {
      console.log("User:", this.logindata.user);
      console.log("Pass :", this.logindata.pass);
      
      //let url = "http://tmnoffice.dyndns.tv:8000/tmn/appdata/tmn_login.php";
      let url = "http://tmnoffice.dyndns.tv:8000/tmn/Api_App/tmn_login.php";

      let datapost = new FormData();

      datapost.append("user", this.logindata.user);
      datapost.append("pass", this.logindata.pass);

      let data: Observable<any> = this.http.post(url, datapost);
      
      data.subscribe(async (datasend) => {
        console.log(datasend);

        if (await datasend != null) {
          this.memberId = datasend[0].MemberID;
          this.user = datasend[0].User_app;
          this.name = datasend[0].FirstName;
          this.lastname = datasend[0].LastName;

          return await this.storage.set("user", this.user).then(() => {
            this.storage.set("MemberID", this.memberId);
            this.storage.set("Name", this.name);
            this.storage.set("LastName", this.lastname);
            this.navCtrl.setRoot(MemberPage, { memID: this.memberId });
          });
          
        } else {
          const alert = this.alertCtrl.create({
            title: "แจ้งเตือน!",
            subTitle: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!",
            buttons: ["ตกลง"],
          });
          alert.present();
          console.log("Login failed");
        }
      });
    } else {
      const alert = this.alertCtrl.create({
        title: "แจ้งเตือน!",
        subTitle: "กรุณากรอกข้อมูลให้ครบทุกช่อง!",
        buttons: ["ตกลง"],
      });
      alert.present();
    }
  } */
  register() {
    this.navCtrl.push(RegisterPage);
  }
  manual() {
    setTimeout(() => {
      this.navCtrl.push(AppversionPage);
    }, 300);
  }
}
