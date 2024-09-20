'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Link from "next/link";
import Ruta from '../utils/types/appruta';
import { useRouter } from 'next/navigation';

interface Menues {
    nombre: string;
    fecha: string;
}
function eliminarDuplicados<String>(array: string[]) {
    return array.filter((item, index) => array.indexOf(item) === index);
}

const Menues: React.FC = () => {
    const [modulos, setModulos] = useState<string[]>([]);
    const router = useRouter()

    const getModulos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {

                const response = await fetch(`${apiURL}/private/configuracion/rutas`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    let fichas: Ruta[] = data.data;
                    const modulos = fichas.map((item: Ruta) => (
                        item.modulo_id.charAt(0).toUpperCase() + item.modulo_id.slice(1)
                    ));
                    const modulosFiltrados: string[] = eliminarDuplicados(modulos);
                    
                    setModulos(modulosFiltrados.slice().reverse());
                } else {
                    console.error('Failed to fetch data');
                    if(response.statusText == 'Unauthorized') router.replace('/');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        getModulos();
    }, []);

    return (
        modulos.map((item, index) => (
            <li key={index}>
                <Link href="/services">
                    <p>{item}</p>
                </Link>
            </li>
        ))
    );
};

export default Menues;
