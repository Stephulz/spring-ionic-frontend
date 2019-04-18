import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public categoriaService: CategoriaService) {

  }

  ionViewDidLoad() {
    this.categoriaService.findAll().subscribe(res => {
      console.log(res);
    },
      error => {
      console.log(error);
      });
    console.log('ionViewDidLoad CategoriasPage');
  }

}
