import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../shared/services/category.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[];
  errorMessage: string = '';
  constructor(private cs:CategoryService) { }

  ngOnInit() {
    this.cs.getCategories().subscribe(categories => {
        console.log(categories);
        this.categories = categories;
      },
      err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

}
