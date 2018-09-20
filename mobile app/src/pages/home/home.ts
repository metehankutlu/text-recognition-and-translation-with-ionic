import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CropImagePage } from '../crop-image/crop-image';
import { ResultPage } from '../result/result';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  ip: string;
  srcLang: string = "eng";
  destLang: string = "tr";
  srcLangList: any = [{val: "eng",text: "English"},{val:"tur",text:"Turkish"},
  {val:"ell",text:"Greek - Modern"},{val:"rus",text:"Russian"}];
  destLangList: any = [{val: "en",text: "English"},{val:"tr",text:"Turkish"},
  {val:"el",text:"Greek - Modern"},{val:"ru",text:"Russian"}];
  constructor(public navCtrl: NavController, private camera: Camera, private loadingCtrl: LoadingController, private modalCtrl: ModalController,
    private http: Http, private toastCtrl: ToastController) {}
  loading = (() => {
    let loadMessage: Loading;
    return {
      turnOn: () => {
        loadMessage = this.loadingCtrl.create({content: ''});
        loadMessage.present();
      },
      turnOff: () => loadMessage.dismiss()
    };
  })();
  takePhoto(sourceType:number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
      allowEdit: false
    }
    this.camera.getPicture(options).then((imageData) => {
      let cropModal = this.modalCtrl.create(CropImagePage, { imageData: 'data:image/jpeg;base64,' + imageData });
      cropModal.onDidDismiss(data => {
        if(data != null){
          this.loading.turnOn();
          let dataToSend = {
            type: "img",
            srcLang: this.srcLang,
            destLang: this.destLang,
            image: data
          };
          this.http.post('http://' + this.ip + ':8080/', JSON.stringify(dataToSend), new RequestOptions({ headers: new Headers({'Content-Type' : 'application/json'})}))
          .subscribe((data) => {
            this.loading.turnOff();
            let dataJson = data.json();
            this.navCtrl.push(ResultPage, {dText:dataJson.dText, tText:dataJson.tText, ip: this.ip, srcLang: this.srcLang, destLang: this.destLang});
          }, (error) => {
            this.loading.turnOff();
            this.toastCtrl.create({
              message: error.status.toString(),
              duration: 3000
            }).present();
          });
        }
      });
      cropModal.present();
    }, (err) => {
      // Handle error
    });
  }
}
