import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {createApiBuilderFromCtpClient} from "@commercetools/platform-sdk";
import {ctpClient} from "./builder/BuildClient";
import {environment} from "../../environments/environment";
import {ProductModel} from "../data/product.model";
import {PriceModel} from "../data/price.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiRoot: any

  productsSubject = new Subject<ProductModel[]>()

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.apiRoot = createApiBuilderFromCtpClient(ctpClient)
      .withProjectKey({ projectKey: environment.projectKey });
  }

  loadProductsForCategory(categoryId: string) {
    const products: ProductModel[] = []
    this.apiRoot
      .productProjections()
      .get({
        queryArgs: {
          where: `categories(id = "${categoryId}")`
        }
      }).execute()
      .then(({body}: any) => {
        const results: any[] = body.results
        for(const result of results) {
          products.push(this.buildProduct(result))
        }
        this.productsSubject.next(products)
      })
  }

  private buildProduct(rawProduct: any) {
    const product = new ProductModel()
    product.id = rawProduct.id
    product.name = rawProduct.name[this.locale]
    product.description = rawProduct.description[this.locale]
    this.setAuthor(product, rawProduct)
    product.price = this.buildPrice(rawProduct.masterVariant)
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
    if(authorData) {
      product.author = authorData.value
    }
  }

  private setImage(product: ProductModel, rawProduct: any) {
    const images = rawProduct.masterVariant.images
    if(images && images.length > 0) {
      product.imageUrl = images[0].url
    }
  }

  private buildPrice(masterVariant: any) {
    const price = new PriceModel()
    const rawPrices = masterVariant.prices
    if(rawPrices && rawPrices.length > 0) {
      const rawPrice = rawPrices[0]
      if(rawPrice.value) {
        price.centAmount = rawPrice.value.centAmount
        price.decimals = rawPrice.value.fractionDigits
        price.currency = rawPrice.value.currencyCode
      }
    }
    return price
  }

  private setReleaseYear(product: ProductModel, rawProduct: any) {
    const releaseYearData = rawProduct.masterVariant.attributes.find((attribute: any) => {
      return attribute.name === 'publishingYear'
    })
    if(releaseYearData && typeof releaseYearData.value === 'string') {
      product.releaseYear = releaseYearData.value.substring(0, 4)             //Year
    }
  }

  private setIsbn(product: ProductModel, rawProduct: any) {
    const isbnData = rawProduct.masterVariant.attributes.find((attribute: any) => {
      return attribute.name === 'isbn'
    })
    if(isbnData) {
      product.isbn = isbnData.value
    }
  }

  private setNumberOfPages(product: ProductModel, rawProduct: any) {
    const numberOfPagesData = rawProduct.masterVariant.attributes.find((attribute: any) => {
      return attribute.name === 'numberOfPages'
    })
    if(numberOfPagesData) {
      product.numberOfPages = numberOfPagesData.value
    }
  }

}
