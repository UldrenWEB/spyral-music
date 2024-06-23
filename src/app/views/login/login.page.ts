import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  constructor() {}

  //Regex
  regexEmail: string = '[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}';
  regexPassword: string = '.{8,}'


  emailValue: string = '';
  passwordValue: string = '';

  isValidEmail: boolean = false;
  isValidPassword: boolean = false;

  onValueChangeEmail(newValue: string) {
    this.emailValue = newValue;
    this.isValidEmail = new RegExp(this.regexEmail).test(newValue);
  }
  onValueChangePassword(newValue: string) {
    this.passwordValue = newValue;
    this.isValidPassword = new RegExp(this.regexPassword).test(newValue)
  }

  onClick = () : void => {
    if(!this.isValidEmail || !this.isValidPassword) return;

    //Aqui se debe hacer el login y entrar al sistema
    console.log(`Email ${this.emailValue }`)
    console.log(`Password ${this.passwordValue}`)
  }

  onRedirect = () => {
    console.log('Aqui sera redirigido')
  }
  

}