'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Cliente from "@/components/utils/types/cliente";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Clientes: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Cliente; direction: 'asc' | 'desc' } | null>(null);

    const sortClientes = (clientes: Cliente[]) => {
        if (sortConfig !== null) {
            return [...clientes].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return clientes;
    };
    const requestSort = (key: keyof Cliente) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const getSortIcon = (key: keyof Cliente) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };
    const getClientes = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/clientes`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setClientes(data.data);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const eliminarCliente = async (id: number) => {
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
                    const response = await fetch(`${apiURL}/private/exportaciones/clientes/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setClientes(clientes.filter(cliente => cliente.id !== id));
                        Swal.fire(
                            'Eliminado!',
                            'El cliente ha sido eliminado.',
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
                        console.error('Failed to delete cliente');
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
        getClientes();
    }, []);

    const clientesFiltrados = clientes.filter(cliente =>
        Object.values(cliente).some(val =>
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
                <h1 className="text-4xl font-bold text-center text-black-600 mt-8 mb-4">
                    Clientes Registrados
                </h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/clientes/new')}
                    >
                        Agregar Nuevo Cliente
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
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('nombre_fantasia')}>Nombre Fantasia{sortConfig?.key === 'nombre_fantasia' && <FontAwesomeIcon icon={getSortIcon('nombre_fantasia')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('razon_social')}>Razon Social{sortConfig?.key === 'razon_social' && <FontAwesomeIcon icon={getSortIcon('razon_social')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden lg:table-cell' onClick={() => requestSort('domicilio')}>Domicilio{sortConfig?.key === 'domicilio' && <FontAwesomeIcon icon={getSortIcon('domicilio')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden xl:table-cell' onClick={() => requestSort('localidad')}>Localidad{sortConfig?.key === 'localidad' && <FontAwesomeIcon icon={getSortIcon('localidad')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden xl:table-cell' onClick={() => requestSort('codigo_postal')}>Codigo Postal{sortConfig?.key === 'codigo_postal' && <FontAwesomeIcon icon={getSortIcon('codigo_postal')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center cursor-pointer hidden lg:table-cell' onClick={() => requestSort('pais')}>Pais{sortConfig?.key === 'pais' && <FontAwesomeIcon icon={getSortIcon('pais')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center'>Representante</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortClientes(clientesFiltrados).map((cliente, index) => (
                            <tr key={cliente.id} className={`hover:bg-sky-700 ${index === clientesFiltrados.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{cliente.nombre}</td>
                                <td className='py-2 px-4 text-center'>{cliente.nombre_fantasia}</td>
                                <td className='py-2 px-4 text-center'>{cliente.razon_social}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{cliente.domicilio}</td>
                                <td className='py-2 px-4 text-center hidden xl:table-cell'>{cliente.localidad}</td>
                                <td className='py-2 px-4 text-center hidden xl:table-cell'>{cliente.codigo_postal}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{cliente.pais}</td>
                                <td className='py-2 px-4 text-center'>{cliente.representante.nombre}</td>
                                <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                    <button
                                        className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2"
                                        onClick={() => router.push(`/clientes/edit/${cliente.id}`)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-outline w-40 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 flex justify-around"
                                        onClick={() => eliminarCliente(cliente.id)}
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

export default Clientes;
