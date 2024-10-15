'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Presentacion from "@/components/utils/types/presentacion";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Presentaciones: React.FC = () => {
    const [presentaciones, setPresentaciones] = useState<Presentacion[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Presentacion; direction: 'asc' | 'desc' } | null>(null);

    const sortPresentaciones = (presentaciones: Presentacion[]) => {
        if (sortConfig !== null) {
            return [...presentaciones].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return presentaciones;
    };

    const requestSort = (key: keyof Presentacion) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Presentacion) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };

    const getPresentaciones = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/presentaciones`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setPresentaciones(data.data);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const eliminarPresentacion = async (id: number) => {
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
                    const response = await fetch(`${apiURL}/private/exportaciones/presentaciones/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setPresentaciones(presentaciones.filter(presentacion => presentacion.id !== id));
                        Swal.fire(
                            'Eliminado!',
                            'La presentacion ha sido eliminada.',
                            'success'
                        );
                    } else {
                        const data = await response.json();
                        const errors = data.errors
                        Swal.fire(
                            'Error!',
                            `${errors}`,
                            'error'
                        );
                        console.error('Failet to delete presentacion');
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
        getPresentaciones();
    }, []);

    const presentacionesFiltrados = presentaciones.filter(presentacion =>
        Object.values(presentacion).some(val =>
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
            <div className='p-8'>
                <h1 className="text-4xl font-bold text-center text-white mt-8 mb-4">
                    Presentaciones Registradas
                </h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/presentaciones/new')}
                    >
                        Agregar Nueva Presentacion
                    </button>
                </div>
                <input
                    type='text'
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder='Filtro'
                    className='mb-4 p-2 border border-gray-300 rounded'
                />
                <table className='min-w-full rounded-lg bg-sky-600 text-white'>
                    <thead>
                        <tr>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('nombre')}>Nombre {sortConfig?.key === 'nombre' && <FontAwesomeIcon icon={getSortIcon('nombre')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('kilos')}>Kilos{sortConfig?.key === 'kilos' && <FontAwesomeIcon icon={getSortIcon('kilos')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('cantidad_x_pallet')}>Cantidad por Pallet{sortConfig?.key === 'cantidad_x_pallet' && <FontAwesomeIcon icon={getSortIcon('cantidad_x_pallet')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortPresentaciones(presentacionesFiltrados).map((presentacion, index) => (
                            <tr key={presentacion.id} className={`hover:bg-sky-700 ${index === presentacionesFiltrados.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{presentacion.nombre}</td>
                                <td className='py-2 px-4 text-center'>{presentacion.kilos}</td>
                                <td className='py-2 px-4 text-center'>{presentacion.cantidad_x_pallet}</td>
                                <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                    <button
                                        className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2 w-40 flex justify-around"
                                        onClick={() => router.push(`/presentaciones/edit/${presentacion.id}`)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-outline bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 w-40 mt-2 flex justify-around"
                                        onClick={() => eliminarPresentacion(presentacion.id)}
                                    >
                                        Eliminar
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

export default Presentaciones;
