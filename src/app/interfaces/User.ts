export class Usuario {
    id?:                  number;
    cedula?:              string;
    nombre!:              string;
    apellido!:            string;
    email!:               string;
    emailEncripted?:      string;
    password?:             string;
    telefono!:            string;
    direccion!:           string;
    estado!:              boolean;
    estadoTokenRegistro?: boolean;
    roles?:                string[]=[];
    fechaCreacion?:        Date=new Date();
    longitud?:             number=0;
    latitud?:              number=0;
}

// Interfaces para perfiles del usuario
export interface UserInterface {
  id:                  number;
  cedula:              string;
  nombre:              string;
  apellido:            string;
  email:               string;
  emailEncripted:      string;
  password:            string;
  telefono:            number;
  direccion:           number;
  estado:              boolean;
  estadoTokenRegistro: boolean;
  roles:               Role[];
  fechaCreacion:       Date;
  longitud:            number;
  latitud:             number;
}

export interface Role {
  id:     number;
  nombre: string;
}
