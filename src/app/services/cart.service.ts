import {Injectable} from '@angular/core';
import {CartModel} from "../data/cart.model";
import {Subject} from "rxjs";
import {ProductModel} from "../data/product.model";
import apiRoot from "./builder/BuildClient";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private currentCart : CartModel | undefined

  cartSubject = new Subject<CartModel>()

  constructor() {

  }

  retrieveCurrentCart() {
    this.getActiveCart()
  }

  addToCart(product: ProductModel) {

  }

  private getActiveCart() {
    apiRoot
      .me()
      .activeCart()
      .get()
      .execute()
      .then(({body}: any) => {
        this.buildCartAndNext(body)
      })
      .catch(this.createCart.bind(this))
  }

  private createCart() {
    apiRoot
      .me()
      .carts()
      .post({
        body: {
          currency: 'EUR'
        }
      })
      .execute()
      .then(({body}: any) => {
        this.buildCartAndNext(body)
      })
  }

  private buildCartAndNext(body: any) {
    this.currentCart = new CartModel()
    this.currentCart.id = body.id
    this.currentCart.version = body.version
    this.currentCart.customerId = body.anonymousId
    this.currentCart.entries = []
    this.currentCart.totalPrice = body.totalPrice.centAmount / 100
    this.cartSubject.next(this.currentCart)
  }

}
