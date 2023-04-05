import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {ProductListPageComponent} from "./pages/product-list-page/product-list-page.component";
import {ProductDetailsPageComponent} from "./pages/product-details-page/product-details-page.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomepageComponent},
  {path: 'product-list', component: ProductListPageComponent},
  {path: 'product-details', component: ProductDetailsPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
