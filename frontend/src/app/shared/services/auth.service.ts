import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response-model';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private subjectUser: BehaviorSubject<UserModel>;
  private key_token = 'auth_token';

  private errorMessage: string = '';

  baseUrl: string = environment.BACKEND_URL;
  constructor(private http: HttpClient, private router: Router) {
    this.subjectUser = new BehaviorSubject<UserModel>(this.setEmptyUser());
  }

  ngOnDestroy(): void {
    this.subjectUser.complete();
  }

  setUser(user: UserModel) {
    this.subjectUser.next(user);
  }
  getUser() {
    return this.subjectUser;
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  public async isAuthenticatedOrRefresh(): Promise<boolean> {
    try {
      const result = await this.http
        .get<UserModel>(this.baseUrl + '/profile')
        .toPromise();
      this.setUser(result);
      return true;
    } catch (e) {
      return false;
    }
  }

  logout() {
    localStorage.removeItem(this.key_token);
    this.setUser(this.setEmptyUser());
    this.router.navigate(['login']);
  }

  setToken(token: string) {
    localStorage.setItem(this.key_token, token);
  }

  async login(model: UserModel): Promise<boolean> {
    let url = this.baseUrl + '/auth/login';
    try {
      let response: any = await this.http.post(url, model).toPromise();
      this.setToken(response.token);
      this.setUser(response.user);
    } catch (ex) {
      this.errorMessage = ex.error.message;
      return false;
    }

    return true;
  }

  getError() {
    return this.errorMessage;
  }

  async save(model: UserModel): Promise<boolean> {
    let url = this.baseUrl + '/user';

    try {
      let response = await this.http
        .post<ResponseModel>(url, model)
        .toPromise();

      if (response != null) {
        await this.login(model);
      }
      return response != null;
    } catch (ex) {
      this.errorMessage = ex.error.details[0].message;
      return false;
    }
  }

  setEmptyUser(): UserModel {
    return {
      name: '',
    };
  }
}
