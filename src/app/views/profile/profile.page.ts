import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Keyboard } from "@capacitor/keyboard";
import { Platform } from "@ionic/angular";
import { AuthService } from "src/app/service/AuthServices";
import { CallService } from "src/app/service/CallService";
import { DataService } from "src/app/service/DataService";
import { StorageService } from "src/app/service/StorageService";


@Component({
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit{
    constructor(
      private router: Router,
      private dataService: DataService, 
      private platform: Platform, 
      private authService: AuthService,
      private storageService: StorageService,
      private sanitizer: DomSanitizer,
      private callService: CallService
    ){}
    
    
    async ngOnInit() {
      this.setupKeyboardListener();
      this.userRol = this.authService.getUserRole();

      const result = await this.callService.call({
        method: 'get',
        isToken: true,
        body: null,
        endPoint: 'allGenres'
      })

      if(result.message['code'] == 1 || result.message['code'] == 3){
        return this.#showMessageBar(result.message['description'], result.message['code']);
      }

      this.genres = result['data'];

      const userString = await this.storageService.get('user');
      const user = JSON.parse(userString);
      this.user = user;

      //Pasados | Backup
      this.username = user['user'].username;
      this.email = user['user'].email;
      this.artistname = user['artist'].name || ''

      //Actuales
      this.usernameValue = this.username;
      this.emailValue = this.email;
      this.imageArtist = user['artist'].image || '';
      this.artistnameValue = this.artistname;
      this.selectedGenres = user['artist'].genres || [];
    }
    
    //Data que tiene el usuario actualmente
    user : any = {};
    userRol: number = 0;
    username: string = '';
    artistname: string = '';
    email: string = '';
    imageArtist: SafeResourceUrl = '';
    

    usernameValue: string = '';
    passwordValue: string = '';
    emailValue: string = '';
    artistnameValue: string = '';
    selectedGenres: number[] = [];
    genres: Array<string> = [];
    
    //MessageBar
    alertCode: number = 0;
    alertMessage: string = '';
    showAlert: boolean = false;
    private isShow: boolean = false;


    //Checkers
    isValidEmail: boolean = false;
    isValidPassword: boolean = false;
    isValidUsername: boolean = false;
    isValidArtistname: boolean = false;
    selectImage: boolean = false;
    
    //Regex
    regexArtistname: string = '^[a-zA-Z]+(?: [a-zA-Z]+)+$';
    regexUsername: string = '.{5,}';
    regexEmail: string = '[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}';
    regexPassword: string = '.{8,}'


  setupKeyboardListener() {
    if (this.platform.is('capacitor')) {
      Keyboard.addListener('keyboardWillShow', (info) => {
        const containerInput = document.querySelector('.container-input');
        if (containerInput instanceof HTMLElement) {
          containerInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
          containerInput.style.paddingBottom = `${info.keyboardHeight}px`;
        }
      });
  
      Keyboard.addListener('keyboardWillHide', () => {
        const containerInput = document.querySelector('.container-input');
        if (containerInput instanceof HTMLElement) {
          containerInput.style.paddingBottom = '0';
        }
      });
    }
  }

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
    onValueChangeArtistname(newValue: string){
        this.artistnameValue = newValue;
        this.isValidArtistname = new RegExp(this.regexArtistname).test(newValue);
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


    onSaveUser = async () => {
      if(this.usernameValue === this.username && this.email === this.emailValue){
        this.#showMessageBar('You must edit something', 3);
        return;
      }

      this.storageService.set('user', JSON.stringify({
        user : {
          username: this.usernameValue,
          email: this.emailValue,
        },
        artist: {...this.user['artist']}
      }))

      const result = await this.callService.call({
        method: 'put',
        endPoint: 'editProfile',
        body: {
          username: this.usernameValue,
          email: this.emailValue,
          password: this.passwordValue
        },
        isToken: true
      })

      this.#showMessageBar(result.message['description'], result.message['code']);
      if(result.message['code'] == 1 || result.message['code'] == 3){
        return;
      }

      setTimeout(() => {
        this.router.navigate(['/tabs/home']);
      }, 600)

      return;
    }

    onSaveArtist = () => {
      if(this.artistname === this.artistnameValue && !this.selectImage){
        this.#showMessageBar('The artist has been edited correctly', 3);
        return;
      }

      this.storageService.set('user', JSON.stringify({
        user: {...this.user['user']},
        artist: {
          name: this.artistnameValue,
          image: this.imageArtist,
          genres: this.selectedGenres
        }
      }))

      

    }

  async onDelete(){
    const result = await this.callService.call({
      method: 'delete',
      body: null,
      isToken: true,
      endPoint: 'deleteAccount'
    })

    this.#showMessageBar(result.message['description'], result.message['code']);
    if(result.message['code'] == 1 || result.message['code'] == 3){
      return;
    }

    setTimeout(() => {
      this.router.navigate(['/login'])
    }, 600)

  }

  async onSelectImage(){
    try {
        const image: Photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Photos
        });
  
        if (image && image.webPath) {
          this.imageArtist = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
          this.selectImage = true;
        } else {
          console.log('El resultado de las fotos es vacío');
        }
      } catch (error) {
        console.error('Error seleccionando la imagen: ', error);
      }
  }


}