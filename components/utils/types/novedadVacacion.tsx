import Legajo from "./legajo";

export default interface NovedadVacacion {
    id: number;
    legajo_id: number;
    comentarios: string;
    fecha_inicio: string;
    fecha_fin: string;
    dias_vacaciones: string;
    legajo: Legajo;
}