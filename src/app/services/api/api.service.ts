import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '@tran/app.config';

interface IRequestOptions {
  headers: HttpHeaders,
  params: HttpParams,
  body: HttpParams,
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
      private http: HttpClient,
  ) {}

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `sessionToken ${localStorage.getItem('token')}`
    });
  }

  protected prepareOptions(options): IRequestOptions {
    return {
      headers: options && options.headers || this.getHeaders(),
      params: options && options.params || {},
      body: options && options.body || {},
    };
  }

  get(path, options?): Observable<any> {
    return this.http.get(`${AppConfig.apiUrl}${path}`, this.prepareOptions(options));
  }

  post(path, body, options?): Observable<any> {
    return this.http.post(`${AppConfig.apiUrl}${path}`, body, this.prepareOptions(options));
  }

  put(path, body, options?): Observable<any> {
    return this.http.put(`${AppConfig.apiUrl}${path}`, body, this.prepareOptions(options));
  }

  patch(path, body = {}, options?): Observable<any> {
    return this.http.patch(`${AppConfig.apiUrl}${path}`, body, this.prepareOptions(options));
  }

  erase(path, options?): Observable<any> {
    return this.http.delete(`${AppConfig.apiUrl}${path}`, this.prepareOptions(options));
  }
}
