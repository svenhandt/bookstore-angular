import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {CategoryModel} from "../data/category.model";
import {BehaviorSubject, Subject} from "rxjs";
import apiRoot from "./builder/BuildClient";
import {Category, CategoryPagedQueryResponse, ClientResponse} from "@commercetools/platform-sdk";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: CategoryModel[] = []
  private selectedCategory: CategoryModel

  categoriesSubject = new BehaviorSubject<CategoryModel[]>([])
  selectedCategorySubject = new BehaviorSubject<CategoryModel>(null)

  categories$ = this.categoriesSubject.asObservable()
  selectedCategory$ = this.selectedCategorySubject.asObservable()

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.loadAllCategories()
  }

  loadAllCategories() {
    apiRoot
      .categories()
      .get()
      .execute()
      .then(({body}: ClientResponse<CategoryPagedQueryResponse>) => {
        const results: Category[] = body.results
        for(const result of results) {
          this.categories.push(this.buildCategory(result))
        }
        this.categoriesSubject.next(this.categories)
      })
  }

  categoriesLoaded() {
    return this.categories.length > 0
  }

  setSelectedCategory(key: string) {
    if(!key) {
      this.selectedCategory = new CategoryModel('', '', '', '')
    }
    if(this.categories && key) {
      this.selectedCategory = this.categories.find(category => {
        return key === category.key
      })
    }
    if(this.selectedCategory) {
      this.selectedCategorySubject.next(this.selectedCategory)
    }
  }

  buildCategory(result: Category) {
    const category = new CategoryModel(
      result.id,
      result.key,
      result.name[this.locale],
      result.description[this.locale])
    return category
  }


}
