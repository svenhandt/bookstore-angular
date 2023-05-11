import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from "../../../services/category.service";
import {CategoryModel} from "../../../data/category.model";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {CartService} from "../../../services/cart.service";
import {CartModel} from "../../../data/cart.model";

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  categories: CategoryModel[] = []
  selectedCategory: CategoryModel
  currentCart$: Observable<CartModel>

  categoriesSubscription: Subscription
  selectedCategorySubscription: Subscription

  @ViewChild('searchForm', {static: false}) searchForm: NgForm

  constructor(private categoryService: CategoryService,
              private cartService: CartService,
              private router: Router) { }

  ngOnInit(): void {
    this.categoriesSubscription = this.categoryService.categoriesSubject.subscribe((categories: CategoryModel[]) => {
      this.categories = categories
    })
    this.selectedCategorySubscription = this.categoryService.selectedCategorySubject.subscribe((category: CategoryModel) => {
      this.selectedCategory = category
    })
    this.currentCart$ = this.cartService.currentCart$
    this.cartService.retrieveCurrentCart()
  }

  navigateToCategory(category: CategoryModel) {
    this.router.navigate(['/product-list'],
      {queryParams: {
        category: category.key
        }})
    this.categoryService.setSelectedCategory(category.key)
  }

  onSubmitSearchForm() {
    if(this.searchForm) {
      const input = this.searchForm.value.searchInput
      if(input) {
        this.router.navigate(['/product-list'],
          {queryParams: {
              q: input
            }})
        this.resetSelectedCategory()
      }
    }

  }

  resetSelectedCategory() {
    this.categoryService.setSelectedCategory('')
  }

  getCurrentCartLength(cart: CartModel | null) {
    let result = 0
    if(cart && cart.entries)  {
      result = cart.entries.length
    }
    return result
  }

  ngOnDestroy(): void {
    if(this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe()
    }
    if(this.selectedCategorySubscription) {
      this.selectedCategorySubscription.unsubscribe()
    }
  }

}
