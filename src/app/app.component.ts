import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MusicPlayerService } from './service/MusicPlayerService';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isMiniPlayerVisible: boolean = false;
  
  constructor(private router: Router, private playerService: MusicPlayerService) {
    let songHasBeenPlayed = false;
  
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Actualizar la visibilidad basada en la ruta
      if (event.url.includes('/play-song')) {
        this.isMiniPlayerVisible = false; // Ocultar el mini reproductor solo en la ruta /play-song
      } else if (songHasBeenPlayed) {
        this.isMiniPlayerVisible = true; // Mostrar el mini reproductor en otras rutas si una canción ha sido reproducida
      }
      // No es necesario cambiar la visibilidad en el "else" porque ya se maneja con la suscripción a playerService.hasPlayed$
    });
  
    this.playerService.hasPlayed$.subscribe(hasPlayed => {
      songHasBeenPlayed = hasPlayed; // Actualizar el estado de reproducción
      // Si una canción se está reproduciendo, asegurarse de que el mini reproductor sea visible
      if (hasPlayed) {
        this.isMiniPlayerVisible = true;
      } else {
        // Si no hay canciones reproduciéndose, ocultar el mini reproductor
        this.isMiniPlayerVisible = false;
      }
    });
  }


}
