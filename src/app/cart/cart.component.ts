import {Component, OnInit} from '@angular/core';
import {CartService} from "../shared/services/cart.service";
import {UserService} from "../shared/services/user.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart_exist:boolean=true;
  cart_summary:any;
  cartItem: any;
  constructor(private cs: CartService,    public us: UserService,
  ) {
  }

  ngOnInit() {

    if (!localStorage.getItem('cart_token')) {
      console.log("Not exist Cart_Token");
      this.cart_exist=false;

      return;
    }

    this.cs.getCart().subscribe(cart => {
      this.cartItem = cart.items;

      if(this.cartItem.length===0){
        this.cart_exist=false;
        localStorage.removeItem('cart_token');
        this.cart_summary=null;
        return;
      }

      this.cart_summary={
        subtotal: cart.subtotal,
        total:cart.total,
        tax_total:cart.tax_total
      }

      // console.log(this.cartItem);
      // console.log(this.cart_summary);
      this.cart_exist=true;

      return;
    });

  }

  deleteItem(itemId) {
    this.cs.deleteItem(itemId).subscribe(() => {
      this.cs.getCart().subscribe(cart => {

        this.cartItem = cart.items;

        /*
        * Case : Empty Cart
         */
        if(this.cartItem.length===0){
          this.cart_exist=false;

          console.log('user cart empty!');
          localStorage.removeItem('cart_token');
          this.cart_summary=null;

          return;
        }

        this.cart_summary={
          subtotal: cart.subtotal,
          total:cart.total,
          tax_total:cart.tax_total
        }
        // console.log(this.cartItem);
        // console.log(this.cart_summary);

        this.cart_exist=true;

        return;
      });


    });
  }

}
