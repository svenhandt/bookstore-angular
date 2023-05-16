import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {
  ClientResponse,
  Customer,
  CustomerDraft,
  CustomerSignInResult,
  MyCustomerDraft
} from "@commercetools/platform-sdk";
import apiRoot from "./builder/BuildClient";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  currentCustomerSubject = new BehaviorSubject<Customer>(null)
  currentCustomer$ = this.currentCustomerSubject.asObservable()

  constructor() {

  }

  registerCustomer(newCustomer: MyCustomerDraft) {
    apiRoot.me()
      .signup()
      .post(
        {
          body: newCustomer
        }
      )
      .execute()
      .then(({body}: ClientResponse<CustomerSignInResult>) => {
        console.log(body)
      })
  }

}
