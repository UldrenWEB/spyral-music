import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { Song } from "src/app/interfaces/song";
import { MusicPlayerService } from "src/app/service/MusicPlayerService";

@Component({
    selector: 'app-player-song',
    templateUrl: 'song.component.html',
    styleUrls: ['song.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class SongComponent implements OnInit{
    currentSong: Song = {};
    isPlaying: boolean = false;

    constructor(private playerService: MusicPlayerService) {}

    ngOnInit():void {
        this.currentSong = this.playerService.getCurrentSong();
        this.isPlaying = true;
    }

    playOrPause() {
        this.isPlaying = !this.isPlaying;
        this.playerService.play();
    }

    playNext() {
        this.playerService.playNext();
    }                                        

}