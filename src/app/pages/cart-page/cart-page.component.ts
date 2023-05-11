import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {CartModel} from "../../data/cart.model";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  currentCart$: Observable<CartModel>

  constructor(private cartService: CartService) {

  }

  ngOnInit(): void {
    this.currentCart$ = this.cartService.currentCart$
  }

}
