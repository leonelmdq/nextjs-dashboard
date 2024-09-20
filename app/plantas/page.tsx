'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Planta from "@/components/utils/types/planta";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';


const Plantas: React.FC = () => {
    const [plantas, setPlantas] = useState<Planta[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');

    const getPlantas = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/plantas`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const plantas = data.data;
                    setPlantas(plantas);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const eliminarPlanta = async (id: number) => {
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
                    const response = await fetch(`${apiURL}/private/exportaciones/plantas/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setPlantas(plantas.filter(planta => planta.id !== id));
                        Swal.fire(
                            'Eliminado!',
                            'La planta ha sido eliminada.',
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
                        console.error('Failed to delete planta');
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
        getPlantas();
    }, []);

    const plantasFiltrados = plantas.filter(planta =>
        Object.values(planta).some(val =>
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
                <h1 className='text-4xl font-bold text-center text-white mt-8 mb-4'>Plantas Registradas</h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/plantas/new')}
                    >
                        Agregar Nueva Planta
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
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell'>ID</th>
                            <th className='py-2 px-4 border-b text-center'>Nombre</th>
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell'>Nombre Corto</th>
                            <th className='py-2 px-4 border-b text-center'>Localidad</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plantasFiltrados.map((planta, index) => (
                            <tr key={planta.id} className={`hover:bg-sky-700 ${index === plantasFiltrados.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{planta.id}</td>
                                <td className='py-2 px-4 text-center'>{planta.nombre}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{planta.nombre_corto}</td>
                                <td className='py-2 px-4 text-center'>{planta.localidad}</td>
                                <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                    <button
                                        className="btn btn-outline w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2 flex justify-around"
                                        onClick={() => router.push(`/plantas/edit/${planta.id}`)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-outline w-40 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 flex justify-around"
                                        onClick={() => eliminarPlanta(planta.id)}
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

export default Plantas;
