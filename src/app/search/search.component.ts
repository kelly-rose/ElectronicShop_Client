import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ProductService} from "../shared/services/product.service";
import {
  ActivatedRoute, NavigationCancel, NavigationEnd, NavigationStart, Router,
  UrlSegment
} from "@angular/router";
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Subscription} from "rxjs/Rx";
import {CategoryService} from "../shared/services/category.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  private subscription_cs: Subscription;
  private subscription_ps: Subscription;
  public someValue: number;

  max_price: any;
  min_price: any;
  products: any[];
  public searchFilterForm: FormGroup;
  categories: any[];
  errorMessage: string = '';

   constructor(
     private location: Location,
     private router: Router,
     private formBuilder: FormBuilder,
     private cs: CategoryService,
     private route: ActivatedRoute,
     private ps: ProductService,) {
  }

  public ngOnInit() {
        this.searchFilterForm = this.formBuilder.group({
      range: [[0, 600]],
      search: ['',],
      searchCategories: this.formBuilder.array([])

    });
    // console.log(this.searchFilterForm.value);

    this.subscription_cs = this.cs.getCategories().subscribe(categories => {
        // console.log(categories);
        this.categories = categories;
      },
      err => {
        this.errorMessage = err;
        console.log(err);
      });

    //   this.router.events.subscribe((e) => {
    //   if (e instanceof NavigationEnd) {
    //     searchUrl=e.url.split("?")[1];
    //     console.log("맴맴맴맴");
    //     console.log(searchUrl);
    //   }
    // });
    let searchUrl:any;
    this.route.queryParams.forEach(params => {

      searchUrl= this.location.path().split("?")[1];
      // console.log("queryParams");
      console.log(params);


      this.subscription_ps = this.ps.getSearchProducts(searchUrl).subscribe(products => {
        this.products = products;
        console.log("FIRST 리퀘스트");

        // console.log(this.products);

      });
    });
  }

  getQueryParams() {
    this.router.navigate(['products/search'],
      {
        queryParams: {
          q: this.searchFilterForm.value.search,
          max_price: this.max_price,
          min_price: this.min_price,
          category_slug: this.searchFilterForm.value.searchCategories
        }
      });


    // let searchUrl:any;
    // searchUrl= this.location.path().split("?")[1];
    //
    // this.subscription_ps = this.ps.getSearchProducts(searchUrl).subscribe(products => {
    //   this.products = products;
    //   console.log("세컨드 리퀘스트");
    //   // console.log(this.products);
    //
    // });

  }

  onChange(slug: string, isChecked: boolean) {
    this.min_price = this.searchFilterForm.value.range[0];
    this.max_price = this.searchFilterForm.value.range[1];

    const emailFormArray = <FormArray>this.searchFilterForm.controls.searchCategories;

    if (isChecked) {
      emailFormArray.push(new FormControl(slug));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == slug);
      emailFormArray.removeAt(index);
    }
  }

  // onChange(){
  //   this.min_price= this.searchFilterForm.value.range[0];
  //   this.max_price=this.searchFilterForm.value.range[1];
  // }

  public ngOnDestroy() {
    this.subscription_ps.unsubscribe();
    this.subscription_cs.unsubscribe();

  }

}
