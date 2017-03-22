import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  untypedWindow:any; 
  username:string = '';
  authMessage:string = '';

  constructor(private http: Http) {}

  ngOnInit()  {
    console.log("ngOnInit");
    this.untypedWindow = window;
    this.untypedWindow.ADAL = new this.untypedWindow.AuthenticationContext({
      instance: 'https://login.microsoftonline.com/',
      tenant: 'common', //COMMON OR YOUR TENANT ID

      clientId: '30e05366-2fe5-429a-b813-0c6bd87807cc', //This is your client ID
      redirectUri: 'https://localhost:4200/authresponse', //This is your redirect URI

      callback: this.userSignedIn.bind(this),
      popUp: true
    });
        
  }

  signIn() {
      this.untypedWindow.ADAL.login();
  }

  userSignedIn(err, token) {
    console.log('userSignedIn called');
    this.untypedWindow.ADAL.acquireToken(this.untypedWindow.ADAL.config.clientId, this.validateToken.bind(this));
    /*
      console.log('userSignedIn called');
      if (!err) {
          console.log("token: " + token);
          let user:any = this.untypedWindow.ADAL.getCachedUser();
          console.log("got user");
          this.username = user.profile.name;
      }
      else {
          console.error("error: " + err);
      }
      */
  }

  validateToken(err, token)
  {
    console.log('validateToken called');
    
    if (err)
    {
        console.log(err);
        this.showError(err);
        return;
    }
    let headers: Headers = new Headers();
    let bearer: string = "Bearer " + token;
    headers.append("Authorization", bearer);
    let init: any =
    {
        method: 'GET',
        headers: headers,
        mode: 'cors'
    };
    console.log("about to fetch");
    this.http.get('https://localhost:4430/api/claims', { headers: headers })
    .map( (responseData) => {
        console.log(responseData);
        return responseData;
      })
    .subscribe( res => { this.showClaims(res.text())} );
}

showClaims(claims)
{
    
    console.log(claims);
    this.authMessage = claims;
}

showError(error)
{
    console.error(error);
    this.authMessage = "Error: " + error;
}


  ngOnDestroy() {
    this.untypedWindow.ADAL = null;
  }

}
