import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../../services/category.service";
import {CategoryModel} from "../../../data/category.model";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {CurrentPageService} from "../../../services/util/current-page.service";

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  categories: CategoryModel[] = []
  selectedCategory: CategoryModel | undefined

  categoriesSubscription: Subscription | undefined
  selectedCategorySubscription: Subscription | undefined

  constructor(private categoryService: CategoryService,
              private router: Router) { }

  ngOnInit(): void {
    this.categoriesSubscription = this.categoryService.categoriesSubject.subscribe((categories: CategoryModel[]) => {
      this.categories = categories
    })
    this.selectedCategorySubscription = this.categoryService.selectedCategorySubject.subscribe((category: CategoryModel) => {
      this.selectedCategory = category
    })
  }

  navigateToCategory(category: CategoryModel) {
    this.router.navigate(['/product-list'],
      {queryParams: {
        category: category.key
        }})
    this.categoryService.setSelectedCategory(category.key)
  }

  resetSelectedCategory() {
    this.categoryService.setSelectedCategory('')
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
