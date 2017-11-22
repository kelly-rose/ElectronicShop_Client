import {NavigationEnd, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {UserService} from './shared/services/user.service';
import {AsyncFormValidatorsService} from './shared/services/async-form-validators.service';
import {
  emailValidator,
  passwordMatchValidator,
  passwordValidator
} from './helper/form-validators';
import {CartService} from "./shared/services/cart.service";


declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  formError: boolean = false;
  formLoading: boolean = false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  searchForm: FormGroup;
  public qKeyword: any;
  navCartQty = 0;


  constructor(private fb: FormBuilder,
              private asyncValidators: AsyncFormValidatorsService,
              public us: UserService,
              private router: Router,
              private cs: CartService) {
    this.setupForm();
  }

  ngOnInit() {
    // after each navigation event ends, check if auth token is not expired
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd && !this.us.isAuth()) {
        this.us.logout();
      }

      if (ev instanceof NavigationEnd) {
        this.cs.getCart().subscribe(res => {
          console.log(res);
        });      }
    });

    this.cs.cartCreated$.subscribe(cart => {
      console.log(cart);
      let items = cart.items;
      let totalQty = 0;
      items.forEach(item => {
        totalQty += item.quantity;
      });

      console.log(totalQty);

      this.navCartQty = totalQty;
    });

    if (localStorage.getItem('cart_token')) {
      this.cs.getCart().subscribe(res => {
        console.log(res);
      });
    }
  }

  logout(): void {
    this.us.logout();
    localStorage.removeItem('cart_token');

    this.navCartQty = 0;
    this.router.navigate(['/']);
  }

  goToEditProfile(): void {
    this.router.navigate(['/user/edit']);
  }

  setupForm(): void {
    this.registerForm = this.fb.group({
      username: [
        '',
        Validators.required,
        this.asyncValidators.usernameUnique()
      ],
      email: ['', [Validators.required, emailValidator()]],
      password: ['', [Validators.required, passwordValidator()]],
      passwordConfirm: ['', Validators.required]
    }, {validator: passwordMatchValidator()});

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, emailValidator()]],
      // username: this.loginForm.value.username,
      password: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  searchSubmitForm(): void {
    // this.formLoading = true;  //이건 나한테 필요 없음.
    const formData = {
      search: this.searchForm.value.search,
    };

    // console.log(formData);
    // console.log(this.qKeyword);

    // this.router.navigate(['/products/search'], { queryParams: { q: formData.search } });
    this.router.navigate(['/products/search'], {queryParams: {q: this.qKeyword}});  //위와 동일한 결과

  }


  registerSubmitForm(): void {
    this.formLoading = true;  //이건 나한테 필요 없음.
    const formData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.us.register(formData)
      .first()
      .finally(() => this.formLoading = false)
      .subscribe(
        res => {
          // this.us.setUserData();
          console.log("register PART");
          this.router.navigate(['/']);
          this.registerForm.reset();

        },
        err => {
          this.formError = true;
        }
      );

    $('#registerModal').modal('hide');

  }


  loginSubmitForm(): void {
    // TODO:
    // https://stackoverflow.com/questions/44631754/how-to-revert-markaspending-in-angular-2-form
    this.loginForm.markAsPending();
    const formData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.us.login(formData)
      .first()
      .catch((err: any) => {
        let formError;
        if (err.status === 401) {
          formError = {wrongPassword: 'Username or password is wrong'};
        } else {
          formError = {formError: 'There was an error during login'};
        }
        this.loginForm.setErrors(formError);

        return Observable.throw(new Error(err));
      }).subscribe(
      res => {

        this.us.setUserData();

        this.router.navigate(['/']);

        if (localStorage.getItem('cart_token')) {
          this.cs.getCart().subscribe(res2 => {
            console.log(res2);
          });
        }

        this.loginForm.reset();
      }
    );

    $('#loginModal').modal('hide');

  }
}

