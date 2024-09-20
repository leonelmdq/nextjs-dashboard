'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Producto from "@/components/utils/types/producto";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Productos: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Producto; direction: 'asc' | 'desc' } | null>(null);

    const sortProductos = (productos: Producto[]) => {
        if (sortConfig !== null) {
            return [...productos].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return productos;
    };
    const requestSort = (key: keyof Producto) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const getSortIcon = (key: keyof Producto) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };
    const getProductos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/productos`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data.data);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const eliminarProducto = async (id: number) => {
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
                    const response = await fetch(`${apiURL}/private/exportaciones/productos/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setProductos(productos.filter(producto => producto.id !== id));
                        Swal.fire(
                            'Eliminado!',
                            'El producto ha sido eliminado.',
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
                        console.error('Failed to delete producto');
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
        getProductos();
    }, []);

    const productosFiltrados = productos.filter(producto =>
        Object.values(producto).some(val =>
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
                    Productos Registrados
                </h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/productos/new')}
                    >
                        Agregar Nuevo Producto
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
                            <th className='py-2 px-4 border-b text-center cursor-pointer' onClick={() => requestSort('nombre_corto')}>Nombre Corto{sortConfig?.key === 'nombre_corto' && <FontAwesomeIcon icon={getSortIcon('nombre_corto')!} className="ml-2" />}</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortProductos(productosFiltrados).map((producto, index) => (
                            <tr key={producto.id} className={`hover:bg-sky-700 ${index === productosFiltrados.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{producto.nombre}</td>
                                <td className='py-2 px-4 text-center'>{producto.nombre_corto}</td>
                                <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                    <button
                                        className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2"
                                        onClick={() => router.push(`/productos/edit/${producto.id}`)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-outline bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 w-40 mt-2 flex justify-around"
                                        onClick={() => eliminarProducto(producto.id)}
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

export default Productos;
