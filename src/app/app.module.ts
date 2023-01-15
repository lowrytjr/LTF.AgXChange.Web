import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { AccountService } from './services/account/account.service';
import { AuthenticateService } from './services/authenticate/authenticate.service';
import { HttpService } from './services/http/http.service';
import { AppSettingsService} from './services/appSettings/app-settings.service';
import { VerifyAccountComponent } from './pages/verify-account/verify-account.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { ErrorComponent } from './pages/error/error.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AuthenticateGuard } from './services/authenticate/authenticate.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { LogoutComponent } from './pages/logout/logout.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verify-account', component: VerifyAccountComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate:[AuthenticateGuard] },
  { path: 'logout', component: LogoutComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];
//canActivate:[AuthenticateGuard]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    VerifyAccountComponent,
    CreateAccountComponent,
    ErrorComponent,
    ForgotPasswordComponent,
    LoaderComponent,
    ProfileComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserAnimationsModule
  ],
  providers: [AppSettingsService, HttpService, AccountService, AuthenticateService, AuthenticateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
