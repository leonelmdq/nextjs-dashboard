'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Legajo from "@/components/utils/types/legajo";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const Legajos: React.FC = () => {
    const [legajos, setLegajos] = useState<Legajo[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Legajo; direction: 'asc' | 'desc' } | null>(null);

    const sortLegajos = (legajos: Legajo[]) => {
        if (sortConfig !== null) {
            return [...legajos].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return legajos;
    };

    const requestSort = (key: keyof Legajo) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Legajo) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };

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
                    setLegajos(data.data);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        getLegajos();
    }, []);

    const legajosFiltrados = legajos.filter(legajo =>
        Object.values(legajo).some(val =>
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
                    Legajos Registrados
                </h1>
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
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('id')}>ID {sortConfig?.key === 'id' && <FontAwesomeIcon icon={getSortIcon('id')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell'>Imagen</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('nombre')}>Nombre {sortConfig?.key === 'nombre' && <FontAwesomeIcon icon={getSortIcon('nombre')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('apellido')}>Apellido{sortConfig?.key === 'apellido' && <FontAwesomeIcon icon={getSortIcon('apellido')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell'>Departamento</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortLegajos(legajosFiltrados).map((legajo, index) => (
                            <tr key={legajo.id} className={`hover:bg-sky-700 ${index === legajosFiltrados.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{legajo.id}</td>
                                <td className='py-2 px-4 text-center align-middle hidden lg:table-cell'>
                                    {legajo.imagen ? (
                                        <img alt='' src={`data:image/jpeg;base64,${legajo.imagen}`} className="w-10 h-10 object-cover mx-auto" />
                                    ) : (
                                        <span className="text-gray-500">-</span>
                                    )}
                                </td>
                                <td className='py-2 px-4 text-center'>{legajo.nombre}</td>
                                <td className='py-2 px-4 text-center'>{legajo.apellido}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{legajo.departamento.nombre}</td>
                                <td className='py-2 px-4 text-center '>
                                    <button
                                        className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2"
                                        onClick={() => router.push(`/legajos/edit/${legajo.id}`)}
                                    >
                                        Modificar
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

export default Legajos;
