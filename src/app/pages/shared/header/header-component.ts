import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../../services/category.service";
import {CategoryModel} from "../../../data/category.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  categories: CategoryModel[] = []
  categoriesSubscription: Subscription | undefined

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAllCategories()
    this.categoriesSubscription = this.categoryService.categoriesSubject.subscribe(
      (categories: CategoryModel[]) => {
        this.categories = categories
      }
    )
  }

  ngOnDestroy(): void {
    if(this.categoriesSubscription !== undefined) {
      this.categoriesSubscription.unsubscribe()
    }
  }

}
