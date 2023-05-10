import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductModel} from "../../data/product.model";
import {Subscription} from "rxjs";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, Params} from "@angular/router";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css']
})
export class ProductDetailsPageComponent implements OnInit, OnDestroy {

  product: ProductModel | undefined
  productSubscription: Subscription | undefined
  paramsSubscription: Subscription | undefined

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.productService.currentProductSubject.subscribe((product: ProductModel) => {
      this.product = product
    })
    this.paramsSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          let productId = params['id'];
          if(productId) {
            this.productService.loadProductForId(productId)
          }
        }
      );
  }

  onAddToCart() {
    if(this.product) {
      this.cartService.addToCart(this.product)
    }
  }

  ngOnDestroy(): void {
    if(this.productSubscription) {
      this.productSubscription.unsubscribe()
    }
  }

}
