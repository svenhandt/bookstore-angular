import {CartEntryModel} from "./cartentry.model";

export class CartModel {

  id: string | undefined
  customerId: string | undefined
  entries : CartEntryModel[] | undefined
  totalPrice: number | undefined

}
