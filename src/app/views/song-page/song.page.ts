import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { Song } from "src/app/interfaces/song";
import { MusicPlayerService } from "src/app/service/MusicPlayerService";

@Component({
    selector: 'app-song',
    templateUrl: 'song.page.html',
    styleUrls: ['song.page.scss']
})
export class SongPage implements OnInit, OnDestroy {
    currentSong: Song = {};
    isPlaying: boolean = false;
    currentProgress: number = 0;
    timeUpdateSubscription?: Subscription;
    durationSubscription?: Subscription;

    constructor(private playerService: MusicPlayerService) {}

    ngOnInit(): void {
        this.currentSong = this.playerService.getCurrentSong();
        this.timeUpdateSubscription = this.playerService.currentTime$.subscribe(currentTime => {
            const duration = this.playerService.duration$.value;
            this.currentProgress = duration > 0 ? currentTime / duration : 0;
        });
    }

    ngOnDestroy(): void {
        this.timeUpdateSubscription?.unsubscribe();
        if (this.durationSubscription) {
            this.durationSubscription.unsubscribe();
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.playerService.pause();
        } else {
            this.playerService.play();
        }
        this.isPlaying = !this.isPlaying;
    }

    playNext() {
        this.playerService.playNext();
    }

    playPrevious() {
        this.playerService.playPrevious();
    }
}