// custom-input.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from './input.component';

@NgModule({
  declarations: [InputComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [InputComponent]
})
export class CustomInputModule {}