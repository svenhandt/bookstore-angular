import { Injectable } from '@angular/core';
import {createApiBuilderFromCtpClient} from "@commercetools/platform-sdk";
import {ctpClient} from "./builder/BuildClient";
import {environment} from "../../environments/environment";
import {createAuthForAnonymousSessionFlow} from "@commercetools/sdk-client-v2";
import {CartModel} from "../data/cart.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiRoot: any
  private currentCart : CartModel | undefined

  cartSubject = new Subject<CartModel>()

  constructor() {
    this.apiRoot = createApiBuilderFromCtpClient(ctpClient)
      .withProjectKey({projectKey: environment.projectKey});
  }

  loadCart() {
    this.apiRoot
      .me()
      .carts()
      .post({
        body: {
          currency: 'EUR'
        }
      })
      .execute()
      .then(({body}: any) => {
        this.currentCart = new CartModel()
        this.currentCart.id = body.id
        this.currentCart.customerId = body.anonymousId
        this.currentCart.entries = []
        this.currentCart.totalPrice = body.totalPrice.centAmount / 100
        this.cartSubject.next(this.currentCart)
      })
  }

}
