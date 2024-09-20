'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Limpieza from "@/components/utils/types/limpieza";
import moment from 'moment';
import {
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';


const Limpiezas: React.FC = () => {
    const [limpiezas, setLimpiezas] = useState<Limpieza[]>([]);
    const [desde, setDesde] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'));
    const [hasta, setHasta] = useState<string>(moment().endOf('month').format('YYYY-MM-DD'));
    const [fecha, setFecha] = useState('');
    const [precalentador, setPrecalentador] = useState(null);
    const [cortadora, setCortadora] = useState(null);
    const [empaque, setEmpaque] = useState(null);
    const [general, setGeneral] = useState(null);
    const [comentario, setComentario] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const getLimpiezas = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/jaboneria/limpiezas/listado/periodo/desde/${desde}/hasta/${hasta}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const limpiezas = data.data;
                    console.log(limpiezas);
                    setLimpiezas(limpiezas);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleSubmit = async () => {
        getLimpiezas();
    };

    useEffect(() => {
        getLimpiezas();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0, 
            behavior: 'smooth',
        });
    };

    const handleClick = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');


        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
            return;
        }

        const novedadAusentismo = { fecha, precalentador, cortadora, empaque, general, comentario };

        const response = await fetch(`${apiURL}/private/rrhh/novedades_ausentismo`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novedadAusentismo),
        });
    };

    return (
        <div className="overflow-x-auto">
            <button
                className="fixed bottom-4 right-4 bg-blue-300 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                onClick={scrollToTop}
            >
                ↑
            </button>
            <Navbar />
            <div className='p-8'>
                <h1 className="text-4xl font-bold text-center text-white mt-8 mb-4">
                    Registro de Limpiezas
                </h1>
                <div className="flex gap-4 mb-4">
                    <div className="">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="desde">
                            Desde
                        </label>
                        <input
                            type="date"
                            id="desde"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            className="shadow appearance-none border rounded min-w-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="hasta">
                            Hasta
                        </label>
                        <input
                            type="date"
                            id="hasta"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            className="shadow appearance-none border rounded min-w-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                    >
                        Consultar Fichadas
                    </button>
                </div>
                <table className='min-w-full rounded-lg bg-sky-600 text-white'>
                    <thead>
                        <tr>
                            <th className='py-2 px-4 border-b text-center'>Fecha</th>
                            <th className='py-2 px-4 border-b text-center'>Precalentador</th>
                            <th className='py-2 px-4 border-b text-center'>Cortadora</th>
                            <th className='py-2 px-4 border-b text-center'>Empaque</th>
                            <th className='py-2 px-4 border-b text-center'>General</th>
                            <th className='py-2 px-4 border-b text-center'>Comentario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {limpiezas.map((limpieza, index) => (
                            <tr key={limpieza.fecha} className={`hover:bg-sky-700 ${index === limpiezas.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{moment(limpieza.fecha).format('DD-MM-YYYY')}</td>
                                <td className='py-2 px-4 text-center'>{limpieza.comentarios}</td>
                                <td className='py-2 px-4 text-center'>
                                    <button onClick={handleClick} className="bg-green-500 text-white p-1 rounded-full shadow-lg hover:bg-green-700 transition">
                                        <CheckIcon className="w-3" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Limpiezas;
