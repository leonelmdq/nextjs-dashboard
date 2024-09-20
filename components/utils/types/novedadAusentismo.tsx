import Legajo from "./legajo";
import Nosocomio from "./nosocomio";
import TipoAusentismo from "./tipoAusentismo";

export default interface NovedadAusentismo {
    id: number;
    legajo_id: number;
    fecha_evento: string;
    nosocomio_id: number;
    profesional: string;
    comentarios: string;
    ausentismo_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    dias_ausente: string;
    diagnostico: string;
    legajo: Legajo;
    nosocomio: Nosocomio;
    ausentismo: TipoAusentismo
}