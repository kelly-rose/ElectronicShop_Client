import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-done',
  template: `
    <div class="jumbotron text-center">
      <h1>Your Order Is Completed.</h1>
      <p>Going to main page <a routerLink="/">home</a>.</p>
    </div>
  `,
  styles: []
})
export class DoneComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    console.log("I am done");
  }

}
