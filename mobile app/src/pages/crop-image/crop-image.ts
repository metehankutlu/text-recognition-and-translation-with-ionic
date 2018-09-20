import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import Cropper from 'cropperjs'

/**
 * Generated class for the CropImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-image',
  templateUrl: 'crop-image.html',
})
export class CropImagePage {
  @ViewChild('image') Image: ElementRef;
  imageData: string;
  cropper: Cropper;
  rangeValue: number;
  oldRangeValue: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.imageData = navParams.get('imageData');
  }
  cropperLoad() {
    this.cropper = new Cropper(this.Image.nativeElement, {
         modal: true,
         guides: true,
         highlight: false,
         background: false,
         //autoCrop: true,
         //autoCropArea: 0.9,
         responsive: true,
         zoomable: true,
         movable: true,
         rotatable: true
     });
  }
  finish() {
    this.viewCtrl.dismiss(this.cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.5));
  }
  degreeChange() {
    this.cropper.rotate(this.oldRangeValue*(-1));
    this.cropper.rotate(this.rangeValue);
    this.oldRangeValue = this.rangeValue;
  }
}
