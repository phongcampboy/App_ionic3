import { Component } from "@angular/core";
import {IonicPage,NavController,NavParams,AlertController,LoadingController,} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { LoginPage } from "../login/login";
import { Storage } from "@ionic/storage";
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: "page-changpass",
  templateUrl: "changpass.html",
})
export class ChangpassPage {
  public reg: FormGroup;
  postdata: any = {};
  ID_chang: any;
  Chk_pass: any;
  formLanguage:any = '0';
  isLoggedIn: Boolean = false;
  user: any = null;
  MemberID: any = null;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
    private storage: Storage
  ) {
    this.postdata.User_app = "";
    this.postdata.Pass_app = "";

    this.reg = this.formBuilder.group({
      Username: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ],
      ],

      //Password: ['',Validators.required],
      Password: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ],
      ],

      Con_password: ["", Validators.required],
    });
  }

  doSignup() {
    console.log("value", this.reg.value);
    console.log(this.reg.valid);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ChangpassPage");
    this.getLanguageSetting();

    let idget = this.navParams.get("memID");
    this.ID_chang = idget[0].MemberID;
    console.log("ID=", this.ID_chang);
  }

  
  getLanguageSetting(){
    this.storage.get('settingLanguage').then((data) => {
      if(data){
        this.formLanguage = data;
        console.log("Language ",this.formLanguage);;
      }
    });
  } 

  Chk_password() {
    if (this.postdata.Pass_app != this.Chk_pass) {

      if (this.formLanguage == "0") {
        const alert = this.alertCtrl.create({
          title: "พาสเวิร์ดไม่ตรงกัน",
          subTitle: "กรุณาลองใหม่อีกครั้ง",
          buttons: ["OK"],
        });
        alert.present(); 
      }else{
        const alert = this.alertCtrl.create({
          title: "Password does not match",
          subTitle: "Please try again.",
          buttons: ["OK"],
        });
        alert.present(); 
      }
     
    } else {
      this.changpass();
    }
  }

  changpass() {
    console.log("value", this.reg.value);
    console.log(this.reg.valid);

    //let url = "http://tmnoffice.dyndns.tv:8000/tmn/Api_App/tmn_chang_pass.php";

    let postdataset = new FormData();

    postdataset.append("idMember", this.ID_chang);
    postdataset.append("User_app", this.postdata.User_app);
    postdataset.append("Pass_app", this.postdata.Pass_app);

    console.log("idMember:", this.ID_chang);
    console.log("User_app:", this.postdata.User_app);
    console.log("Pass_app:", this.postdata.Pass_app);

    let callback: Observable<any> = this.http.post(this.api.rounte_tmn_chang_pass, postdataset);

    callback.subscribe(async (call) => {
      console.log(call);
      if (await call.status == 200) {
        alert(call.msg);
        let loading = this.loadingCtrl.create({
          content: "Loading...",
          spinner: "circles",
        });
        loading.present();

        await this.storage.remove("user");
        await this.storage.remove("MemberID");
        this.isLoggedIn = false;
        this.user = null;
        this.MemberID = null;
        this.navCtrl.setRoot(LoginPage);
        loading.dismiss();
      }
      else if (call.status == 400) {
        alert(call.msg);
      }
      else if (call.status == 405) {
        alert(call.msg);
      }
    });
  }
}
