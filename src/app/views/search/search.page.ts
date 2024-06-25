import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage {
  
  searchTxt: string = '';
  selectedChange: string = 'song';
  isLoading: boolean = false;
  private searchTimeout: any = null;

  constructor(private loaderController: LoadingController) {}


  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTxt = value;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 800);
  }

  //Este busca luego de que el usuario escribio
  async performSearch() {

    this.isLoading = true;
    const loading = await this.loaderController.create({
      message: 'Buscando...',
      spinner: 'circular'
    });

    await loading.present();

    setTimeout(async () => {
      this.isLoading = false;
      await loading.dismiss();
    }, 3000)
    console.log('Buscando:', this.searchTxt);
    console.log('Por: ', this.selectedChange);
  }

}
