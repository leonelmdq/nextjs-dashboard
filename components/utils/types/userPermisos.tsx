import Ruta from "./appruta";
import User from "./user";

export default interface UserPermisos {
    id: number;         
    user_id: User;  
    ruta_id: Ruta;
}