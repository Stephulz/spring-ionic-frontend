import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;
  profileImage;
  randomNumber: number;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public sanitizer: DomSanitizer
  ) {
    this.profileImage = 'assets/imgs/avatar-blank.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');    
    this.loadData();
    this.randomNumber = Math.random() * 5;    
  }

  loadData() {
    let loader = this.presentLoading();
    let localUser = this.storage.getLocalUser();
    this.profileImage = this.randomNumber;
    console.log("LOCAL USER: " + localUser.token + " LOCAL EMAIL: " + localUser.email);
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(res => {
          this.cliente = res as ClienteDTO;
          this.getImageIfExists();
          loader.dismiss();
        },
          error => {
            if (error.status == 403) {
              loader.dismiss();
              this.navCtrl.setRoot('HomePage');
            }
          });
    }
    else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  // https://gist.github.com/frumbert/3bf7a68ffa2ba59061bdcfc016add9ee
  getImageIfExists() {
    this.profileImage = Math.random() * 5;
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(res => {
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
        this.blobToDataURL(res).then(dataURL => {
          let str: string = dataURL as string;
          this.profileImage = this.sanitizer.bypassSecurityTrustUrl(str)
        });
      },
        error => {
          this.profileImage = 'assets/imgs/avatar-blank.png';
        });
  }

  blobToDataURL(blob) {
    return new Promise((fulfill, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => fulfill(reader.result);
      reader.readAsDataURL(blob);
    })
  }

  getCameraPicture() {
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  getGalleryPicture() {
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  sendPicture() {
    let loader = this.presentLoading();
    this.clienteService.uploadPicture(this.picture)
      .subscribe(res => {
        this.picture = null;
        this.getImageIfExists();
        loader.dismiss();
      },
        error => {
          loader.dismiss();
        });
  }

  cancel() {
    this.picture = null;
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    return loader;
  }

}
