import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AsyncFormValidatorsService} from "../shared/services/async-form-validators.service";
import {Router} from "@angular/router";
import {AddrService} from "../shared/services/addr.service";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  initShippingCheckedItem: any;
  initBillingCheckedItem: any;
  shippingCheckedItem: any;
  billingCheckedItem: any;

  formError: boolean = false;
  formLoading: boolean = false;
  shippingForm: FormGroup;
  billingForm: FormGroup;

  shippingAddrs: any[];
  billingAddrs: any[];

  constructor(private fb: FormBuilder,
              private asyncValidators: AsyncFormValidatorsService,
              private router: Router,
              private ads: AddrService) {
    this.setupForm();
  }

  ngOnInit() {
    this.initSetting();
  }

  initSetting() {
    this.ads.getShippingAddr(this.ads.getAuthDetails().username).subscribe(shippingData => {
      this.shippingAddrs = shippingData;

      this.ads.getBillingAddr(this.ads.getAuthDetails().username).subscribe(billingData => {
        this.billingAddrs = billingData;

        this.checkedConform();
      });

    });
  }

  checkedConform() {
    this.initShippingCheckedItem = this.shippingAddrs.filter(item => item.checked === true);
    this.initBillingCheckedItem = this.billingAddrs.filter(item => item.checked === true);

    // console.log("initShippingCheckedItem");
    // console.log(this.initShippingCheckedItem);

  }

  shippingSubmitForm() {

    const formData = {
      nick: this.shippingForm.value.nick,
      street: this.shippingForm.value.street,
      zipcode: this.shippingForm.value.zipcode,
      city: this.shippingForm.value.city,
      state: this.shippingForm.value.state
    };
    console.log(formData);
    this.ads.shippingPostAddr(formData)
      .subscribe(
        res => {
          // this.us.setUserData();
          console.log("addr ssss PART");
          this.initSetting();

          this.router.navigate(['/address']);
        },
        err => {
          this.formError = true;
        }
      );

  }


  saveForm() {
    this.shippingCheckedItem = this.shippingAddrs.filter(item => item.checked === true);
    console.log("shippingCheckedItem");
    // console.log(this.shippingCheckedItem[0].nick);
    if (this.shippingCheckedItem.length<1 ||this.shippingCheckedItem.length>1 ) {
      console.log("s하나만 선택해랑."); //클라이언트 단에 알림 경고창 UI 만들어줘야함.
      return;
    }

    this.billingCheckedItem = this.billingAddrs.filter(item => item.checked === true);
    console.log("billingCheckedItem");
    // console.log(this.billingCheckedItem[0].nick);
    if (this.billingCheckedItem.length<1 ||this.billingCheckedItem.length>1 ) {
      console.log("b하나만 선택해랑."); //클라이언트 단에 알림 경고창 UI 만들어줘야함.
      return;
    }


    if (this.shippingCheckedItem[0] !== this.initShippingCheckedItem[0]) {
      this.initShippingCheckedItem[0].checked = false;

      this.ads.shippingAddrCheckedUpdate(this.initShippingCheckedItem[0]).subscribe(
        res => console.log("s123"));

      this.ads.shippingAddrCheckedUpdate(this.shippingCheckedItem[0]).subscribe(
        res => console.log("s456"));

      this.initShippingCheckedItem[0] = this.shippingCheckedItem[0];
    }

    if (this.billingCheckedItem[0] !== this.initBillingCheckedItem[0]) {
      this.initBillingCheckedItem[0].checked = false;

      this.ads.billingAddrCheckedUpdate(this.initBillingCheckedItem[0]).subscribe(
        res => console.log("b123"));

      this.ads.billingAddrCheckedUpdate(this.billingCheckedItem[0]).subscribe(
        res => console.log("b456"));

      this.initBillingCheckedItem[0] = this.billingCheckedItem[0];
    }
  }

  billingSubmitForm() {

    const formData = {
      nick: this.billingForm.value.b_nick,  //나중에 nick은 유니크로 잡아줘야함. 서버단에서(처리완료)
      street: this.billingForm.value.b_street,
      zipcode: this.billingForm.value.b_zipcode,
      city: this.billingForm.value.b_city,
      state: this.billingForm.value.b_state
    };

    console.log(formData);
    this.ads.billingPostAddr(formData)
      .subscribe(
        res => {
          // this.us.setUserData();
          console.log("addr bbbbbb PART");
          this.initSetting();

          this.router.navigate(['/address']);
        },
        err => {
          this.formError = true;
        }
      );
  }

  setupForm(): void {
    this.shippingForm = this.fb.group({
      nick: ['', Validators.required,],
      street: ['', Validators.required,],
      zipcode: ['', [Validators.required,]],
      city: ['', [Validators.required,]],
      state: ['', Validators.required]
    });

    this.billingForm = this.fb.group({
      b_nick: ['', Validators.required,],
      b_street: ['', Validators.required,],
      b_zipcode: ['', [Validators.required,]],
      b_city: ['', [Validators.required,]],
      b_state: ['', Validators.required]
    });

  }
}
