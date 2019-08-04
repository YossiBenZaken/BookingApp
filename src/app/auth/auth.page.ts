import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    isLoading = false;
    isLogin = true;
    constructor(private auth: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

    ngOnInit() {
    }
    onLogin() {
        this.isLoading = true;
        this.auth.login();
        this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' }).then(loadingEl => {
            loadingEl.present();
            setTimeout(() => {
                this.isLoading = false;
                loadingEl.dismiss();
                this.router.navigateByUrl('/places/tabs/discover')
            }, 1500);
        });
    }
    onSwitch() {
        this.isLogin = !this.isLogin;
    }
    onSubmit(form: NgForm) {
        if (form.invalid) return;
        const email = form.value.email;
        const pass = form.value.password;
        console.log(email, pass);
        if (this.isLogin) {
            // Login
        }
        else {
            // Signup
        }
    }
}
