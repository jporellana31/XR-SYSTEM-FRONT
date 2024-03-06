import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../interfaces/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, @Inject(DOCUMENT) document: any) { }

  userNombre: string = "";
  userApellido: string = "";
  userEmail: string = "";

  idUser: number | undefined;

  ngOnInit(): void {
  }

  UserByEmail(email: string){
    this.authService.getUserByEmail(email).subscribe(
      (res: Usuario) => {
        this.idUser = res.id;
        // console.log("idActual: ", this.idUser);
      }, (err) => {
        console.log("ERROR: ",err);
      }
    )
  }

  UserNav(){
    try{
        let payload = this.authService.obtenerDatosToken(this.authService.tokencito!);
        const lastName = payload.apellido.charAt(0).toUpperCase() + payload.apellido.slice(1);
        const name = payload.nombre.charAt(0).toUpperCase() + payload.nombre.slice(1);
        const email= payload.user_name;
        return this.userApellido = lastName, this.userNombre = name, this.userEmail = email
    } catch(e) {
    }
  }

  goLogin(){
    this.router.navigateByUrl("/login")
  }
  goRegister(){
    this.router.navigate(["/register"])
  }

  isAdmin(): boolean{
    try{
      this.UserNav();
      // this.UserByEmail();
      return this.authService.capturoRol();
    } catch (e){
      return false
    }
  }

  logout(){
    this.authService.logout()
    this.userApellido = ""
    this.userNombre = ""
    this.userEmail = ""
    this.router.navigateByUrl("/login")
  }

}
