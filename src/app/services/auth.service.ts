import { Usuario } from './../interfaces/User';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _usuario: Usuario| null = null;
  private _token: string| null = null;
  private idUser!: number;

  constructor(private http: HttpClient) {}

  getUserRegisters() {
    return this.http.get<Usuario[]>(environment.Url + '/personas');
  }

  getUser(id: number) {
    return this.http.get<Usuario>(environment.Url + '/persona/'+id);
  }

  getUserByEmail(email: string){
    return this.http.get<Usuario>(environment.Url + `/user/${email}`);
  }

  changePassword(email:string, newPassword:string){
    let json = JSON.stringify('{}');
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(environment.Url + `/usuario/${email}/${newPassword}`, params, { headers: headers }).pipe(map((data) => { return data }));
  }

  forgotPassword(usuario:Usuario){
    return this.http.get(environment.Url + `/usuario/password/lost/${usuario.cedula}/${usuario.email}`);
  }

  registerUser(usuario: Usuario) {
    let json = JSON.stringify(usuario);
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(environment.Url + '/usuario', params, { headers: headers })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndpoint = environment.UrlAuth + 'oauth/token';

    const credenciales = btoa('angularapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales,
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.email);
    params.set('password', usuario.password!);
    //console.log(params.toString());
    return this.http.post<any>(urlEndpoint, params.toString(), {
      headers: httpHeaders
    });
  }

  //guarda token en el storage al loguearce
  guardarToken(accessToken: string): void {
    // console.log("guardarToken: ", accessToken)
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  //comprueba si existe un token y lo retorna
  public get tokencito(): string| null {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  //Obtengo datos del token atraves del access_token
  obtenerDatosToken(accessToken: string): any {
    // console.log("obtenerDatosToken: ", accessToken )
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  // compruebo si esta autenticado
  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.tokencito!);
    // console.log("isAuthenticated-payload: ", payload)
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false
  }

  //verifico si tiene rol admin devolviendo TRUE si lo es
  capturoRol(): boolean{
    let payload = this.obtenerDatosToken(this.tokencito!);
    let _rol = payload.authorities
    return _rol.includes("ROLE_ADMIN")
  }


 //boolenao si tiene un rol
 hasRole(role: any): boolean {
  if (this.usuario.roles!.includes(role)) {
    return true;
  }
  return false;
 }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    localStorage.clear();
    Swal.fire('Sesión Cerrada', 'vuelve pronto... :)', 'success');
  }

  //obtiene el usuario activo
  public get usuario(): Usuario {
    // console.log("This.Usuario:", this.usuario)
    if (this._usuario != null) {
      // console.log("if-usuario>:", this._usuario)
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')!) as Usuario;
      // console.log("else-if-Usuario>:", this._usuario)
      return this._usuario;
    }
    return new Usuario();
  }


  // actualizar el usuario
  aupdateUser(usuario: Usuario){
    let json = JSON.stringify(usuario);
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(environment.Url + `/usuario/${usuario.email}`, params, { headers: headers }).pipe(map((data) => { return data }));
  }


  // actualizar roles del usuario
  aupdateUserRol(email: string, roles:string){
    // let json = JSON.stringify(roles);
    let json = roles
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(environment.Url + `/usuario/roles/${email}`, params, { headers: headers }).pipe(map((data) => { return data }));
  }


// funciones en desuso >>>>>>>>>>>>>>>>>

guardarUsuario(accessToken: string): void {
  let payload = this.obtenerDatosToken(accessToken);
  this._usuario = new Usuario();
  this._usuario.id = payload.id;
  this._usuario.nombre = payload.nombre;
  this._usuario.apellido = payload.apellido;
  this._usuario.email = payload.roles;
  this._usuario.email = payload.user_name;
  this._usuario.roles = payload.authorities;
  sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
}

 /* loginAutomatico(){

    this.logout();
     let user: Usuario = new Usuario();
     user.email = 'soporte.alaorden@gmail.com';
     user.password = btoa('igPqEn');
     this.login(user).subscribe(res => {

   this.guardarUsuario(res.access_token);
     this.guardarToken(res.access_token);
    // this._route.navigateByUrl('/home/inicio');
    return true;


   }, error =>{
        //alert("Erro Login");

        // console.log(error.error);
          // console.log(error.error);
          // this.cargando = false;
       });
    }*/

}
