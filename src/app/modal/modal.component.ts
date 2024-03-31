import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FtpService } from '../services/ftp.service';
import { FileService } from '../services/file.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @ViewChild('envioModalRef') envioModalRef!: ElementRef;
  @ViewChild('confirmacionModalRef') confirmacionModalRef!: ElementRef;

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
      this.cerrarModal(this.envioModalRef);
        this.mostrarModal(this.confirmacionModalRef);

    },
    (error) => {
        console.error('Error al enviar datos al controlador:', error);
        // Manejar errores
    }
);

  }
  cerrarModal(modalRef: ElementRef) {
    const modalInstance = Modal.getInstance(modalRef.nativeElement);
    if (modalInstance) {
      modalInstance.hide();
      // Intento de eliminar manualmente el backdrop
      document.querySelector('.modal-backdrop')?.remove();
    }
  }

  mostrarModal(modalRef: ElementRef) {
    const modalInstance = new Modal(modalRef.nativeElement);
    modalInstance.show();
  }
}
