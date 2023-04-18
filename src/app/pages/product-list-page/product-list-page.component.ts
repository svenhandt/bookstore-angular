import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {CurrentPageService} from "../../services/util/current-page.service";
import {CategoryService} from "../../services/category.service";
import {CategoryModel} from "../../data/category.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.css']
})
export class ProductListPageComponent implements OnInit, OnDestroy {

  currentCategory: CategoryModel | undefined
  categorySubscription: Subscription | undefined

  paramsSubscription: Subscription | undefined

  constructor(private route: ActivatedRoute,
              private currentPageService: CurrentPageService,
              private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.paramsSubscription = this.route.queryParams.subscribe((params: Params) => {
      const categoryKey = params['category']
      if(categoryKey) {
        this.categoryService.setSelectedCategory(categoryKey)
      }
    })
    this.categorySubscription = this.categoryService.selectedCategorySubject.subscribe((category: CategoryModel) => {
      this.currentCategory = category
    })
    this.currentPageService.setCurrentComponentName(this.route.component?.name)
  }

  ngOnDestroy(): void {
    if(this.paramsSubscription) {
      this.paramsSubscription.unsubscribe()
    }
    if(this.categorySubscription) {
      this.categorySubscription.unsubscribe()
    }
  }

}
