'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Camion from "@/components/utils/types/camion";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Camiones: React.FC = () => {
    const [camiones, setCamiones] = useState<Camion[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Camion; direction: 'asc' | 'desc' } | null>(null);

    const sortCamiones = (camiones: Camion[]) => {
        if (sortConfig !== null) {
            return [...camiones].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return camiones;
    };
    const requestSort = (key: keyof Camion) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Camion) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };
    
    const getCamiones = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/camiones`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCamiones(data.data);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const eliminarCamion = async (id: number) => {
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
                    const response = await fetch(`${apiURL}/private/exportaciones/camiones/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setCamiones(camiones.filter(camion => camion.id !== id));
                        Swal.fire(
                            'Eliminado!',
                            'El camion ha sido eliminado.',
                            'success'
                        );
                    } else {
                        const data = await response.json();
                        const errors=data.errors
                        Swal.fire(
                            'Error!',
                            `${errors}`,
                            'error'
                        );
                        console.error('Failed to delete camion');
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
        getCamiones();
    }, []);

    const camionesFiltrados = camiones.filter(camion =>
        Object.values(camion).some(val =>
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
        <div>
            <button
                className="fixed bottom-4 right-4 bg-blue-300 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                onClick={scrollToTop}
            >
                ↑
            </button>
            <Navbar />
            <div className='p-8'>
                <h1 className="text-4xl font-bold text-center text-black-600 mt-8 mb-4">
                    Camiones Registrados
                </h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/camiones/new')}
                    >
                        Agregar Nuevo Camion
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
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('marca')}>Marca {sortConfig?.key === 'marca' && <FontAwesomeIcon icon={getSortIcon('marca')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('patente')}>Patente{sortConfig?.key === 'patente' && <FontAwesomeIcon icon={getSortIcon('patente')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('marca_semi')}>Marca Semi{sortConfig?.key === 'marca_semi' && <FontAwesomeIcon icon={getSortIcon('marca_semi')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden lg:table-cell' onClick={() => requestSort('patente_semi')}>Patente Semi{sortConfig?.key === 'patente_semi' && <FontAwesomeIcon icon={getSortIcon('patente_semi')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center hidden xl:table-cell'>Acoplado</th>
                            <th className='py-2 px-4 border-b text-center '>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortCamiones(camionesFiltrados).map((camion,index) => (
                            <tr key={camion.id} className={`hover:bg-sky-700 ${index === camionesFiltrados.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{camion.marca}</td>
                                <td className='py-2 px-4 text-center'>{camion.patente}</td>
                                <td className='py-2 px-4 text-center'>{camion.marca_semi}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{camion.patente_semi}</td>
                                <td className='py-2 px-4 text-center hidden xl:table-cell'>{camion.acoplado? 'SI' : 'NO'}</td>
                                <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                    <button
                                        className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2 flex justify-around"
                                        onClick={() => router.push(`/camiones/edit/${camion.id}`)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-outline w-40 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 flex justify-around"
                                        onClick={() => eliminarCamion(camion.id)}
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

export default Camiones;
