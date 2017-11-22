import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { JwtHelper, AuthHttp } from 'angular2-jwt';

import { HelpersService } from './helpers.service';
// import { config } from './../../../config';
const endpoint:string="locolhost:8000";

@Injectable()
export class AddrService {
  jwtHelper: JwtHelper = new JwtHelper();
  user$ = new BehaviorSubject<any>(this.getAuthDetails());
  user: any = false;

  constructor(
    private http: Http,
    private hs: HelpersService,
    private auth: AuthHttp
  ) {
    this.setUserData();
  }

  authPost(url: string, data: any): Observable<any> {
    const options = this.hs.createHeaders();

    return this.http.post(url, data, options)
      .map(res => res.json());
  }

  getOrSetUsername(): string {
    let username = this.user.username || localStorage.getItem('username');
    if (!username) {
      username = btoa(Math.random().toString());
      localStorage.setItem('username', username);
    }
    return username;
  }

  usernameIsUnique(username: string): Observable<boolean> {
    return this.http.get(`/address/shipping/`)
      .first()
      .map(res => res.json())
      .map(res => !res.data.username_exists);
  }

  getShippingAddr(param: any): Observable<any> {
    // need to set withCredentials to send csrf token for Django
    return this.auth.get(`/api/address/shipping/?q=${param}`, { withCredentials: true }).map(res => res.json());
  }

  shippingAddrCheckedUpdate(data: any): Observable<any> {
    // need to set withCredentials to send csrf token for Django
    return this.auth.post(`/address/shipping/checked/`, data, { withCredentials: true });
  }

  billingAddrCheckedUpdate(data: any): Observable<any> {
    // need to set withCredentials to send csrf token for Django
    return this.auth.post(`/address/billing/checked/`, data, { withCredentials: true });
  }


  getBillingAddr(param: any): Observable<any> {
    // need to set withCredentials to send csrf token for Django
    return this.auth.get(`/api/address/billing/?q=${param}`, { withCredentials: true }).map(res => res.json());
  }
  shippingPostAddr(formData: any): Observable<any> {
    // need to set withCredentials to send csrf token for Django
    return this.auth.post(`/address/shipping/`, formData, { withCredentials: true });
  }
  billingPostAddr(formData: any): Observable<any> {
    // need to set withCredentials to send csrf token for Django
    return this.auth.post(`/address/billing/`, formData, { withCredentials: true });
  }
  //
  // editPassword(formData: any): Observable<any> {
  //   return this.auth.post(
  //     `${endpoint}/movies/user/update-password/`,
  //     formData,
  //     { withCredentials: true }
  //   );
  // }


  isAuth(): boolean {
    const cookieToken = this.getToken();
    if (cookieToken) {
      return !this.jwtHelper.isTokenExpired(cookieToken);
    } else {
      return false;
    }
  }

  getAuthDetails(): any {
    const cookieToken = this.getToken();
    if (cookieToken) {
      console.log("-----getAuthDetails-----");
      return this.jwtHelper.decodeToken(cookieToken);
    } else {
      return false;
    }
  }

  setUserData(): void {
    console.log("-----setUserData-----");

    this.user$.next(this.getAuthDetails());
    this.user = this.getAuthDetails();
  }

  private setToken(token: any): void {
    console.log("-----setToken-----");

    localStorage.setItem('token', token);
  }

  private getToken(): string {
    console.log("-----getToken-----");

    return localStorage.getItem('token');
  }
}
