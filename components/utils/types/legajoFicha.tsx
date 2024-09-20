import Legajo from "./legajo";
type TipoLiquidacion = 'HORA' | 'MENSUAL';

export default interface LegajoFicha {
    legajo_id: number;
    calle?: string;
    numero?: string;
    piso?: string;
    dpto?: string;
    codigo_postal?: string;
    localidad?: string;
    provincia?: string;
    pais?: string;
    telefono?: string;
    email?: string;
    fecha_nacimiento: Date;
    cuil?: string;
    fecha_ingreso: Date;
    fecha_antiguedad: Date;
    fecha_egreso?: Date;
    tipo_liquidacion: TipoLiquidacion;
    instruccion?: string;
    legajo: Legajo;
}