import {ProductModel} from "./product.model";

export class CartEntryModel {

  id: string | undefined
  product: ProductModel | undefined
  amount: number | undefined
  entryTotalPrice: number | undefined

}
