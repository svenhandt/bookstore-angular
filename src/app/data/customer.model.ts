import {AddressModel} from "./address.model";
import {CartModel} from "./cart.model";

export class CustomerModel {
  id: string
  version: number
  email: string
  firstName: string
  lastName: string
  address: AddressModel
  customerCart: CartModel
}
