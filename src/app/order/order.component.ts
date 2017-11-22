import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {OrderService} from "../shared/services/order.service";
import {CartService} from "../shared/services/cart.service";
import {NavigationEnd, Router} from "@angular/router";
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

declare var braintree: any;


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]

})
export class OrderComponent implements OnInit, OnDestroy {
  orderData: any;
  success: boolean = false;
  payment_method_nonce;
  order_token;
  subscription;

  constructor(private us: UserService, private os: OrderService, private router: Router) {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }

  ngOnInit() {
    this.subscription = this.os.getOrderData(this.us.getAuthDetails().username).subscribe(data => {
      this.orderData = data;
      var c = this;
      braintree.setup(data.client_token, "dropin", {
        container: "payment-form",
        onPaymentMethodReceived: function (obj) {
          // console.log(obj);
          // console.log(obj.nonce);
          if (obj.nonce) {
            let payment_method_nonce = obj.nonce;
            let order_token = data.order_token;
            c.os.orderConform({payment_method_nonce, order_token}).subscribe(zzz => {
              console.log("your order is OK.");
              localStorage.removeItem('cart_token');
              c.router.navigate(['/done']);
              window.location.reload();


            });
          }
        }
      });
    });
  }
}
