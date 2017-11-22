// import {Injectable} from '@angular/core';
// import {Http, Response} from "@angular/http";
// import {Observable} from "rxjs/Rx";
// import {Article} from "../models/user";
// import {Category} from "../models/category";
//
// @Injectable()
// export class BlogService {
//   private endPoint: string = '/api/blog/';
//
//   constructor(private http: Http) {
//   }
//
//   /**
//    * Get all categories
//    */
//   getCategories(): Observable<Category[]> {
//     return this.http.get(this.endPoint + 'tag/1/')
//       .map(res => res.json().tagInfo) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
//       .catch(this.handleError);
//   }
//
//   /**
//    *
//    *    * Get Tag Article List
//    */
//   getTagArticles(tag): Observable<Article[]> {
//     let queryString = `?tagQuery=${tag}`;
//     return this.http.get(this.endPoint + queryString)
//       .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
//       .catch(this.handleError);
//   }
//
//     /**
//    *
//    *    * Get Search Article List
//    */
//   getSearchArticles(tag): Observable<Article[]> {
//     let queryString = `?allQuery=${tag}`;
//     console.log(queryString);
//
//     return this.http.get(this.endPoint + queryString)
//       .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
//       .catch(this.handleError);
//   }
//
//   /**
//    *Get all articles
//    */
//   getArticles(): Observable<Article[]> {
//     return this.http.get(this.endPoint)
//       .map(res => res.json()) //subscribe은 component에서 해주면 됨. 따라서 return 해줘야한다!
//       .catch(this.handleError);
//   }
//
//   /**
//    * Get a single user
//    */
//   getArticle(slug: string): Observable<Article> {
//     return this.http.get(this.endPoint + slug + '/')
//       .map(res => res.json())
//       .catch(this.handleError);
//
//   }
//
//   //create a user
//
//   //update a user
//
//   //delete a user
//
//   /**
//    * Handle any errors from the API
//    */
//   private handleError(error: Response | any) {
//     let errMessage: string;
//
//     if (error instanceof Response) {
//       const body = error.json() || '';
//       const err = body.error || JSON.stringify(body);
//       errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
//     } else {
//       errMessage = error.message ? error.message : error.toString();
//     }
//     console.log(errMessage);
//     return Observable.throw(errMessage);
//   }
//
//
// }
