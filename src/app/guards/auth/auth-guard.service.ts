import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authSvc: AuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const params = route.queryParams;

    return new Observable<boolean>(observer => {
      // if (params.session_token) {
      //   observer.next(true);
      //   // this.authSvc.checkPermissions(params.session_token).subscribe(
      //   //     () => {
      //   //       observer.next(true);
      //   //       // this.router.navigate(['/']);
      //   //     },
      //   //     () => observer.next(false)
      //   // );
      // } else {
      //   observer.next(false);
      //   this.router.navigate(['/forbidden']);
      // }
    });
  }
}
