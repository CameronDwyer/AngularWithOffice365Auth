import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { PageNotFoundComponent } from './not-found.component';
import { AuthComponent } from './auth/auth.component';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';

const appRoutes: Routes = [
  { path: 'auth', component: AuthComponent }, 
  { path: 'authresponse', component: AuthRedirectComponent }, 
  { path: '',   redirectTo: '/auth', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}