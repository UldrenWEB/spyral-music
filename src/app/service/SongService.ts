import { Injectable } from '@angular/core';
import { Song } from '../interfaces/song';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private song: Song = {};
  private songs: Array<Song> = []; 

  constructor() { }

  setSong(song: Song) {
    this.song = song;
  }

  getSong() {
    return this.song;
  }

  setSongs (songs: Array<Song>){
    this.songs = songs
  }

  getSongs(){
    return this.songs;
  }

  resetArray() {
    this.songs = [];
  }
}