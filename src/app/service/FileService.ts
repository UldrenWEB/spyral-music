import { Injectable } from "@angular/core";
import {FileSelector} from "capacitor-file-selector";
import {Filesystem} from '@capacitor/filesystem';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { Capacitor } from "@capacitor/core";

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private fileChooser: FileChooser) {}
  
    async selectAudioFile(): Promise<{ blob: Blob | null, filename: string | null }> {
      try {

        const uri = await this.fileChooser.open();

        if (!uri) {
          console.log('No se seleccionó ningún archivo.');
          return { blob: null, filename: null };
        }
  
        const fileData = await Filesystem.readFile({
          path: uri
        });
  
        console.log('Pudo sacar la data del file')
        const blob = new Blob([fileData.data], { type: 'audio/*' });
  
        return { blob, filename: 'Audio' };
      } catch (error) {
        console.error('Error al seleccionar el archivo de audio:', error);
        return { blob: null, filename: null };
      }
    }
}