export class InfoClinica {
    public nombreClinica: string;
    public direccion: string;
    public telefono: string;
    public email: string;

    constructor(nombreClinica: string, direccion: string, telefono: string, email: string) {
        this.nombreClinica = nombreClinica;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }
}
