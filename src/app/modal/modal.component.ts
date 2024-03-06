import { Component, OnInit, Input } from '@angular/core';
import { FtpService } from '../services/ftp.service';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(private ftpService: FtpService, private fileService: FileService) { }



  ngOnInit(): void {
  }


  personName: string = '';
  cedula: string = '';
  dicomFiles: File[] = [];

  enviarDatosFtp(){
    this.dicomFiles = this.fileService.getDicomFiles() as File[];
    if (typeof this.dicomFiles === 'object' && !Array.isArray(this.dicomFiles)) {
      // Convierte dicomFiles en un array de sus valores
      this.dicomFiles = Object.values(this.dicomFiles);
    }
  this.ftpService.enviarDatosFtp(this.dicomFiles, this.personName, this.cedula)
  .subscribe(
    (respuesta) => {
        console.log('Respuesta del servidor:', respuesta);
        // Manejar la respuesta del servidor
    },
    (error) => {
        console.error('Error al enviar datos al controlador:', error);
        // Manejar errores
    }
);

  }
}
