import {PriceModel} from "./price.model";

export class ProductModel {

  id: string | undefined
  name: string | undefined
  description: | undefined
  author: string | undefined
  price: PriceModel | undefined
  imageUrl: string | undefined
  releaseYear: string | undefined
  numberOfPages: number | undefined
  isbn: string | undefined

}
