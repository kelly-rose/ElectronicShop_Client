import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Http, Response} from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { JwtHelper, AuthHttp } from 'angular2-jwt';

import { HelpersService } from './helpers.service';
import {isUndefined} from "util";
import {CartService} from "./cart.service";
// import { config } from './../../../config';
const endpoint:string="locolhost:8000";

@Injectable()
export class UserService {
  jwtHelper: JwtHelper = new JwtHelper();
  user$ = new BehaviorSubject<any>(this.getAuthDetails());
  user: any = false;

  constructor(
    private http: Http,
    private hs: HelpersService,
    // private auth: AuthHttp
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
    return this.http.get(`${endpoint}/movies/auth/username-exists/?u=${username}`)
      .first()
      .map(res => res.json())
      .map(res => !res.data.username_exists);
  }

  register(formData: any): Observable<any> {
    return this.authPost(`/auth/register/`, formData);
      // .do(res => this.setToken(res.data));
  }



  // editProfile(formData: any): Observable<any> {
  //   // need to set withCredentials to send csrf token for Django
  //   return this.auth.post(`${endpoint}/movies/user/update/`, formData, { withCredentials: true });
  // }
  //
  // editPassword(formData: any): Observable<any> {
  //   return this.auth.post(
  //     `${endpoint}/movies/user/update-password/`,
  //     formData,
  //     { withCredentials: true }
  //   );
  // }

  logout(): void {
    localStorage.removeItem('token');
    // Cookie.delete('token', '/');

    this.setUserData();
  }

  isAuth(): boolean {
    const cookieToken = this.getToken();
    if(cookieToken==='undefined') {
      return false;
    }

    if (cookieToken) {
      return !this.jwtHelper.isTokenExpired(cookieToken);
    } else {
      return false;
    }
  }

  getAuthDetails(): any {
    const cookieToken = this.getToken();
    if(cookieToken==='undefined') {
      return false;
    }
    if (cookieToken) {
      console.log(cookieToken);
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

  // login(formData: any): Observable<any> {
  //   return this.authPost(`/auth/login/`, formData)
  //     .do(res => this.setToken(res.data));
  // }
  // private setToken(token: any): void {
  //   console.log("-----setToken-----");
  //
  //   if(token)
  //     localStorage.setItem('token', token);
  //
  //   if(!token)
  //     console.log("token is undefined");
  // }

  login(formData: any): Observable<any> {
    return this.authPost(`/auth/login/`, formData)
      .do(res => this.setToken(res));
  }
  private setToken(data: any): void {
    console.log("-----setToken-----");
    console.log(data);

    if(data.cart_token)
      localStorage.setItem('cart_token', data.cart_token);

    if(data.token)
      localStorage.setItem('token', data.token);

    if(!data.token)
      console.log("token is undefined");
  }

  private getToken(): string {
    console.log("-----getToken-----");

    return localStorage.getItem('token');
  }

  /**
   * Handle any errors from the API
   */
  private handleError(error: Response | any) {
    let errMessage: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
    } else {
      errMessage = error.message ? error.message : error.toString();
    }
    console.log(errMessage);
    return Observable.throw(errMessage);
  }

}
