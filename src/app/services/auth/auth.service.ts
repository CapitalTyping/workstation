import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from '@services/api/api.service';

import { IAuth } from '@interfaces/.';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
      private apiSvc: ApiService,
  ) {}

  checkPermissions(session_token: string): Observable<IAuth> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `sessionToken ${session_token}`
    });
    return this.apiSvc.get('/session', {headers: headers})
        .pipe(tap(() => {
          localStorage.setItem('token', session_token);
        }));
  }
}
