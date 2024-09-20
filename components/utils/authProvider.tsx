import React, { useMemo, useContext, useState, ReactNode } from 'react';
import { AuthContext } from "./types/authContex";
import User from "./types/user";
import Ruta from "./types/appruta";
import UserPermiso from "./types/userPermisos";
import Modulo from "./types/modulo";
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [permisos, setPermisos] = useState<UserPermiso[]>([]);
    const [modulos, setModulos] = useState<Modulo[]>([]);
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [moduloActivo, setModuloActivo] = useState<Modulo | null>(null);
    const [rutaActiva, setRutaActiva] = useState<Ruta | null>(null);

    const contextValue = useMemo(() => ({
        user,
        token,
        permisos,
        modulos,
        rutas,
        moduloActivo,
        rutaActiva,
        setUser,
        setToken,
        setPermisos,
        setModulos,
        setRutas,
        setModuloActivo,
        setRutaActiva,
    }), [user, token, permisos, modulos, rutas, moduloActivo, rutaActiva]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
