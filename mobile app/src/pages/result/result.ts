import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {
  ip: string;
  srcLang: string;
  destLang: string;
  srcLangList: any = [{val: "eng",text: "English"},{val:"tur",text:"Turkish"},
  {val:"ell",text:"Greek - Modern"},{val:"rus",text:"Russian"}];
  destLangList: any = [{val: "en",text: "English"},{val:"tr",text:"Turkish"},
  {val:"el",text:"Greek - Modern"},{val:"ru",text:"Russian"}];
  dText: string;
  tText: string;
  @ViewChild('dInput') dInput: ElementRef;
  @ViewChild('tInput') tInput: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private http: Http) {
    this.ip = navParams.get('ip');
    this.srcLang = navParams.get('srcLang');
    this.destLang = navParams.get('destLang');
    this.dText = navParams.get('dText');
    this.tText = navParams.get('tText');
  }
  ngOnInit(): void {
        setTimeout(() => {
            this.resize();
        }, 500);
    }
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
  translate(){
    this.loading.turnOn();
    let dataToSend = {
      type: "txt",
      srcLang: this.srcLang,
      destLang: this.destLang,
      text: this.dText
    };
    this.http.post('http://' + this.ip + ':8080/', JSON.stringify(dataToSend), new RequestOptions({ headers: new Headers({'Content-Type' : 'application/json'})}))
    .subscribe((data) => {
      this.loading.turnOff();
      let dataJson = data.json();
      this.dText = dataJson.dText;
      this.tText = dataJson.tText;
    }, (error) => {
      this.loading.turnOff();
      this.toastCtrl.create({
        message: error.status.toString(),
        duration: 3000
      }).present();
    });
  }
  resize() {
      var dInput = this.dInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
      var dInputScrollHeight = dInput.scrollHeight;
      dInput.style.height = dInputScrollHeight + 'px';
      this.dInput['_elementRef'].nativeElement.style.height = (dInputScrollHeight + 16) + 'px';
      var tInput = this.tInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
      var tInputScrollHeight = dInput.scrollHeight;
      tInput.style.height = tInputScrollHeight + 'px';
      this.tInput['_elementRef'].nativeElement.style.height = (tInputScrollHeight + 16) + 'px';
  }
  ionViewDidLoad() {
    this.resize();
  }

}
