import { Plugins } from '@capacitor/core';
import { User } from './user.model';
import { BehaviorSubject, from } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => user ? true : false));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => user ? user.id : null));
  }

  get token() {
    return this._user.asObservable().pipe(map(user => user ? user.token : null));
  }

  constructor(private http: HttpClient) { }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(map(storeData => {
      if (!storeData || !storeData.value) {
        return null;
      }
      const pData = JSON.parse(storeData.value) as { token: string; tokenExpirationDate: string; userId: string; email: string; };
      const expirationTime = new Date(pData.tokenExpirationDate);
      if (expirationTime <= new Date()) {
        return null;
      }
      const user = new User(pData.userId, pData.email, pData.token, expirationTime);
      return user;
    }), tap(user => {
      if (user) {
        this._user.next(user);
        this.autoLogout(user.tokenDuration);
      }
    }), map(user => {
      return !!user;
    })
    );
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(user: AuthResponseData) {
    const expire = new Date(new Date().getTime() + (+user.expiresIn * 1000));
    const userD = new User(user.localId, user.email, user.idToken, expire);
    this._user.next(userD);
    this.autoLogout(userD.tokenDuration);
    this.storeAuthData(user.localId, user.idToken, expire.toISOString(), user.email);
  }
  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({ userId: userId, token: token, tokenExpirationDate: tokenExpirationDate, email: email });
    Plugins.Storage.set({ key: 'authData', value: data });
  }
}
