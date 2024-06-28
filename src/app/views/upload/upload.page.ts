import { Component, OnInit } from "@angular/core";
import { File } from '@awesome-cordova-plugins/file/ngx';
import {FilePath} from '@awesome-cordova-plugins/file-path/ngx'
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { ImagePicker, ImagePickerOptions } from "@awesome-cordova-plugins/image-picker/ngx";
import { WebView } from "@awesome-cordova-plugins/ionic-webview/ngx";
import { Platform } from "@ionic/angular";
import {FileSelector} from 'capacitor-file-selector'
import { Capacitor } from "@capacitor/core";
import {AndroidPermissions} from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss'],
  providers: [FileChooser, File, ImagePicker, WebView, FilePath]
})
export class UploadPage implements OnInit {

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
    private androidPermissions : AndroidPermissions,
    private fileChooser: FileChooser,
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    private imagePicker: ImagePicker,
    private webView: WebView,
  ) { }


  ngOnInit(): void {
      this.checkPermissions();
  }


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

    // selectFile() {
    //     let multiple_selection = false;
    //     let ext = ["audio/*"];
    //     let formData = new FormData();
    
    //     FileSelector.fileSelector({
    //         multiple_selection: multiple_selection,
    //         ext: ext
    //     }).then(selectedFile => {
    //         console.log(selectedFile)
    //         if (!selectedFile || !selectedFile.paths || selectedFile.paths.length === 0) {
    //             console.log("No se seleccionó ningún archivo de audio.");
    //             return;
    //         }
    
    //         if (selectedFile.paths.length > 1) {
    //             console.log("Se seleccionaron múltiples archivos. Se esperaba seleccionar solo uno.");
    //             return;
    //         }
    
    //         let fileName = '';
    
    //         if (this.platform.is("android")) {
    //             fetch(selectedFile.paths[0])
    //                 .then(r => r.blob())
    //                 .then(file => {
    //                     fileName = selectedFile.original_names[0] + selectedFile.extensions[0];
    //                     formData.append("myfile[]", file, fileName);
    //                     this.nameAudio = fileName;
    //                     console.log("Nombre del archivo seleccionado:", fileName);
    //                 })
    //                 .catch(error => console.log("Error al procesar el archivo en Android:", error));
    //         } else if (this.platform.is("ios")) {
    //             fetch(selectedFile.paths[0])
    //                 .then(r => r.blob())
    //                 .then(file => {
    //                     fileName = selectedFile.original_names[0] + selectedFile.extensions[0];
    //                     formData.append("myfile[]", file, fileName);
    //                     this.nameAudio = fileName;
    //                     console.log("Nombre del archivo seleccionado:", fileName);
    //                 })
    //                 .catch(error => console.log("Error al procesar el archivo en iOS:", error));
    //         } else {
    //             FileSelector.addListener("onFilesSelected", (data: FileList) => {
    //                 if (data.length > 1) {
    //                     console.log("Se seleccionaron múltiples archivos. Se esperaba seleccionar solo uno.");
    //                 } else {
    //                     const file = data.item(0);
    //                     if (file) {
    //                         fileName = file.name;
    //                         formData.append("myfile[]", file, fileName);
    //                         this.nameAudio = fileName;
    //                         console.log("Nombre del archivo seleccionado:", fileName);
    //                     }
    //                 }
    //             });
    //         }

    //         console.log('Se selecciono el archivo', fileName)
    //     }).catch(error => {
    //         console.log("Error al seleccionar el archivo:", error);
    //     });
    // }
    
   selectFile() {

    this.fileChooser.open()
        .then(uri => {
            console.log('Archivo seleccionado:', uri);
            this.getFileName(uri);
        })
        .catch(error => console.log(`Hubo un error al intentar seleccionar un audio. ${error}`))
    }


    getFileName(filePath: string) {
        console.log('Iniciando getFileName con filePath:', filePath);
      
        this.filePath.resolveNativePath(filePath).then((nativeFilePath) => {
          console.log('Ruta nativa del archivo:', nativeFilePath);
      
          this.file.resolveLocalFilesystemUrl(nativeFilePath).then(fileEntry => {
            console.log('Archivo resuelto:', fileEntry);
      
            fileEntry.getMetadata(metadata => {
              console.log('Metadata del archivo obtenida:', metadata);
              console.log('Nombre del archivo:', fileEntry.name);
              this.convertFileToBlob(nativeFilePath, fileEntry.name);
            }, error => {
              console.log('Error al obtener metadata del archivo:', JSON.stringify(error));
            });
      
          }).catch(error => {
            console.log('Hubo un error al resolver la URL del archivo:', JSON.stringify(error));
          });
      
        }).catch(error => {
          console.log('Hubo un error al resolver la ruta nativa del archivo:', JSON.stringify(error));
        });
      }
      

      convertFileToBlob(filePath: string, fileName: string) {
        this.file.resolveLocalFilesystemUrl(filePath).then(fileEntry => {
          (fileEntry as any).file((file: any) => {
            console.log('Se empezó a leer el archivo');
            console.log('Tipo de archivo:', file.type);
            
            // Depuración: Mostrar la ruta y el nombre del archivo
            console.log('Ruta del archivo:', filePath);
            console.log('Nombre del archivo:', fileName);
      
            // Leer el archivo como ArrayBuffer usando el plugin File
            const directoryPath = filePath.substring(0, filePath.lastIndexOf('/'));
            const fileOnlyName = filePath.substring(filePath.lastIndexOf('/') + 1);
      
            this.file.readAsArrayBuffer(directoryPath, fileOnlyName)
              .then((arrayBuffer: ArrayBuffer) => {
                const blob = new Blob([arrayBuffer], { type: file.type });
                this.uploadFile(blob, fileName);
                this.nameAudio = 'Se ha seleccionado correctamente el archivo';
              })
              .catch(error => {
                console.log('Error al leer el archivo como ArrayBuffer:', JSON.stringify(error));
              });
      
          }, (error: any) => {
            console.log('Error al obtener el archivo:', JSON.stringify(error));
          });
        }).catch(error => console.log(`Hubo un error al resolver la URL del archivo ${JSON.stringify(error)}`));
      }
      
      
      

      uploadFile(blob: Blob, fileName: string) {
        const formData = new FormData();
        formData.append('file', blob, fileName);
    
        // Aquí puedes implementar la lógica para subir el archivo
        console.log('Se subió el archivo correctamente:', fileName);
      }

    

      checkPermissions() {
        if (this.platform.is('android')) {
          this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
            result => {
              if (!result.hasPermission) {
                console.log('No tiene permisos de lectura')
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
              }else{
                console.log('Tiene permisos de lectura')
              }
            },
            err => {
                console.log('Ocurrio un error al pedir los permisos de lecturas')
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
            }
          );
          
          this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
            result => {
              if (!result.hasPermission) {
                console.log('No tiene los permisos de escritura')
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
              }else{
                console.log('Tiene permisos de escritura')
              }
            },
            err => {
                console.log('Ocurrio un error al pedir los permisos de escritura')
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
            }
          );
      
          this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE).then(
            result => {
              if (!result.hasPermission) {
                console.log('No tiene permisos de managed')
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE);
              }else{
                console.log('Tiene permisos de managed')
              }
            },
            err => {
                console.log('Ocurrio un error al pedir los permisos managed')
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE);
            }
          );
        }
      }


      //Metodo para abrir imagen
      async openImagePicker() {  
        try {
            this.checkPermissions();
            const options: ImagePickerOptions = {
                maximumImagesCount: 1,
            };
            
            const photos = await this.imagePicker.getPictures(options);
    
            if (photos && photos.length > 0) {
                const srcImage = this.webView.convertFileSrc(photos[0]);
                this.selectImage = true;
                this.srcImage = srcImage;
                console.log('Imagen seleccionada:', srcImage);
            } else {
                console.log('El resultado de las fotos es vacio');
            }
        } catch (error) {
            console.log('Error al abrir el selector de imágenes:', error);
        }
    }
    
}
