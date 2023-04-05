import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {ProductListPageComponent} from "./pages/product-list-page/product-list-page.component";
import {ProductDetailsPageComponent} from "./pages/product-details-page/product-details-page.component";
import {CartPageComponent} from "./pages/cart-page/cart-page.component";
import {CheckoutPageComponent} from "./pages/checkout-page/checkout-page.component";
import {CheckoutSummaryPageComponent} from "./pages/checkout-summary-page/checkout-summary-page.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomepageComponent},
  {path: 'product-list', component: ProductListPageComponent},
  {path: 'product-details', component: ProductDetailsPageComponent},
  {path: 'cart', component: CartPageComponent},
  {path: 'checkout', component: CheckoutPageComponent},
  {path: 'checkout-summary', component: CheckoutSummaryPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
