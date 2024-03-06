import  Swal  from 'sweetalert2';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // si no esta logueado redirecciono a login
    if(!this.authService.isAuthenticated()){
      this.router.navigate(["/login"]);
      return false
    }

    // compruebo si tiene permisos de administrador
    if(this.authService.capturoRol() == true){
      return true
    } else {
      Swal.fire('Sin Acceso', 'No esta Disponible para usuarios', 'error');
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
