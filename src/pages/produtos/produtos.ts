import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    console.log('ionViewDidLoad ProdutosPage');

    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe(res => {
        let start = this.items.length;
        this.items = this.items.concat(res['content']);
        let end = this.items.length - 1;
        console.log(this.page);
        console.log(this.items);
        this.loadImageUrls(start, end);
        loader.dismiss();
      },
        error => {
          loader.dismiss();
        });
  }

  loadDataRefresher() {
    console.log('ionViewDidLoad ProdutosPage');

    let categoria_id = this.navParams.get('categoria_id');
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe(res => {
        let start = this.items.length;
        this.items = this.items.concat(res['content']);
        let end = this.items.length - 1;
        console.log(this.page);
        console.log(this.items);
        this.loadImageUrls(start, end);
      },
        error => {
        });
  }

  loadImageUrls(start: number, end: number) {
    for (var i = start; i <= end; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(res => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`
        },
          error => {
          });
    }
  }

  showDetail(produtoId: string) {
    this.navCtrl.push('ProdutoDetailPage', { produto_id: produtoId });
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadDataRefresher();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadDataRefresher();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 2000);
  }

}
