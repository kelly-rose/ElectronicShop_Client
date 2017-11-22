import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ProductService} from "../../shared/services/product.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit,OnDestroy {
  products: any[];
  private subscription:Subscription;

  constructor(private service: ProductService, private route: ActivatedRoute) {  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
     this.route.params.forEach(param=>{
      console.log(param);

      // case URL : http://localhost:8000/products
      if(!param.categories){
        this.subscription= this.service.getAllProducts().subscribe(products=>{
          this.products=products;
          console.log(this.products);

        });
      }else{
        this.subscription=  this.service.getProducts(param.categories).subscribe(products=>{
          this.products=products;
          console.log(this.products);
        });

      }
    });
  }
}
