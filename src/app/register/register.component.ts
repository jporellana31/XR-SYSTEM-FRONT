import { Router } from '@angular/router';
import { Usuario} from './../interfaces/User';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { AuthService } from '../services/auth.service';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private locationService: GeolocationService) { }

  section: number = 1;
  progressBar: string = "width: 8%;"
  btnProgress1: string = "position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill"
  btnProgress2: string = "position-absolute top-0 start-50 translate-middle btn btn-sm btn-secondary rounded-pill"
  btnProgress3: string = "position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill"

  usuario: Usuario = new Usuario();

  typePassword: string = "password"
  eyePassword: string = "bi bi-eye-slash"
  eyeColor: string = "color: black;"
  showPassword(){
    if (this.typePassword === 'password') {
      this.typePassword = 'text'
      this.eyePassword = 'bi bi-eye'
      this.eyeColor = 'color: rgb(115, 154, 225);'
    } else {
      this.typePassword = 'password'
      this.eyePassword = 'bi bi-eye-slash'
      this.eyeColor = 'color: black;'

    }
    return
  }
    getLocation() {
      this.locationService.getPosition().then(pos => {
          this.usuario.latitud = pos.lat;
          this.usuario.longitud = pos.lng;
          console.log('lat: ', this.usuario.latitud);
          console.log('long: ', this.usuario.longitud);
      });
  }

  progress1(){
    this.btnProgress1 = 'position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill'
    this.btnProgress2 = 'position-absolute top-0 start-50 translate-middle btn btn-sm btn-secondary rounded-pill'
    this.btnProgress3 = 'position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill'
    this.section = 1;
    this.progressBar = 'width: 8%;'
    return
  }
  progress2(){
      // valido el primer form
    if (this.usuario.nombre === undefined || this.usuario.apellido === undefined) {
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
    } else if (this.usuario.nombre.length === 0 || this.usuario.apellido.length === 0 || this.usuario.nombre.trim().length === 0 || this.usuario.apellido.trim().length === 0) {
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
    } else if (this.usuario.latitud == 0 || this.usuario.longitud == 0) {
      Swal.fire({
        title: 'Ubicacion no econtrada!',
        text: 'Permita acceder a la ubicacion dando click en "Permitir (A)", para poder continuar.',
        imageUrl: '../../assets/imgs/permitir_ubicacion.png',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
      })
    }
    else {
      this.btnProgress1 = 'position-absolute top-0 start-0 translate-middle btn btn-sm btn-success rounded-pill'
      this.btnProgress2 = 'position-absolute top-0 start-50 translate-middle btn btn-sm btn-primary rounded-pill'
      this.btnProgress3 = 'position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill'
      this.section = 2;
      this.progressBar = 'width: 50%;'
    }
    return
  }
  verificarCel(texto: string){
    const letras="abcdefghyjklmnñopqrstuvwxyz";
    texto = texto.toLowerCase();
    for(var i=0; i<texto.length; i++){
      if (letras.indexOf(texto.charAt(i),0)!=-1){
          return 1;
      }
    }
    return 0;
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
  progress3(){
    if (this.usuario.cedula === undefined || this.usuario.telefono === undefined || this.usuario.direccion === undefined) {
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
    } else if (this.usuario.cedula.length === 0 || this.usuario.telefono.length === 0 || this.usuario.direccion.length === 0 || this.usuario.cedula.trim().length === 0 || this.usuario.telefono.trim().length === 0 || this.usuario.direccion.trim().length === 0) {
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
    } else if (this.verificarCel(this.usuario.telefono)) {
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
        title: 'Campo Telefono no permite letras'
      })
    } else if (this.usuario.telefono.length <= 9) {
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
        title: 'Numero de telefono no valido'
      })
    }
    else if(this.validarCedula(this.usuario.cedula) != true) {
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
    }
    else {
      this.btnProgress1 = 'position-absolute top-0 start-0 translate-middle btn btn-sm btn-success rounded-pill'
      this.btnProgress2 = 'position-absolute top-0 start-50 translate-middle btn btn-sm btn-success rounded-pill'
      this.btnProgress3 = 'position-absolute top-0 start-100 translate-middle btn btn-sm btn-primary rounded-pill'
      this.progressBar = 'width: 100%;'
      this.section = 3;
    }
    return
  }
  guardarUser() {
    const regex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\],;:\s@"]{2,63}$/i;
    if (this.usuario.email === undefined || this.usuario.password === undefined) {
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
    } else if (this.usuario.email.length === 0 || this.usuario.password.length === 0 || this.usuario.email.trim().length === 0 || this.usuario.password.trim().length === 0) {
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
    }  else if (!regex.test(this.usuario.email)) {
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
    } else if(this.usuario.password!.length < 5){
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
        title: 'La contraseña es muy corta'
      })
    } else {
      this.btnProgress3 = 'position-absolute top-0 start-100 translate-middle btn btn-sm btn-success rounded-pill'
      this.authService.registerUser(this.usuario).subscribe(
        (resp) => {
          console.log("Respuesta: ",resp);
          // this.usuarioSave.push(this.usuario)
          console.log(resp);
        }, (err) => {
          //Alerta de ERROR
          const errorServidor = err.error.mensaje;
          console.log('Error: ',err)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${errorServidor}`,
          })
        }, () => {
          //Alerta satisfactoria de usuario guardado
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Usuario Registrado',
            showConfirmButton: false,
            timer: 1500
          })
          this.router.navigateByUrl('/login')
      })
    }
  }

  ngOnInit(): void {
    this.getLocation();
  }

}
