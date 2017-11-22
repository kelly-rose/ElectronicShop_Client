import { BrowserModule } from '@angular/platform-browser';
import { NgModule,APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import {NouisliderModule} from "ng2-nouislider/src/nouislider";
import { HomeComponent } from './home/home.component';
import {NotFoundComponent} from "./not-found/not-found.component";
import {HttpModule} from "@angular/http";
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { AddressComponent } from './address/address.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SearchComponent } from './search/search.component';
import {AppRoutingModule} from "./app-routing.module";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/do';
import {AsyncFormValidatorsService} from "./shared/services/async-form-validators.service";
import {UserService} from "./shared/services/user.service";
import {HelpersService} from "./shared/services/helpers.service";
import {StartupService} from "./shared/services/startup.service";
import {CategoryService} from "./shared/services/category.service";
import { CategoriesComponent } from './categories/categories.component';
import {ProductService} from "./shared/services/product.service";
import { ProductListComponent } from './products/product-list/product-list.component';
import {CartService} from "./shared/services/cart.service";
import {AddrService} from "./shared/services/addr.service";
import {CoreModule} from "./core.module";
import {OrderService} from "./shared/services/order.service";
import {DoneComponent} from "./done/done.component";

export function startServiceFactory(ss: StartupService): () => Promise<any> {
  return () => ss.load();
}

@NgModule({
  declarations: [
    DoneComponent,
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ProductsComponent,
    CartComponent,
    OrderComponent,
    AddressComponent,
    ProductDetailComponent,
    CheckoutComponent,
    SearchComponent,
    CategoriesComponent,
    ProductListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    HttpModule,
    CoreModule,
    AppRoutingModule
  ],
  providers: [OrderService,AddrService,ProductService,CategoryService,AsyncFormValidatorsService,UserService,HelpersService,StartupService,CartService,
    // service to get csrf token cookie from server before app initialization
    // otherwise each call to the django server will return a '403 Forbidden' error
    {
      provide: APP_INITIALIZER,
      useFactory: startServiceFactory,
      deps: [StartupService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
