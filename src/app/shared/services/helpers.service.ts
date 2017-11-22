import { Observable } from 'rxjs/Rx';
import { RequestOptions, Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';


const endpoint:string="locolhost:8000";

@Injectable()
export class HelpersService {
  constructor(
    private http: Http
  ) { }


  // getCsrf(): Observable<any> {
  //   const options = new RequestOptions({ withCredentials: true });
  //   const csrfToken = localStorage.getItem('csrftoken');
  //   if (!csrfToken) {
  //     return this.http.get(`${endpoint}/movies/auth/csrf`, options)
  //       .first()
  //       .map(res => res.json())
  //       .do(res => localStorage.setItem('csrftoken', res.data));
  //   }
  //   return Observable.of(csrfToken);
  // }

  createHeaders(): RequestOptions {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRFToken': localStorage.getItem('csrftoken')
    });
    const options = new RequestOptions({ headers, withCredentials: true });
    return options;
  }
}
