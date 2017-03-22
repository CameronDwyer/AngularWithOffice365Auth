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
  authContext: any;//adal.AuthenticationContext;
  authMessage:string = '';
  currentUser: OpsUser;

  constructor(private http: Http) {}

  ngOnInit()  {
    console.log("ngOnInit");
    this.untypedWindow = window;
    this.authContext = new this.untypedWindow.AuthenticationContext({
      instance: 'https://login.microsoftonline.com/',
      tenant: 'common', //COMMON OR YOUR TENANT ID

      clientId: '30e05366-2fe5-429a-b813-0c6bd87807cc', //This is your client ID
      redirectUri: 'https://localhost:4200/authresponse', //This is your redirect URI

      callback: this.userSignedIn.bind(this),
      popUp: true
    });
        
  }

  signIn() {
      this.authContext.login();
  }

  userSignedIn(err, token) {
    console.log('userSignedIn called');
    this.authContext.acquireToken(this.authContext.config.clientId, this.validateToken.bind(this));
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

mapClaimsToObject(responseBody): AuthTokenClaim[]
{
    let claims: AuthTokenClaim[] = <AuthTokenClaim[]> JSON.parse(responseBody);
    claims.forEach(element => {
        console.log("type=" + element.type + " ,value=" + element.value + " | ");
    });

    return claims;
}

showClaims(claims)
{  
    // We've had a successful response from our Web API backend that the token is valid so we can continue and trust the logged in user
    console.log(claims);
    this.authMessage = claims;

    // The user object only gives us the name
    let user: any = this.authContext.getCachedUser();

    // The claims that were embedded in the verified token give us a lot more
    let authTokenClaims: AuthTokenClaim[] = this.mapClaimsToObject(claims);
    let objectIdClaim: AuthTokenClaim = authTokenClaims.find( x => x.type === "http://schemas.microsoft.com/identity/claims/objectidentifier");
    let tenantIdClaim: AuthTokenClaim = authTokenClaims.find( x => x.type === "http://schemas.microsoft.com/identity/claims/tenantid");
    let nameClaim: AuthTokenClaim = authTokenClaims.find( x => x.type === "name");

    console.log(objectIdClaim.value);
    console.log(tenantIdClaim.value);
    console.log(nameClaim.value);

    this.currentUser = new OpsUser();
    this.currentUser.displayName = nameClaim.value;
    this.currentUser.userName = user.userName;
    this.currentUser.userId = objectIdClaim.value;
    this.currentUser.tenantId = tenantIdClaim.value;

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


export class AuthTokenClaim {
    type: string;
    value: string;
}

export class OpsUser {
    displayName: string;
    userName: string;
    userId: string;
    tenantId: string;
}