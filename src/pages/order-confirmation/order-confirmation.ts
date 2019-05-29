import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item.dto';
import { CartService } from '../../services/domain/cart.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codPedido: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService,
    public loadingCtrl: LoadingController) {

    this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderConfirmationPage');
    this.cartItems = this.cartService.getCart().items;

    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(res => {
        this.cliente = res as ClienteDTO;
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, res['enderecos']);
      },
        error => {
          this.navCtrl.setRoot('HomePage')
        });

        console.log("PEDIDO: " + JSON.stringify(this.pedido));
  }


  private findEndereco(id: string, list: EnderecoDTO[]): EnderecoDTO {
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }

  total(): number {
    return this.cartService.total();
  }

  back() {
    this.navCtrl.setRoot('CartPage');
  }

  home  () {
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout() {
    let loader = this.presentLoading();
    this.pedidoService.insert(this.pedido)
      .subscribe(res => {
        this.cartService.createOrClearCart();
        this.codPedido = this.extractId(res.headers.get('location'));
        loader.dismiss(); 
      },
    error => {
      loader.dismiss();
      if (error.status == 403) {
        this.navCtrl.setRoot('HomePage');
      }
    });
  }

  private extractId(location: string) : string {
    let position = location.lastIndexOf('/');
    return location.substring(position + 1, location.length);
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    return loader;
  }
  
}
