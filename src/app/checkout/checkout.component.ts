import {NavigationEnd, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';


import {CartService} from "../shared/services/cart.service";
import {AsyncFormValidatorsService} from "../shared/services/async-form-validators.service";
import {UserService} from "../shared/services/user.service";
import {emailValidator, passwordMatchValidator, passwordValidator} from "../helper/form-validators";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  isChecked:any;

  formError: boolean = false;
  formLoading: boolean = false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  constructor(private fb: FormBuilder,
              private asyncValidators: AsyncFormValidatorsService,
              public us: UserService,
              private router: Router,
              private cs: CartService) {
    this.setupForm();
  }
  ngOnInit() {
    this.isChecked=1;

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

  }


  toggle(value){
    console.log(value);
    this.isChecked=value;

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

        this.router.navigate(['/order']);

        if (localStorage.getItem('cart_token')) {
          this.cs.getCart().subscribe(res2 => {
            console.log(res2);
          });
        }

        this.loginForm.reset();
      }
    );

  }

}
