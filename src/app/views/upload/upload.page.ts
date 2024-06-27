import { Component } from "@angular/core";
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { ImagePicker, ImagePickerOptions } from "@awesome-cordova-plugins/image-picker/ngx";
import { WebView } from "@awesome-cordova-plugins/ionic-webview/ngx";
import { Platform } from "@ionic/angular";
import {FileSelector} from 'capacitor-file-selector'

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss'],
  providers: [FileChooser, File, ImagePicker, WebView]
})
export class UploadPage {

    selectImage: boolean = false;
    selectAudio: boolean = false;
    nameAudio: string = '';
    srcImage: string = '';
    selectedGenres: string[] = [];
    showAlert: boolean = false;
    alertMessage: string = '';
    alertCode: number = 0;
    isShow: boolean = false;
    genres: Array<{id: number, description: string}> = [
        { id: 1, description: 'Rock' },
        { id: 2, description: 'Pop' },
        { id: 3, description: 'Jazz' },
        { id: 5, description: 'Electronic' }
      ];
      songName: string = '';
      regexSongname: string = '.{4,}';
      isValidSongname: boolean = false;

  constructor(
    private fileChooser: FileChooser,
    private file: File,
    private platform: Platform,
    private imagePicker: ImagePicker,
    private webView: WebView
  ) { }

  private showMessageBar(message: string, code: 0 | 1 | 3 = 0) {
    if (this.isShow) return;

    this.isShow = true;
    this.alertCode = code;
    this.alertMessage = message;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
      this.isShow = false;
    }, 3000);
  }

    onValueChangeSongname(newValue: string){
        this.songName = newValue;
        this.isValidSongname = new RegExp(this.regexSongname).test(newValue);
    }

    async selectFile() {
        let multiple_selection = false;
        let ext = ["audio/*"];
        let formData = new FormData();
        let selectedFile = await FileSelector.fileSelector({
            multiple_selection: multiple_selection,
            ext: ext
        });
    
        if (!selectedFile || !selectedFile.paths || selectedFile.paths.length === 0) {
            console.log("No se seleccionó ningún archivo de audio.");
            return;
        }
    
        if (selectedFile.paths.length > 1) {
            console.log("Se seleccionaron múltiples archivos. Se esperaba seleccionar solo uno.");
            return;
        }
    
        let fileName = '';
    
        if (this.platform.is("android")) {
            let file = await fetch(selectedFile.paths[0]).then(r => r.blob());
            fileName = selectedFile.original_names[0] + selectedFile.extensions[0];
            formData.append(
                "myfile[]",
                file,
                fileName
            );
        } else if (this.platform.is("ios")) {
            let file = await fetch(selectedFile.paths[0]).then(r => r.blob());
            fileName = selectedFile.original_names[0] + selectedFile.extensions[0];
            formData.append(
                "myfile[]",
                file,
                fileName
            );
        } else {
            FileSelector.addListener("onFilesSelected", (data: FileList) => {
                if (data.length > 1) {
                    console.log("Se seleccionaron múltiples archivos. Se esperaba seleccionar solo uno.");
                } else {
                    const file = data.item(0);
                    if (file) {
                        fileName = file.name;
                        formData.append(
                            "myfile[]",
                            file,
                            fileName
                        );
                    }
                }
            });
        }
        this.nameAudio = fileName;
        // Aquí puedes continuar con el procesamiento del formData o lo que sea necesario
        console.log("Nombre del archivo seleccionado:", fileName); // Mostrar el nombre del archivo seleccionado
    }
    
    


      //Metodo para abrir imagen
      openImagePicker = async () => {  
        const hasPermission = await this.imagePicker.hasReadPermission();
        console.log('Status del permiso: ', hasPermission)
        if(!hasPermission) {
            const permission = await this.imagePicker.requestReadPermission();
            console.log('El permiso que dio es: ', permission)
        }else{
            const options: ImagePickerOptions = {
                maximumImagesCount: 1,
            }
            const photos = await this.imagePicker.getPictures(options);
            if(photos){
                const srcImage = this.webView.convertFileSrc(photos[0]);
                this.selectImage = true;
                this.srcImage = srcImage;
            }else{
                console.log('El resultado de las fotos es vacio');
            }
            
        }

    }
}
