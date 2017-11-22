import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Subject} from "rxjs/Subject";


@Injectable()
export class CartService {

  //observable source
  private cartCreateSource = new Subject<any>();

  //observable stream
  cartCreated$ = this.cartCreateSource.asObservable();


  constructor(private http: Http) {}

  getCart(): Observable<any>{
       return this.http.get('/api/cart/?token='+localStorage.getItem('cart_token'))
      .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
      .do(cart=>this.cartCreated(cart))
      .catch(this.handleError);
  }

  /**
   * The user was created. Add this info to our stream
   */

  cartCreated(cart){

    console.log('cartCreated Test');
    this.cartCreateSource.next(cart);
  }

  // This is single product-detail
  init_postCart(data): Observable<any> {
    let url = '/api/cart/?item=' + data.state + '&qty='+data.qty;
    if(data.username){
      url = '/api/cart/?item=' + data.state + '&qty='+data.qty + '&username='+data.username;
    }
    return this.http.get(url)
      .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
      .catch(this.handleError);
  }


  //f==data
  postCart(data,token): Observable<any> {
    let url = '/api/cart/?token='+token+'&item=' + data.state + '&qty='+data.qty;
    if(data.username){
      url = '/api/cart/?token='+token+'&item=' + data.state + '&qty='+data.qty + '&username='+data.username;
    }

    return this.http.get(url)
      .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
      .catch(this.handleError);
  }

  deleteItem(itemId): Observable<any> {
    return this.http.get('/api/cart/?token='+localStorage.getItem('cart_token')+'&item='+itemId+'&delete=True')
      .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
      .catch(this.handleError);
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
