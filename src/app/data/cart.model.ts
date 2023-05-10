import {CartEntryModel} from "./cartentry.model";

export class CartModel {

  id: string | undefined
  version: number | undefined
  customerId: string | undefined
  entries : CartEntryModel[] = []
  totalPrice: number | undefined

}
