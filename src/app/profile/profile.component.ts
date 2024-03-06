import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Usuario } from '../interfaces/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private idRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  profileID: number = 0;
  userData: Usuario[] = [];
  haveRols: any[] = [];
  usuario: Usuario = new Usuario();
  newPassword: string = '';

  getDataUser() {
    this.profileID = Number(this.idRoute.snapshot.paramMap.get('id'));
    this.authService.getUser(this.profileID).subscribe(
      (resp) => {
        let { roles, ...todo } = resp;

        roles!.forEach((item: any) => {
          this.haveRols.push(item.nombre);
        });

        this.userData.push({ ...todo });
      },
      (err) => {
        console.log('ERROR: ', err);
        if (err.status == 0) {
          Swal.fire('Servicio', 'No esta Disponible', 'error');
        }
      },
      () => {}
    );
  }
  verificarCel(texto: string) {
    const letras = 'abcdefghyjklmnñopqrstuvwxyz';
    texto = texto.toLowerCase();
    for (var i = 0; i < texto.length; i++) {
      if (letras.indexOf(texto.charAt(i), 0) != -1) {
        return 1;
      }
    }
    return 0;
  }

  update(data: Usuario) {
    const regex =
      /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\],;:\s@"]{2,63}$/i;
    if (
      data.email == undefined ||
      data.nombre == undefined ||
      data.apellido == undefined ||
      data.telefono == undefined ||
      data.direccion == undefined
    ) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'info',
        title: 'Rellene los campos de Edit Profile',
      });
    } else if (
      data.email.length === 0 || data.email.trim().length === 0 ||
      data.nombre.length === 0 || data.nombre.trim().length === 0 ||
      data.apellido.length === 0 || data.apellido.trim().length === 0 ||
      data.telefono.length === 0 || data.telefono.trim().length === 0 ||
      data.direccion.length === 0 || data.direccion.trim().length === 0
    ) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'info',
        title: 'Rellene los campos de Edit Profile',
      });
    } else if (this.verificarCel(data.telefono)) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'info',
        title: 'Campo Telefono no permite letras',
      });
    } else if (data.telefono.length <= 9) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'info',
        title: 'Numero de telefono no valido',
      });
    } else if (!regex.test(data.email)) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'info',
        title: 'Correo no valido',
      });
    } else {
      Swal.fire({
        title: 'Seguro quieres editar el perfil?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          const UpdateUsuario: Usuario = {
            email: data.email,
            nombre: data.nombre,
            apellido: data.apellido,
            telefono: data.telefono,
            direccion: data.direccion,
            estado: data.estado,
          };
          this.authService.aupdateUser(UpdateUsuario).subscribe(
            (resp: any) => {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
              });
              Toast.fire({
                icon: 'success',
                title: `${resp.mensaje}`,
              });
            },
            (err) => {
              console.log('Error: ', err);
              const errorServidor = err.error.mensaje;
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `${errorServidor}`,
              });
            }
          );
        }
      });
    }
  }

  PasswordUpdate(data: Usuario, password: string) {
    if (password === '') {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'info',
        title: 'El campo Nueva coantraseña esta vacio',
      });
    } else if (password.length < 5) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'info',
        title: 'La contraseña es muy corta',
      });
    } else {
      Swal.fire({
        title: 'Seguro quieres cambiar de contraseña?',
        text: 'No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.authService.changePassword(data.email, password).subscribe(
            (res: any) => {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
              });
              Toast.fire({
                icon: 'success',
                title: `${res.mensaje}`,
              });
            },
            (err) => {
              console.log('Error: ', err);
              const errorServidor = err.error.mensaje;
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `${errorServidor}`,
              });
            }
          );
        }
      });
    }
  }

  typePassword: string = 'password';
  eyePassword: string = 'bi bi-eye-slash';
  eyeColor: string = 'color: black;';
  showPassword() {
    if (this.typePassword === 'password') {
      this.typePassword = 'text';
      this.eyePassword = 'bi bi-eye';
      this.eyeColor = 'color: rgb(115, 154, 225);';
    } else {
      this.typePassword = 'password';
      this.eyePassword = 'bi bi-eye-slash';
      this.eyeColor = 'color: #262626;';
    }
    return;
  }

  ngOnInit(): void {
    this.getDataUser();
  }
}
