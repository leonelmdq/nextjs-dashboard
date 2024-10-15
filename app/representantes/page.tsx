'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import { useRouter } from 'next/navigation';
import Representante from "@/components/utils/types/representante";
import Swal from 'sweetalert2';

const Representantes: React.FC = () => {
    const [representantes, setRepresentantes] = useState<Representante[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const getRepresentantes = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/representantes`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const representantes = data.data;
                    setRepresentantes(representantes);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    const eliminarRepresentante = async (id: number) => {
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
                    const response = await fetch(`${apiURL}/private/exportaciones/representantes/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        Swal.fire(
                            'Eliminado!',
                            'El cliente ha sido eliminado.',
                            'success'
                        );
                        setRepresentantes(representantes.filter(representante => representante.id !== id));
                    } else {
                        const data = await response.json();
                        const errors = data.errors
                        Swal.fire(
                            'Error!',
                            `${errors}`,
                            'error'
                        );
                        console.error('Failed to delete representante');
                    }
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }

    };

    useEffect(() => {
        getRepresentantes();
    }, []);
    const representantesFiltrados = representantes.filter(representante =>
        Object.values(representante).some(val =>
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
                <h1 className='text-4xl font-bold text-center text-white mt-8 mb-4'>Representantes Registrados</h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/representantes/new')}
                    >
                        Agregar Nuevo Representantes
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
                            <th className='py-2 px-4 border-b text-center'>Nombre</th>
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell'>Nombre Completo</th>
                            <th className='py-2 px-4 border-b text-center'>Domicilio</th>
                            <th className='py-2 px-4 border-b text-center hidden sm:table-cell'>Cuit</th>
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell'>Teléfono</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {representantesFiltrados.map((representante, index) => (
                            <tr key={representante.id} className={`hover:bg-sky-700 ${index === representantesFiltrados.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{representante.nombre}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{representante.nombre_completo}</td>
                                <td className='py-2 px-4 text-center'>{representante.domicilio}</td>
                                <td className='py-2 px-4 text-center hidden sm:table-cell'>{representante.cuit}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{representante.telefono}</td>
                                <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                    <button
                                        className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 w-40 mr-2 flex justify-around"
                                        onClick={() => router.push(`/representantes/edit/${representante.id}`)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-outline w-40 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 flex justify-around"
                                        onClick={() => eliminarRepresentante(representante.id)}
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

export default Representantes;
