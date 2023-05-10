import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {ProductModel} from "../data/product.model";
import {BehaviorSubject, Subject} from "rxjs";
import apiRoot from "./builder/BuildClient";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productsSubject = new BehaviorSubject<ProductModel[]>([])
  currentProductSubject = new BehaviorSubject<ProductModel>(new ProductModel())

  currentProduct: ProductModel | undefined

  constructor(@Inject(LOCALE_ID) private locale: string) {

  }

  loadProductsForCategory(categoryId: string) {
    if (categoryId) {
      this.loadProducts({
        queryArgs: {
          filter: `categories.id: "${categoryId}"`,
          sort: `name.${this.locale} asc`
        }
      })
    }
  }

  loadProductsForSearchQuery(searchQuery: string) {
    this.loadProducts({queryArgs: {
        'text.de-DE': searchQuery
      }
    })
  }

  loadProducts(queryArgsObj: any) {
    const products: ProductModel[] = []

    apiRoot
      .productProjections()
      .search()
      .get(queryArgsObj)
      .execute()
      .then(({body}: any) => {
        const results: any[] = body.results
        for (const result of results) {
          products.push(this.buildProduct(result))
        }
        this.productsSubject.next(products)
      })
  }


  loadProductForId(productId: string) {
    if (productId) {
      if (this.currentProduct && this.currentProduct.id === productId) {
        this.currentProductSubject.next(this.currentProduct)
      } else {
        this.loadProductFromCommercetools(productId)
      }
    }
  }

  private loadProductFromCommercetools(productId: string) {
    apiRoot
      .productProjections()
      .withId({ID: productId})
      .get()
      .execute()
      .then(({body}: any) => {
        console.log(body)
        if(body) {
          this.currentProduct = this.buildProduct(body)
          this.currentProductSubject.next(this.currentProduct)
        }
      })
  }

  buildProduct(rawProduct: any) {
    const product = new ProductModel()
    product.id = rawProduct.id
    product.name = rawProduct.name[this.locale]
    product.description = rawProduct.description[this.locale]
    this.setAuthor(product, rawProduct)
    this.setPrice(product, rawProduct.masterVariant)
    this.setImage(product, rawProduct)
    this.setReleaseYear(product, rawProduct)
    this.setIsbn(product, rawProduct)
    this.setNumberOfPages(product, rawProduct)
    return product
  }

  private setAuthor(product: ProductModel, rawProduct: any) {
    const authorData = rawProduct.masterVariant.attributes.find((attribute: any) => {
      return attribute.name === 'author'
    })
    if (authorData) {
      product.author = authorData.value
    }
  }

  private setImage(product: ProductModel, rawProduct: any) {
    const images = rawProduct.masterVariant.images
    if (images && images.length > 0) {
      product.imageUrl = images[0].url
    }
  }

  private setPrice(product: ProductModel, masterVariant: any) {
    const rawPrices = masterVariant.prices
    if (rawPrices && rawPrices.length > 0) {
      const rawPrice = rawPrices[0]
      if (rawPrice.value) {
        product.price = rawPrice.value.centAmount / 100
      }
    }

  }

  private setReleaseYear(product: ProductModel, rawProduct: any) {
    const releaseYearData = rawProduct.masterVariant.attributes.find((attribute: any) => {
      return attribute.name === 'publishingYear'
    })
    if (releaseYearData && typeof releaseYearData.value === 'string') {
      product.releaseYear = releaseYearData.value.substring(0, 4)             //Year
    }
  }

  private setIsbn(product: ProductModel, rawProduct: any) {
    const isbnData = rawProduct.masterVariant.attributes.find((attribute: any) => {
      return attribute.name === 'isbn'
    })
    if (isbnData) {
      product.isbn = isbnData.value
    }
  }

  private setNumberOfPages(product: ProductModel, rawProduct: any) {
    const numberOfPagesData = rawProduct.masterVariant.attributes.find((attribute: any) => {
      return attribute.name === 'numberOfPages'
    })
    if (numberOfPagesData) {
      product.numberOfPages = numberOfPagesData.value
    }
  }

}
