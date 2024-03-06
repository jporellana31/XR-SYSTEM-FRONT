import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FtpService {

  private baseUrl = 'http://localhost:8080/api/upload';



  constructor(private http: HttpClient) {}


  enviarDatosFtp(dicomFiles: File[], personName: string, cedula: string){
    const formData = new FormData();

    dicomFiles.forEach((file, index) => {
      formData.append(`dicomFiles`, file, file.name);
    });

    formData.append('personName', personName);
    formData.append('cedula', cedula);

    return this.http.post<any>(this.baseUrl, formData);

}
}
