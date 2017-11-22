import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";


@Injectable()
export class ProductService {
  private endPoint: string = '/api/blog/';

  constructor(private http: Http) {
  }

  /**
   * Get all categories
   */
  getAllProducts(): Observable<any[]> {
    return this.http.get('/api/products/')
      .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
      .catch(this.handleError);
  }

  getProducts(categories): Observable<any[]> {
    return this.http.get('/api/categories/' + categories + '/')
      .map(res => res.json().product_set) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
      .catch(this.handleError);
  }

  // This is single product-detail
  getProduct(id): Observable<any> {
    return this.http.get('/api/products/' + id + '/')
      .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
      .catch(this.handleError);
  }

  getSearchProducts(params): Observable<any> {
    console.log(params);
    // products/?q=&category_id=1&category_id=2&max_price=&min_price=&q=
    return this.http.get( '/api/products/?'+params)
    // return this.http.get('/api/products/?q=' + params.q + '&category_slug=' + params.category_slug + '&min_price=' + params.min_price + '&max_price=' + params.max_price)
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
