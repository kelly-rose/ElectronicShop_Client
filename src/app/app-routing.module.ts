import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductsComponent} from "./products/products.component";
import {ProductDetailComponent} from "./products/product-detail/product-detail.component";
import {CartComponent} from "./cart/cart.component";
import {AddressComponent} from "./address/address.component";
import {OrderComponent} from "./order/order.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {SearchComponent} from "./search/search.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {ProductListComponent} from "./products/product-list/product-list.component";
import {DoneComponent} from "./done/done.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: ':categories',
        component: ProductListComponent
      },
    ]
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'address',
    component: AddressComponent
  },
  {
    path: 'order',
    component: OrderComponent
  },
  {
    path: 'done',
    component: DoneComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
