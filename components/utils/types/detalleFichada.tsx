export default interface DetalleFichada {
    id: number,
    dia: string;
    fecha: string;
    ingreso: string |null;
    salida: string |null;
    horasTrabajadas: string |null;
}