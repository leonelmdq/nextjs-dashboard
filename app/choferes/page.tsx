'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import { useRouter } from 'next/navigation';
import Chofer from "@/components/utils/types/chofer";
import Swal from 'sweetalert2';


const Choferes: React.FC = () => {
    const [choferes, setChoferes] = useState<Chofer[]>([]);
    const router = useRouter();
    const [filtro, setFiltro] = useState<string>('');
    const getChoferes = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/choferes`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const choferes = data.data;
                    setChoferes(choferes);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    const eliminarChofer = async (id: number) => {
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
                    const response = await fetch(`${apiURL}/private/exportaciones/choferes/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        setChoferes(choferes.filter(chofer => chofer.id !== id));
                        Swal.fire(
                            'Eliminado!',
                            'El camion ha sido eliminado.',
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
                        console.error('Failed to delete chofer');
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
        getChoferes();
    }, []);
    const choferesFiltrados = choferes.filter(chofer =>
        Object.values(chofer).some(val =>
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
                <h1 className='text-3xl'>Choferes Registrados</h1>
                <div className='py-8'>
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push('/choferes/new')}
                    >
                        Agregar Nuevo Chofer
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
                            <th className='py-2 px-4 border-b text-center'>Apellido</th>
                            <th className='py-2 px-4 border-b text-center hidden lg:table-cell'>DNI</th>
                            <th className='py-2 px-4 border-b text-center '>Teléfono</th>
                            <th className='py-2 px-4 border-b text-center'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {choferesFiltrados.map((chofer,index) => (
                                <tr key={chofer.id} className={`hover:bg-sky-700 ${index === choferesFiltrados.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{chofer.nombre}</td>
                                <td className='py-2 px-4 text-center'>{chofer.apellido}</td>
                                <td className='py-2 px-4 text-center hidden lg:table-cell'>{chofer.dni}</td>
                                <td className='py-2 px-4 text-center'>{chofer.telefono}</td>
                                <td className='py-2 px-4 text-center flex justify-center items-center flex-col'>
                                    <button
                                        className="btn btn-outline bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 mr-2"
                                        onClick={() => router.push(`/choferes/edit/${chofer.id}`)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-outline w-40 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-2 mr-2 flex justify-around"
                                        onClick={() => eliminarChofer(chofer.id)}
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

export default Choferes;
