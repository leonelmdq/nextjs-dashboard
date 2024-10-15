'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import NovedadAusentismo from "@/components/utils/types/novedadAusentismo";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const NovedadesAusentismos: React.FC = () => {
    const [novedades, setNovedades] = useState<NovedadAusentismo[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof NovedadAusentismo; direction: 'asc' | 'desc' } | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);

    const sortNovedades = (novedades: NovedadAusentismo[]) => {
        if (sortConfig !== null) {
            return [...novedades].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return novedades;
    };

    const requestSort = (key: keyof NovedadAusentismo) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof NovedadAusentismo) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };

    const getNovedades = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/rrhh/novedades_ausentismo`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setNovedades(data.data);
                    if (cargando) setCargando(!cargando);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const eliminarNovedades = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminara permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminarlo!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const token = sessionStorage.getItem('token');
                if (token) {
                    const response = await fetch(`${apiURL}/private/rrhh/novedades_ausentismo/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setNovedades(novedades.filter(novedad => novedad.id !== id));
                        Swal.fire(
                            'Eliminada!',
                            'La novedad ha sido eliminada.',
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
                        console.error('Failed to delete novedad');
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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        getNovedades();
    }, []);

    const novedadesFiltradas = novedades.filter(novedad =>
        Object.values(novedad).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(filtro.toLowerCase())
        )
    );

    return (
        <div>
            <button
                className="fixed bottom-4 right-4 bg-blue-300 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                onClick={scrollToTop}
            >
                ↑
            </button>
            <Navbar />
            <div className='p-8'>
                <h1 className="text-4xl font-bold text-center text-white mt-8 mb-4">
                    Novedades Ausentismo Registrado
                </h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/novedadAusentismo/new')}
                    >
                        Agregar Nueva Novedad
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
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden xl:table-cell' onClick={() => requestSort('fecha_evento')}>Fecha{sortConfig?.key === 'fecha_evento' && <FontAwesomeIcon icon={getSortIcon('fecha_evento')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden lg:table-cell' onClick={() => requestSort('legajo_id')}>Legajo{sortConfig?.key === 'legajo_id' && <FontAwesomeIcon icon={getSortIcon('legajo_id')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('legajo_id')}>Empleado{sortConfig?.key === 'legajo_id' && <FontAwesomeIcon icon={getSortIcon('legajo_id')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden lg:table-cell' onClick={() => requestSort('ausentismo')}>Motivo{sortConfig?.key === 'ausentismo' && <FontAwesomeIcon icon={getSortIcon('ausentismo')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden xl:table-cell' onClick={() => requestSort('diagnostico')}>Diagnostico{sortConfig?.key === 'diagnostico' && <FontAwesomeIcon icon={getSortIcon('diagnostico')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('fecha_inicio')}>Ausente{sortConfig?.key === 'fecha_inicio' && <FontAwesomeIcon icon={getSortIcon('fecha_inicio')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden xl:table-cell' onClick={() => requestSort('dias_ausente')}>Cant Dias{sortConfig?.key === 'dias_ausente' && <FontAwesomeIcon icon={getSortIcon('dias_ausente')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    {cargando ?
                        <tbody>
                            <tr>
                                <td colSpan={10} className="text-center py-20">
                                    <div className="flex justify-center items-center">
                                        <span className="loading loading-spinner loading-2xl"></span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        :
                        <tbody>
                            {sortNovedades(novedadesFiltradas).map((novedad, index) => (
                                <tr key={novedad.id} className={`hover:bg-sky-700 ${index === novedadesFiltradas.length - 1 ? '' : 'border-b'}`}>
                                    <td className='py-2 px-4 text-center hidden xl:table-cell'>{novedad.fecha_evento}</td>
                                    <td className='py-2 px-4 text-center hidden lg:table-cell'>{novedad.legajo_id}</td>
                                    <td className='py-2 px-4 text-center'>{novedad.legajo.apellido} {novedad.legajo.nombre}</td>
                                    <td className='py-2 px-4 text-center hidden lg:table-cell'>{novedad.ausentismo.motivo}</td>
                                    <td className='py-2 px-4 text-center hidden xl:table-cell'>{novedad.diagnostico}</td>
                                    <td className='py-2 px-4 text-center'>del {novedad.fecha_inicio} al {novedad.fecha_fin}</td>
                                    <td className='py-2 px-4 text-center hidden xl:table-cell'>{novedad.dias_ausente}</td>
                                    <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                        <button
                                            className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2 w-40 flex justify-around"
                                            onClick={() => router.push(`/novedadAusentismo/edit/${novedad.id}`)}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            className="btn btn-outline w-40 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 flex justify-around"
                                            onClick={() => eliminarNovedades(novedad.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    );
};

export default NovedadesAusentismos;
