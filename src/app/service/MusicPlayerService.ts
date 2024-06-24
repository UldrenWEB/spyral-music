import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../interfaces/song';

@Injectable({
  providedIn: 'root',
})
export class MusicPlayerService {
  private songs: Song[] = [];
  private currentIndex: number = 0;
  private audio: HTMLAudioElement | null = null;
  currentTime$ = new BehaviorSubject<number>(0);
  duration$ = new BehaviorSubject<number>(0);

  constructor() {
    setInterval(() => {
      if (this.audio) {
        this.currentTime$.next(this.audio.currentTime);
        this.duration$.next(this.audio.duration);
      }
    }, 1);
  }

  setPlaylist(songs: Song[]) {
    this.songs = songs;
  }

  getCurrentSong() {
    return this.songs[this.currentIndex];
  }

  play(index: number = this.currentIndex) {
    // Si ya hay un audio cargado y el índice es el mismo, simplemente reanuda la reproducción.
    if (this.audio && index === this.currentIndex) {
      this.audio.play().catch((error) => {
        console.error('Error al reproducir la canción:', error);
      });
      return;
    }
  
    // Si se selecciona una canción diferente o no hay ninguna cargada, inicia la nueva canción.
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('ended', this.handleSongEnd);
      this.audio = null;
    }
  
    const song = this.songs[index];
    this.audio = new Audio(song.song);
    this.audio.play().catch((error) => {
      console.error('Error al reproducir la canción:', error);
    });
    this.audio.addEventListener('ended', this.handleSongEnd.bind(this));
    this.currentIndex = index;
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  playNext() {
    const nextIndex = (this.currentIndex + 1) % this.songs.length;
    this.play(nextIndex);
  }

  playPrevious() {
    const previousIndex = this.currentIndex - 1 < 0 ? this.songs.length - 1 : this.currentIndex - 1;
    this.play(previousIndex);
  }

  private handleSongEnd() {
    this.playNext();
  }
}