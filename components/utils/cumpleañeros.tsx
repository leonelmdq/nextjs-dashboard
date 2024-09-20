'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';

// Define la interfaz para los datos de cumpleañeros
interface Cumpleanero {
    nombre: string;
    fecha: string;
}

const Cumpleaneros: React.FC = () => {
    const [cumpleaneros, setCumpleaneros] = useState<Cumpleanero[]>([]);
    let moment = require('moment');
    // Función para verificar si la fecha es hoy
    function esHoy(fechaString: string) {
        let fecha = moment(fechaString, 'YYYY-MM-DD');
        fecha = fecha.format('MM-DD');
        let hoy = moment().startOf('day');
        hoy =hoy.format('MM-DD');
        if(hoy==fecha) return true;
        else return false
    }

    const getLegajos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {

                const response = await fetch(`${apiURL}/private/rrhh/legajos`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const fichas = data.data;
                    const nombres = fichas.map((item: any) => ({
                        nombre: item.nombre + ' ' + item.apellido,
                        fecha: item.ficha?.fecha_nacimiento ?? ''
                    }));
                    const fechasHoy = nombres.filter((item: Cumpleanero) => esHoy(item.fecha));
                    setCumpleaneros(fechasHoy);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
            
        }
    };

    // Llama a getLegajos cuando el componente se monta
    useEffect(() => {
        getLegajos();
    }, []); // [] asegura que el efecto se ejecute solo una vez al montar el componente

    return (
        <div className='p-8'>
            <div className="max-w-md max-h-80 bg-blue-100 p-4 rounded shadow-md text-center flex flex-col justify-center">
                <h1 className="text-lg font-semibold">Cumpleañeros de Hoy:</h1>
                {cumpleaneros.length > 0 ? (
                    cumpleaneros.map((item, index) => (
                        <p key={index} className="text-sm text-gray-600">
                            {item.nombre}
                        </p>
                    ))
                ) : (
                    <p className="text-sm text-gray-600">No hay cumpleañeros hoy.</p>
                )}
            </div>
        </div>
    );
};

export default Cumpleaneros;
