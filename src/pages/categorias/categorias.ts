import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';
import { CategoriaDTO } from '../../models/categoria.dto';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  items: CategoriaDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public categoriaService: CategoriaService) {

  }

  ionViewDidLoad() {
    this.categoriaService.findAll()
      .subscribe(res => {
        console.log("this.categoriaService.findAll() ", res);
        this.items = res;
      },
        error => {
          console.log("ERROR: ", error);
        });
    console.log('ionViewDidLoad CategoriasPage');
  }

}
