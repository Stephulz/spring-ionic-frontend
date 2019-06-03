import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  }

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService,
    public loadingCtrl: LoadingController) {

  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidEnter() {
    let loader = this.presentLoading();
    this.auth.refreshToken()
      .subscribe(res => {
        this.auth.successfulLogin(res.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
        loader.dismiss();
      },
        error => {
          loader.dismiss();
        });
  }

  login() {
    let loader = this.presentLoading();
    this.auth.authenticate(this.creds)
      .subscribe(res => {
        this.auth.successfulLogin(res.headers.get('Authorization'))
        this.navCtrl.setRoot('CategoriasPage');
        loader.dismiss();
      },
        error => {
          loader.dismiss();
        });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    return loader;
  }
}
