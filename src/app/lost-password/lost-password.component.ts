import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { Usuario } from '../interfaces/User';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.css']
})
export class LostPasswordComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

usuario: Usuario = new Usuario()

  changePassword(){
    const regex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\],;:\s@"]{2,63}$/i;
    if (this.usuario.cedula === undefined || this.usuario.email === undefined) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'info',
        title: 'Rellene todo los campos'
      })
    }else if (this.usuario.cedula.length === 0 || this.usuario.email.length === 0 || this.usuario.cedula.trim().length === 0 || this.usuario.email.trim().length === 0) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'info',
        title: 'Rellene todo los campos'
      })
    } else if(this.validarCedula(this.usuario.cedula) != true) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'error',
        title: 'Cedula no valida'
      })
    } else if (!regex.test(this.usuario.email)) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'info',
        title: 'Correo no valido'
      })
    } else {

      this.authService.forgotPassword(this.usuario).subscribe(
        (res) => {
          console.log('El cliente se actualizo con exito')
        }, (err) => {
          console.log(err)
        }, () => {
          // alerta correo
      Swal.fire({
        title: 'Contraseña Actualizada!',
        html: `<h3>Su contraseña fue restablecida y enviada al correo: </h3>
          <h2 style="color:blue;">${this.usuario.email}</h2>
          `,
        imageUrl: 'https://media.gcflearnfree.org/content/5b10404e6d5ad52ca4b6e50b_2_2_2013/Imagen%201.png',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Contraseña Restablecida y enviada al correo',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('/login')
        }
      })
        }
      )
    }
  }

  validarCedula(cedula: string): boolean {
    // Url autor: https://gist.github.com/vickoman/7800717
    if (cedula.length === 10) {

      // Obtenemos el digito de la region que sonlos dos primeros digitos
      const digitoRegion = cedula.substring(0, 2);

      // Pregunto si la region existe ecuador se divide en 24 regiones
      if (digitoRegion >= String(0) && digitoRegion <= String(24)) {

        // Extraigo el ultimo digito
        const ultimoDigito = Number(cedula.substring(9, 10));

        // Agrupo todos los pares y los sumo
        const pares = Number(cedula.substring(1, 2)) + Number(cedula.substring(3, 4)) + Number(cedula.substring(5, 6)) + Number(cedula.substring(7, 8));

        // Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
        let numeroUno: any = cedula.substring(0, 1);
        numeroUno = (numeroUno * 2);
        if (numeroUno > 9) {
          numeroUno = (numeroUno - 9);
        }

        let numeroTres: any = cedula.substring(2, 3);
        numeroTres = (numeroTres * 2);
        if (numeroTres > 9) {
          numeroTres = (numeroTres - 9);
        }

        let numeroCinco: any = cedula.substring(4, 5);
        numeroCinco = (numeroCinco * 2);
        if (numeroCinco > 9) {
          numeroCinco = (numeroCinco - 9);
        }

        let numeroSiete: any = cedula.substring(6, 7);
        numeroSiete = (numeroSiete * 2);
        if (numeroSiete > 9) {
          numeroSiete = (numeroSiete - 9);
        }

        let numeroNueve: any = cedula.substring(8, 9);
        numeroNueve = (numeroNueve * 2);
        if (numeroNueve > 9) {
          numeroNueve = (numeroNueve - 9);
        }

        const impares = numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;

        // Suma total
        const sumaTotal = (pares + impares);

        // extraemos el primero digito
        const primerDigitoSuma = String(sumaTotal).substring(0, 1);

        // Obtenemos la decena inmediata
        const decena = (Number(primerDigitoSuma) + 1) * 10;

        // Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
        let digitoValidador = decena - sumaTotal;

        // Si el digito validador es = a 10 toma el valor de 0
        if (digitoValidador === 10) {
          digitoValidador = 0;
        }

        // Validamos que el digito validador sea igual al de la cedula
        if (digitoValidador === ultimoDigito) {
          return true;
        } else {
          return false;
        }

      } else {
        // imprimimos en consola si la region no pertenece
        return false;
      }
    } else {
      // Imprimimos en consola si la cedula tiene mas o menos de 10 digitos
      return false;
    }

  }

}
