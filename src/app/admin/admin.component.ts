import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from './../interfaces/User';
import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2"

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private usersService: AuthService) {}

  usuario: Usuario = new Usuario();
  dataUsers: any[] = [];
  allUsers: number = 0;

  // elemntos de paginacion background-color: rgb(226, 55, 55); border-radius: 10px; width: 40px; height: 25px;
  p: number = 1;
  itemsPage: number = 6;
  // filtro
  searchText: any;
  estado = ""

  getUsers(){
    this.usersService.getUserRegisters().subscribe(
      (res: Usuario[]) => {
      this.dataUsers = res
      this.allUsers = res.length
      }, (err) => {
        console.log(err);
      }
    )
  }

  async updateUser(usuario:Usuario){

    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html:
      `
      <!-- Email -->
      <label class="form-label">Email:</label>
      <input
        type="text"
        class="form-control"
        id="swal-email"
      />

      <!-- Nombre -->
      <label class="form-label">Nombre:</label>
      <input
        type="text"
        class="form-control"
        id="swal-nombre"
      />

      <!-- Apellido -->
      <label class="form-label">Apellido:</label>
      <input
        type="text"
        class="form-control"
        id="swal-apellido"
      />

      <!-- Telefono -->
      <label class="form-label">Telefono:</label>
      <input
        type="text"
        class="form-control"
        id="swal-telefono"
      />

      <!-- Direccion -->
      <label class="form-label">Direccion:</label>
      <input
        type="text"
        class="form-control"
        id="swal-direccion"
      />

      <!-- Estado -->
      <label for="rol" class="form-label mb-2 mt-2">Estado</label>
      <select class="form-select" id="swal-estado">
        <option value="" disabled selected hidden>
          Selecione el Estado
        </option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
      `,
      focusConfirm: true,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
        didOpen: () => {
          (<HTMLInputElement>document.getElementById('swal-email')!).value = usuario.email,
          (<HTMLInputElement>document.getElementById('swal-nombre')!).value = usuario.apellido,
          (<HTMLInputElement>document.getElementById('swal-apellido')!).value = usuario.nombre,
          (<HTMLInputElement>document.getElementById('swal-telefono')!).value = usuario.telefono,
          (<HTMLInputElement>document.getElementById('swal-direccion')!).value = usuario.direccion,
          (<HTMLInputElement>document.getElementById('swal-estado')!).value = usuario.estado as any
        },
      preConfirm: () => {
        const UpdateUsuario:Usuario = {
          email: (<HTMLInputElement>document.getElementById('swal-email')!).value,
          nombre: (<HTMLInputElement>document.getElementById('swal-nombre')!).value,
          apellido: (<HTMLInputElement>document.getElementById('swal-apellido')!).value,
          telefono: (<HTMLInputElement>document.getElementById('swal-telefono')!).value,
          direccion: (<HTMLInputElement>document.getElementById('swal-direccion')!).value,
          estado: (<HTMLInputElement>document.getElementById('swal-estado')!).value as any
        };
        this.usersService.aupdateUser(UpdateUsuario).subscribe(
            (resp: any) => {
              this.ngOnInit();
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'success',
                title: `${resp.mensaje}`
              })
            }, (err) => {
              console.log("Error: ",err);
              const errorServidor = err.error.mensaje;
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `${errorServidor}`,
              })
        })
      }
    })
    // if (formValues) {
    //   // Swal.fire(JSON.stringify(formValues))
    // }
  }

  rolAdmin: string = ' ';
  rolUser: string = ' ';
  rolPublicator: string = ' ';
  //concatenador
  concatenador: string = ' ';
  // style
  btn_rol_admin= 'background-color: grey; border-color: grey;'
  btn_rol_user = 'background-color: grey; border-color: grey;'
  btn_rol_publicator = 'background-color: grey; border-color: grey;'
  selectRolAdmin(){
    if (this.rolAdmin === ' ') {
      this.rolAdmin = 'ROLE_ADMIN'
      this.btn_rol_admin = 'background-color:  rgb(146, 0, 146); border-color: rgb(195, 112, 216);'
    } else if (this.rolAdmin.length > 1) {
      this.rolAdmin = ' '
      this.btn_rol_admin = 'background-color: grey; border-color: grey;'
    }
  }
  selectRolUser(){
    if (this.rolUser === ' ') {
      this.rolUser = 'ROLE_USER'
      this.btn_rol_user = 'background-color:  rgba(255, 166, 0, 0.89); border-color: rgb(180, 182, 83);'
    } else if (this.rolUser.length > 1) {
      this.rolUser = ' '
      this.btn_rol_user = 'background-color: grey; border-color: grey;'
    }
  }
  selectRolPublicator(){
    if (this.rolPublicator === ' ') {
      this.rolPublicator = 'ROLE_PUBLICATOR'
      this.btn_rol_publicator = 'background-color:  rgb(0, 65, 187); border-color: rgb(82, 120, 201);'
    } else if (this.rolPublicator.length > 1) {
      this.rolPublicator = ' '
      this.btn_rol_publicator = 'background-color: grey; border-color: grey;'
    }
  }
  emailCapturado:any;
  CapEmail(email:any){
    return this.emailCapturado =  email
  }
  cleanButonRols(){
    this.rolAdmin= ' ';
    this.rolUser= ' ';
    this.rolPublicator= ' ';
    this.btn_rol_admin= 'background-color: grey; border-color: grey;'
    this.btn_rol_user = 'background-color: grey; border-color: grey;'
    this.btn_rol_publicator = 'background-color: grey; border-color: grey;'
  }
  concateInput(str1:string, str2:string, str3:string){
    this.concatenador = `["${str1}","${str2}","${str3}"]`
    // this.concatenador = `${str1},${str2},${str3}`

    this.usersService.aupdateUserRol(this.emailCapturado, this.concatenador).subscribe((resp: any) => {
    this.ngOnInit();
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'success',
          title: `${resp.mensaje}`
        })
      }, (err) => {
        console.log("Error: ",err);
        const errorServidor = err.error.mensaje;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${errorServidor}`,
        })
    })
  }

  ngOnInit(): void {
    this.getUsers();
  }

}

