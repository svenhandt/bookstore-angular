import {Injectable} from '@angular/core';
import {CartModel} from "../data/cart.model";
import {BehaviorSubject, Subject} from "rxjs";
import {ProductModel} from "../data/product.model";
import apiRoot from "./builder/BuildClient";
import {CartEntryModel} from "../data/cartentry.model";
import {ProductService} from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartSubject = new BehaviorSubject<CartModel>(new CartModel())
  currentCart$ = this.cartSubject.asObservable()

  constructor(private productService: ProductService) {

  }

  retrieveCurrentCart() {
    this.getActiveCart()
  }

  addToCart(product: ProductModel) {
    const currentCart = this.cartSubject.getValue()
    if(currentCart) {
      const id = currentCart.id
      const version = currentCart.version
      if(id && version) {
        apiRoot
          .me()
          .carts()
          .withId({ID: id})
          .post({
            body: {
              version: version,
              actions: [
                {
                  action: 'addLineItem',
                  productId: product.id
                }
              ]
            }
          })
          .execute()
          .then(({body}: any) => {
            console.log(body)
            this.getActiveCart()
          })

      }
    }
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
    const cart = new CartModel()
    cart.id = body.id
    cart.version = body.version
    cart.customerId = body.anonymousId
    this.buildCartEntries(cart, body)
    cart.totalPrice = body.totalPrice.centAmount / 100
    this.cartSubject.next(cart)
  }

  private buildCartEntries(cart: CartModel, body: any) {
    const lineItems: any[] = body.lineItems
    if(lineItems) {
      for(const lineItem of lineItems) {
        const cartEntry : CartEntryModel = new CartEntryModel()
        cartEntry.id = lineItem.id
        this.setProductForCartEntry(cart, cartEntry, lineItem.productId)
      }
    }
  }


  private setProductForCartEntry(cart: CartModel, cartEntry: CartEntryModel, productId: string) {
    apiRoot
      .productProjections()
      .withId({ID: productId})
      .get()
      .execute()
      .then(({body}: any) => {
        console.log(body)
        if(body) {
          const product = this.productService.buildProduct(body)
          cartEntry.product = product
          cart.entries?.push(cartEntry)
          this.cartSubject.next(cart)
          console.log(cart)
        }
      })
  }

}
