import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  untypedWindow:any; 
  username:string = '';

  constructor() {}

  ngOnInit()
  {
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
      if (!err) {
          console.log("token: " + token);
          let user:any = this.untypedWindow.ADAL.getCachedUser();
          console.log("got user");
          this.username = user.profile.name;
      }
      else {
          console.error("error: " + err);
      }
  }



  ngOnDestroy() {
    this.untypedWindow.ADAL = null;
  }

}
