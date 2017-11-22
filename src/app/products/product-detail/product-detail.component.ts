import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../shared/services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../../shared/services/cart.service";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  variation: any[];
  public qty: any=1;

  constructor(private us:UserService,private cs: CartService, private ps: ProductService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    console.log(this.us.user$.value);
    this.route.params.forEach(param => {
      this.ps.getProduct(param.id).subscribe(product => {
        this.product = product;
        this.variation = product.variation_set;
        console.log(this.product);
        console.log(this.variation);

      });


    });
  }

  saveCart(f) {
    console.log(f);
    console.log(this.qty);
    if(this.us.user$.value){
      f.username = this.us.user$.value.username;
    }

    //cf. 토큰이 없거나 기존에 있는 토큰이 아니라면 서버에서 카트를 새로 만들어버림..<<<고쳐야할듯...
    if (!localStorage.getItem('cart_token')) {

      this.cs.init_postCart(f).subscribe(data => {
        console.log(data);
        localStorage.setItem('cart_token',data.token);

        this.cs.getCart().subscribe(res=>{
          console.log(res);
        });
      });

      return;
    }
    this.cs.postCart(f,localStorage.getItem('cart_token')).subscribe(data => {
      console.log(data);
      console.log("cart item add OK");

      this.cs.getCart().subscribe(res=>{
        console.log(res);
      });

    });

  }

  goProducts() {
    this.router.navigateByUrl("/products");
  }
}
