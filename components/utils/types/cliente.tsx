import Representante from "./representante";


export default interface Cliente {
    id: number;
    nombre: string;
    nombre_fantasia: string;
    razon_social: string;
    domicilio: string;
    localidad: string;
    codigo_postal: string;
    pais: string;
    representante: Representante;
}