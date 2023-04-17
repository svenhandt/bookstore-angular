import {Inject, Injectable, LOCALE_ID, OnInit} from '@angular/core';
import {createApiBuilderFromCtpClient} from "@commercetools/platform-sdk";
import {ctpClient} from "./builder/BuildClient";
import {CategoryModel} from "../data/category.model";
import {Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiRoot: any

  categoriesSubject = new Subject<CategoryModel[]>()

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.apiRoot = createApiBuilderFromCtpClient(ctpClient)
      .withProjectKey({ projectKey: 'bookstore-17091979' });
  }

  loadAllCategories() {
    let categories: CategoryModel[] = []
    console.log(this.locale)
    this
      .apiRoot
      .categories()
      .get()
      .execute()
      .then(({body}: any) => {
        const results: any[] = body.results
        for(let result of results) {
          categories.push(this.buildCategory(result))
        }
        this.categoriesSubject.next(categories)
      })
  }

  buildCategory(result: any) {
    const category = new CategoryModel(result.key,
      result.name[this.locale],
      result.description[this.locale])
    return category
  }


}
