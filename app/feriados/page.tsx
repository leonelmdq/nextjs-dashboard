'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Feriado from "@/components/utils/types/feriado";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import moment from 'moment';
import NuevoFeriado from './new/page';
import {
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const Feriados: React.FC = () => {
    const [feriados, setFeriados] = useState<Feriado[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Feriado; direction: 'asc' | 'desc' } | null>(null);

    const sortFeriados = (feriados: Feriado[]) => {
        if (sortConfig !== null) {
            return [...feriados].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return feriados;
    };

    const requestSort = (key: keyof Feriado) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Feriado) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };

    const getFeriados = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/configuracion/feriados`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFeriados(data.data);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const eliminarFeriado = async (fecha: string) => {
        const fechaFixed = moment(fecha).format('YYYY-MM-DD')
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminara permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            try {
                const token = sessionStorage.getItem('token');
                if (token) {
                    const response = await fetch(`${apiURL}/private/configuracion/feriados/${fechaFixed}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setFeriados(feriados.filter(feriado => feriado.fecha !== fecha));
                        Swal.fire(
                            'Eliminado!',
                            'El feriado ha sido eliminado.',
                            'success' 
                        );
                    } else {
                        const data = await response.json();
                        const errors = data.errors
                        console.log(errors);
                        Swal.fire(
                            'Error!',
                            `${errors}`,
                            'error'
                        );
                        console.error('Failed to delete feriado');
                    }
                }
            } catch (error) {
                Swal.fire(
                    'Error!',
                    'Ocurrió un error.',
                    'error'
                );
                console.error('An error occurred:', error);
            }
        }
    };

    useEffect(() => {
        getFeriados();
    }, []);

    const feriadosFiltrados = feriados.filter(feriado =>
        Object.values(feriado).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(filtro.toLowerCase())
        )
    );

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
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
            <div className="p-2 pl-8">
                <h1 className="text-4xl font-bold text-center text-white mt-8 mb-4">
                    Feriados Registrados
                </h1>
                <div className='py-8 visible sm:hidden'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/novedadAusentismo/new')}
                    >
                        Agregar Nuevo Feriado
                    </button>
                </div>
                <input
                    type="text"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Filtro"
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-70 rounded-lg bg-sky-600 text-white text-sm">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-center cursor-pointer" onClick={() => requestSort('fecha')}>
                                        Fecha {sortConfig?.key === 'fecha' && <FontAwesomeIcon icon={getSortIcon('fecha')!} className="ml-2" />}
                                    </th>
                                    <th className="py-2 px-4 border-b text-center cursor-pointer" onClick={() => requestSort('motivo')}>
                                        Motivo {sortConfig?.key === 'motivo' && <FontAwesomeIcon icon={getSortIcon('motivo')!} className="ml-2" />}
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortFeriados(feriadosFiltrados).map((feriado, index) => (
                                    <tr key={feriado.fecha} className={`hover:bg-sky-700 ${index === feriadosFiltrados.length - 1 ? '' : 'border-b'}`}>
                                        <td className="py-2 px-4 text-center">{feriado.fecha}</td>
                                        <td className="text-center">{feriado.motivo}</td>
                                        <td className="py-2 px-4 text-center flex items-center flex-row">
                                            <button
                                                className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2 w-10 h-5"
                                                onClick={() => router.push(`/feriados/edit/${feriado.fecha}`)}
                                                title="Modificar"
                                            >
                                                <PencilIcon className="w-6 md:w-8" />
                                            </button>
                                            <button
                                                className="btn btn-outline bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 w-10 flex justify-around"
                                                onClick={() => eliminarFeriado(feriado.fecha)}
                                                title="Eliminar"
                                            >
                                                <TrashIcon className="w-6 md:w-8" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex rounded-lg hidden sm:inline">
                        <NuevoFeriado onFeriadoAdded={getFeriados} />
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Feriados;
