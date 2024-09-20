import Departamento from "./departamento";

export default interface Legajo {
    id: number; 
    nombre: string;
    apellido: string;
    departamento: Departamento;
    imagen: string;
}