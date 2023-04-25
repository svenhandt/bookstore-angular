import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {CurrentPageService} from "../../services/util/current-page.service";
import {CategoryService} from "../../services/category.service";
import {CategoryModel} from "../../data/category.model";
import {Subscription, switchMap} from "rxjs";
import {ProductService} from "../../services/product.service";
import {ProductModel} from "../../data/product.model";

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.css']
})
export class ProductListPageComponent implements OnInit, OnDestroy {

  currentCategory: CategoryModel | undefined
  products: ProductModel[] = []

  paramsSubscription: Subscription | undefined
  productsSubscription : Subscription | undefined

  sortByTitle: boolean = false
  sortByPrice: boolean = false

  constructor(private route: ActivatedRoute,
              private currentPageService: CurrentPageService,
              private categoryService: CategoryService,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.sortByTitle = true
    this.productsSubscription = this.categoryService.selectedCategorySubject.pipe(switchMap((value: CategoryModel, index: number) => {
      this.currentCategory = value
      console.log('category: ' + this.currentCategory)
      this.productService.loadProductsForCategory(this.currentCategory.id)
      return this.productService.productsSubject
    })).subscribe((products: ProductModel[]) => {
      this.products = products
    })
    if(this.categoryService.categoriesLoaded()) {
      this.subscribeToParamsCategoriesLoaded()
    }
    else {
      this.subscribeToParamsCategoriesNotLoaded()
    }
    this.currentPageService.setCurrentComponentName(this.route.component?.name)
  }

  subscribeToParamsCategoriesLoaded() {
    this.paramsSubscription = this.route.queryParams.subscribe((params: Params) => {
      this.setSelectedCategory(params)
    })
  }

  subscribeToParamsCategoriesNotLoaded() {
    this.paramsSubscription = this.categoryService.categoriesSubject.pipe(switchMap((value: CategoryModel[], index: number) => {
      return this.route.queryParams
    })).subscribe((params: Params) => {
      this.setSelectedCategory(params)
    })
  }

  setSelectedCategory(params: Params) {
    const categoryKey = params['category']
    if(categoryKey) {
      this.categoryService.setSelectedCategory(categoryKey)
    }
  }

  ngOnDestroy(): void {
    if(this.paramsSubscription) {
      this.paramsSubscription.unsubscribe()
    }
    if(this.productsSubscription) {
      this.productsSubscription.unsubscribe()
    }
  }

}
