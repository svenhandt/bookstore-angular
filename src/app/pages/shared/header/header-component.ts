import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../../services/category.service";
import {CategoryModel} from "../../../data/category.model";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  categories: CategoryModel[] = []
  categoriesSubscription: Subscription | undefined
  queryParamsSubscription: Subscription | undefined
  selectedCategory: CategoryModel | undefined
  selectedCategoryKey: string = ''

  constructor(private categoryService: CategoryService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      const categoryKey = params['category']
      if(categoryKey) {
        this.selectedCategoryKey = categoryKey
      }
    })
    this.categoriesSubscription = this.categoryService.categoriesSubject.subscribe(
      (categories: CategoryModel[]) => {
        this.categories = categories
      }
    )
    this.categoryService.loadAllCategories()
  }

  navigateToCategory(category: CategoryModel) {
    this.router.navigate(['/product-list'],
      {queryParams: {
        category: category.key
        }})
    this.selectedCategory = category
  }

  ngOnDestroy(): void {
    if(this.categoriesSubscription !== undefined) {
      this.categoriesSubscription.unsubscribe()
    }
  }

}
