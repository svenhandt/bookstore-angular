import {Inject, Injectable, LOCALE_ID, OnInit} from '@angular/core';
import {createApiBuilderFromCtpClient} from "@commercetools/platform-sdk";
import {ctpClient} from "./builder/BuildClient";
import {CategoryModel} from "../data/category.model";
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiRoot: any

  private categories: CategoryModel[] = []
  private selectedCategory: CategoryModel | undefined

  categoriesSubject = new Subject<CategoryModel[]>()
  selectedCategorySubject = new Subject<CategoryModel>()

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.apiRoot = createApiBuilderFromCtpClient(ctpClient)
      .withProjectKey({ projectKey: environment.projectKey });
    this.loadAllCategories()
  }

  loadAllCategories() {
    this
      .apiRoot
      .categories()
      .get()
      .execute()
      .then(({body}: any) => {
        const results: any[] = body.results
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

  buildCategory(result: any) {
    const category = new CategoryModel(
      result.id,
      result.key,
      result.name[this.locale],
      result.description[this.locale])
    return category
  }


}
