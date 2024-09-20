'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Vehiculo from "@/components/utils/types/vehiculo";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';


const Vehiculos: React.FC = () => {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');

    const getVehiculos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/administracion/vehiculos`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const vehiculos = data.data;
                    setVehiculos(vehiculos);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const eliminarVehiculo = async (id: number) => {
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
                    const response = await fetch(`${apiURL}/private/administracion/vehiculos/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setVehiculos(vehiculos.filter(vehiculo => vehiculo.id !== id));
                        Swal.fire(
                            'Eliminado!',
                            'El vehiculo ha sido eliminado.',
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
                        console.error('Failed to delete vehiculo');
                    }
                }
            } catch (error) {
                console.error('An error occurred:', error);
                Swal.fire(
                    'Error!',
                    'Ocurrió un error.',
                    'error'
                );
            }
        }
    };

    useEffect(() => {
        getVehiculos();
    }, []);

    const vehiculosFiltrados = vehiculos.filter(vehiculo =>
        Object.values(vehiculo).some(val =>
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
                <h1 className='text-4xl font-bold text-center text-white mt-8 mb-4'>Vehiculos Registrados</h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/vehiculos/new')}
                    >
                        Agregar Nuevo Vehiculo
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
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell '>ID</th>
                            <th className='py-2 px-4 border-b text-center'>Nombre</th>
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell'>Tipo</th>
                            <th className='py-2 px-4 border-b text-center'>Dominio</th>
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell'>Legajo</th>
                            <th className='py-2 px-4 border-b text-center '>Asignado a</th>
                            <th className='py-2 px-4 border-b text-center hidden sm:table-cell'>Responsable</th>
                            <th className='py-2 px-4 border-b text-center '>Poliza</th>
                            <th className='py-2 px-4 border-b text-center '>Estado</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehiculosFiltrados.map((vehiculo, index) => (
                            <tr key={vehiculo.id} className={`hover:bg-sky-700 ${index === vehiculosFiltrados.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{vehiculo.id}</td>
                                <td className='py-2 px-4 text-center'>{vehiculo.nombre}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{vehiculo.tipo}</td>
                                <td className='py-2 px-4 text-center'>{vehiculo.dominio}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{vehiculo.legajo}</td>
                                <td className='py-2 px-4 text-center'>{vehiculo.asignado}</td>
                                <td className='py-2 px-4 text-center hidden sm:table-cell'>{vehiculo.responsable}</td>
                                <td className='py-2 px-4 text-center'>{vehiculo.poliza}</td>
                                <td className='py-2 px-4 text-center'>{vehiculo.estado}</td>
                                <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                    <button
                                        className="btn btn-outline w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2 flex justify-around"
                                        onClick={() => router.push(`/vehiculos/edit/${vehiculo.id}`)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-outline w-40 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 flex justify-around"
                                        onClick={() => eliminarVehiculo(vehiculo.id)}
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

export default Vehiculos;
