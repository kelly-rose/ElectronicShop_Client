import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";


@Injectable()
export class OrderService {
  constructor(private http: Http,
              private auth: AuthHttp) {
  }

  getOrderData(username: any): Observable<any> {
    let data = {username: username, cart_token: localStorage.getItem('cart_token')};

    return this.auth.post(`/api/checkout/`, data, {withCredentials: true})
      .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
      .catch(this.handleError);
  }

  orderConform(data){
    return this.auth.post(`/api/checkout/finalize/`, data, {withCredentials: true})
      .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
      .catch(this.handleError);
  }

  // getOrderData(username): Observable<any> {
  //   let data = {username: username, cart_token: localStorage.getItem('cart_token')};
  //   return this.http.get('/api/checkout/?cart_token=' + localStorage.getItem('cart_token') + '&username=' + username)
  //     .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
  //     .catch(this.handleError);
  // }


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
