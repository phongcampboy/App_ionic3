import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
} from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ToastController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-sendmail",
  templateUrl: "sendmail.html",
})
export class SendmailPage {
  subject = "";
  body = "";
  detail = "";
  to: string = "tmncable@hotmail.com";
  currentImage = null;
  base64Img = null;
  formLanguage:any = '0';

    photo: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
    
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private camera: Camera
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad SendmailPage");
    this.getLanguageSetting();
  }

  getLanguageSetting(){
    this.storage.get('settingLanguage').then((data) => {
      if(data){
        this.formLanguage = data;
        console.log("Language ",this.formLanguage);;
      }
    });
  }

  takephoto() {

    this.camera.getPicture(this.photo).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Img = "data:image/jpeg;base64," + imageData;
        this.base64Img = base64Img;
      },
      (err) => {
        // Handle error
      }
    );
  }

   getImage() {
    const options: CameraOptions ={
      quality:70,
      destinationType:this.camera.DestinationType.DATA_URL,
      encodingType:this.camera.EncodingType.JPEG,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:true,
      allowEdit:true
    }
    this.camera.getPicture(options).then(
      
      (imgData) => {
        this.base64Img = "data:image/jpeg;base64," + imgData;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  SendEmail() {

    if(this.formLanguage == 0){
      if (this.subject != "" && this.body != "") {

        if (!this.base64Img) {
          let toast = this.toastCtrl.create({
            message: "!!กรุณาแนปไฟล์",
            duration: 3500,
            position: "top",
            showCloseButton: true,
          });
    
          toast.present(toast);
        } else {  
        
              let url = "https://chawtaichonburi.com/Email/SendMail.php";
    
              let datapost = new FormData();
        
              datapost.append("subject", this.subject);
              datapost.append("body", this.body);
              datapost.append("detail", this.detail);
              datapost.append("file", this.base64Img);
  
              let callback: Observable<any> = this.http.post(url, datapost);
        
              callback.subscribe(async(call) => {
                     
                 if (await call.status == 200) {
                  //alert(call.msg);
                  let toast = this.toastCtrl.create({
                    message: "ส่งอีเมล สำเร็จ",
                    duration: 4000,
                    position: "top",
                    showCloseButton: true,
                  });
            
                  toast.present(toast);
                 
                  this.subject = "";
                  this.body = "";
                  this.detail = "";
                  this.currentImage = null;
                  this.base64Img = "";
                }
        
                else if (call.status == 404) {
                  //alert(call.msg);
                  let toast = this.toastCtrl.create({
                    message: "!!ส่งอีเมล ไม่สำเร็จ",
                    duration: 4000,
                    position: "top",
                    showCloseButton: true,
                  });
                  toast.present(toast);
  
                }
              }); 
        }
  
      }else{
        const alert = this.alertCtrl.create({
          title: "แจ้งเตือน!",
          subTitle: "กรุณากรอกข้อมูลให้ครบทุกช่อง!",
          buttons: ["OK"],
        });
        alert.present();
      }
    }else{
    if (this.subject != "" && this.body != "") {

      if (!this.base64Img) {
        let toast = this.toastCtrl.create({
          message: "!!Please attach the file",
          duration: 3500,
          position: "top",
          showCloseButton: true,
        });
  
        toast.present(toast);
      } else {  
      
            let url = "https://chawtaichonburi.com/Email/SendMail.php";
  
            let datapost = new FormData();
      
            datapost.append("subject", this.subject);
            datapost.append("body", this.body);
            datapost.append("detail", this.detail);
            datapost.append("file", this.base64Img);

            let callback: Observable<any> = this.http.post(url, datapost);
      
            callback.subscribe(async(call) => {
                   
               if (await call.status == 200) {
                //alert(call.msg);
                let toast = this.toastCtrl.create({
                  message: "Email sent successfully",
                  duration: 4000,
                  position: "top",
                  showCloseButton: true,
                });
          
                toast.present(toast);
               
                this.subject = "";
                this.body = "";
                this.detail = "";
                this.currentImage = null;
                this.base64Img = "";
              }
      
              else if (call.status == 404) {
                //alert(call.msg);
                let toast = this.toastCtrl.create({
                  message: "!!Failed to send email",
                  duration: 4000,
                  position: "top",
                  showCloseButton: true,
                });
                toast.present(toast);

              }
            }); 
      }

    }else{
      const alert = this.alertCtrl.create({
        title: "waring!",
        subTitle: "Please fill out all fields.!",
        buttons: ["OK"],
      });
      alert.present();
    }
  }
  }
}
