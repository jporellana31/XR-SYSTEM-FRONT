import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FtpService {
  private baseUrl = 'http://localhost:8080/api/upload/ftp';

  constructor(private http: HttpClient) {}

  enviarDatosFtp(dicomFiles: File[], personName: string, cedula: string): Observable<string> {
    const formData = new FormData();

    dicomFiles.forEach((file) => {
      formData.append('dicomFiles', file, file.name);
    });

    formData.append('personName', personName);
    formData.append('cedula', cedula);

    // Especifica que esperas una respuesta en formato de texto
    return this.http.post<string>(this.baseUrl, formData, { responseType: 'text' as 'json' });
  }
}
