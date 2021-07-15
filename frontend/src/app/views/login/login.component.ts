import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/shared/models/user-model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoginActive: boolean = true;
  form: FormGroup;
  options: GlobalConfig;
  isLoading: boolean = false;
  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.options = this.toastr.toastrConfig;
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      nickname: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'];

    if (this.returnUrl) {
      this.authService.isAuthenticatedOrRefresh().then((result) => {
        if (result) {
          this.router.navigate([this.returnUrl]);
          return;
        }
        this.authService.logout();
      });
    }
  }

  get formControls() {
    return this.form.controls;
  }

  async login() {
    if (this.form.invalid) return;
    this.isLoading = true;
    let user = this.mountUserData();
    let response = await this.authService.login(user);

    if (!response) {
      this.toastr.error(this.authService.getError(), 'Error', {
        closeButton: true,
      });
      this.isLoading = false;
      return;
    }
    this.router.navigate(['game']);

    this.isLoading = false;
  }

  async save() {
    if (this.form.invalid) return;
    this.isLoading = true;
    let user = this.mountUserData();
    let response = await this.authService.save(user);
    if (!response) {
      this.toastr.error(this.authService.getError(), 'Error', {
        closeButton: true,
      });
      this.isLoading = false;
      return;
    }
    this.router.navigate(['game']);
    this.isLoading = false;
  }

  mountUserData(): UserModel {
    let password = this.formControls['password'].value;
    let nickname = this.formControls['nickname'].value;

    let model: UserModel = {
      password: password,
      name: nickname,
    };

    return model;
  }

  handleChangeTab(isLoginTab: boolean) {
    this.isLoginActive = isLoginTab;
    setTimeout(() => {
      this.form.reset({
        passoword: '',
        nickname: '',
      });
      this.form.markAsUntouched();
    }, 250);
  }
}
