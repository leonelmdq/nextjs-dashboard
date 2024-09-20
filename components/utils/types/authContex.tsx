// /context/AuthContext.tsx
import { createContext } from 'react';
import Ruta from "./appruta";
import User from "./user";
import Modulo from "./modulo";
import UserPermiso from "./userPermisos";

interface AuthContextType {
    user: User | null;
    token: string | null;
    permisos: UserPermiso[];
    modulos: Modulo[];
    rutas: Ruta[];
    moduloActivo: Modulo | null;
    rutaActiva: Ruta | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setPermisos: (permisos: UserPermiso[]) => void;
    setRutas: (Ruta: Ruta[]) => void;
    setModulos: (modulos: Modulo[]) => void;
    setModuloActivo: (moduloActivo: Modulo | null) => void;
    setRutaActiva: (rutaActiva: Ruta| null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
