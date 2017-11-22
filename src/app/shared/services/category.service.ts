import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";


@Injectable()
export class CategoryService {
  private endPoint: string = '/api/blog/';

  constructor(private http: Http) {
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<any[]> {
    return this.http.get( '/api/categories/')
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
