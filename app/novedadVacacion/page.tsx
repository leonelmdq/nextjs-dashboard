'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import NovedadVacacion from "@/components/utils/types/novedadVacacion";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const NovedadesVacacion: React.FC = () => {
    const [vacaciones, setVacaciones] = useState<NovedadVacacion[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof NovedadVacacion; direction: 'asc' | 'desc' } | null>(null);

    const sortVacacion = (vacacion: NovedadVacacion[]) => {
        if (sortConfig !== null) {
            return [...vacacion].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return vacacion;
    };
    const requestSort = (key: keyof NovedadVacacion) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof NovedadVacacion) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };

    const getVacaciones = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/rrhh/novedades_vacaciones`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setVacaciones(data.data);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const eliminarVacaciones = async (id: number) => {
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
                    const response = await fetch(`${apiURL}/private/rrhh/novedades_vacaciones/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setVacaciones(vacaciones.filter(vacacion => vacacion.id !== id));
                        Swal.fire(
                            'Eliminado!',
                            'La vacacion ha sido eliminado.',
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
                        console.error('Failed to delete vacacion');
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
        getVacaciones();
    }, []);

    const vacacionesFiltradas = vacaciones.filter(novedad =>
        Object.values(novedad).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(filtro.toLowerCase())
        )
    );
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Desplazamiento suave
        });
    };

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
                    Novedades Vacaciones Registrados
                </h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/novedadVacacion/new')}
                    >
                        Agregar Nueva Vacacion
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
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('legajo_id')}>Legajo{sortConfig?.key === 'legajo_id' && <FontAwesomeIcon icon={getSortIcon('legajo_id')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('legajo_id')}>Empleado{sortConfig?.key === 'legajo_id' && <FontAwesomeIcon icon={getSortIcon('legajo_id')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer ' onClick={() => requestSort('fecha_inicio')}>Ausente{sortConfig?.key === 'fecha_inicio' && <FontAwesomeIcon icon={getSortIcon('fecha_inicio')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden sm:table-cell' onClick={() => requestSort('dias_vacaciones')}>Cant Dias{sortConfig?.key === 'dias_vacaciones' && <FontAwesomeIcon icon={getSortIcon('dias_vacaciones')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden xl:table-cell' onClick={() => requestSort('comentarios')}>Comentario{sortConfig?.key === 'comentarios' && <FontAwesomeIcon icon={getSortIcon('comentarios')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortVacacion(vacacionesFiltradas).map((vacacion, index) => (
                            <tr key={vacacion.id} className={`hover:bg-sky-700 ${index === vacacionesFiltradas.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{vacacion.legajo_id}</td>
                                <td className='py-2 px-4 text-center'>{vacacion.legajo.apellido} {vacacion.legajo.nombre}</td>
                                <td className='py-2 px-4 text-center '>del {vacacion.fecha_inicio} al {vacacion.fecha_fin}</td>
                                <td className='py-2 px-4 text-center hidden sm:table-cell'>{vacacion.dias_vacaciones}</td>
                                <td className='py-2 px-4 text-center hidden xl:table-cell'>{vacacion.comentarios}</td>
                                <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                    <button
                                        className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2 w-40 flex justify-around"
                                        onClick={() => router.push(`/novedadVacacion/edit/${vacacion.id}`)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-outline w-40 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 flex justify-around"
                                        onClick={() => eliminarVacaciones(vacacion.id)}
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

export default NovedadesVacacion;
