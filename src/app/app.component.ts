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
      if (event.url.includes('/play-song')) {
        this.isMiniPlayerVisible = false;
      } else if (songHasBeenPlayed) {
        this.isMiniPlayerVisible = true;
      }
    });
  
    this.playerService.hasPlayed$.subscribe(hasPlayed => {
      songHasBeenPlayed = hasPlayed;
      if (hasPlayed) {
        this.isMiniPlayerVisible = true;
      } else {
        this.isMiniPlayerVisible = false;
      }
    });
  }


}
