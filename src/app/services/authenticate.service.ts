import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UserResponse {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = "https://springboot-tradebull.azurewebsites.net/";
  url = "";
  constructor(private http: HttpClient) { }

  addNewUser(email, username, phone, password) {
    this.url = this.baseUrl + "register";
    return this.http.post(this.url, { "email": email, "name": username, "phone": phone, "password": password });
  }

  authenticate(mailid, password) {
    this.url = this.baseUrl + "signin";
    return this.http.post<UserResponse>(this.url, { "email": mailid, "password": password });
    //return this.http.post<UserResponse>(this.url, { "username":mailid,"password":password} );        
  }

  isUserLoggedIn() {
    let user = null;
    user = localStorage.getItem('username');
    return !(user === null);
  }



  logOut() {
    localStorage.removeItem('username');
    console.log("logout")
  }
  forgot(user, mailid, password) {
    this.url = this.baseUrl + "forgot";
    return this.http.post<UserResponse>(this.url, { "username": user, "email": mailid, "password": password });

  }
}
