import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IUser } from '@tran/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  $user = new BehaviorSubject<IUser>(this.resetUser());

  constructor() { }

  resetUser(): IUser {
    return {
      name: null,
      email: null,
      avatar: null,
    };
  }
}
