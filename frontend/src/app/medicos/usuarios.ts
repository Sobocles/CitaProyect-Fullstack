export interface Usuario {
    rut: string;
    nombre: string;
    apellidos: string;
    email: string;
    fecha_nacimiento: string;
    telefono: string;
    direccion: string;
}

export interface UsuariosResponse {
    usuarios: Usuario[];
}