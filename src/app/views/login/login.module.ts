import { IonicModule } from '@ionic/angular';
import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './login.page';

import { LoginPageRoutingModule } from './login-routing.module';
import { InputComponent } from 'src/app/components/inputComponent/input.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LoginPageRoutingModule,
    InputComponent
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}