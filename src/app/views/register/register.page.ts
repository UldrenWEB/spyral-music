import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "src/app/service/DataService";

@Component({
    selector: 'app-register',
    templateUrl: 'register.page.html',
    styleUrls: ['register.page.scss']
})
export class RegisterPage {

    constructor(private router: Router, private dataService: DataService){}

    usernameValue: string = '';
    passwordValue: string = '';
    emailValue: string = '';
    
    alertCode: number = 0;
    alertMessage: string = '';
    showAlert: boolean = false;
    private isShow: boolean = false;


    //Checkers
    isValidEmail: boolean = false;
    isValidPassword: boolean = false;
    isValidUsername: boolean = false;
    isArtist: boolean = false;

    //Regex
    regexUsername: string = '.{5,}';
    regexEmail: string = '[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}';
    regexPassword: string = '.{8,}'


    //Inicio de Funciones OnChange
    onValueChangeUsername(newValue: string){
        this.usernameValue = newValue;
        this.isValidUsername = new RegExp(this.regexUsername).test(newValue);
    }

    onValueChangeEmail(newValue: string) {
        this.emailValue = newValue;
        this.isValidEmail = new RegExp(this.regexEmail).test(newValue);
    }
    
    onValueChangePassword(newValue: string) {
        this.passwordValue = newValue;
        this.isValidPassword = new RegExp(this.regexPassword).test(newValue)
    }

    onCheckboxChange(event: any) {
        const isChecked = event.detail.checked;
        this.isArtist = isChecked;
    }
    //Fin de Funciones OnChange

    #showMessageBar = (message: string, code : 0 | 1 | 3 = 0) => {
        if(this.isShow) return;
        
        this.isShow = true;
        this.alertCode = code;
        this.alertMessage = message;
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
          this.isShow = false;
        }, 3000)
    }


    onClick = () => {
       if(!this.isValidEmail || !this.isValidPassword || !this.isValidUsername) return;
       
       if(this.isArtist){
            const user = {
                username: this.usernameValue,
                password: this.passwordValue,
                email: this.emailValue
            }
            this.dataService.setData(user);
            this.router.navigate(['/create-artist'])
       }

       //Si todo fue se manda el mensaje de registro exitoso
       //Luego se redirije al login para que ingrese sus datos
       this.#showMessageBar('User logueado', 0);
       this.router.navigate(['/tabs'])
    }


}