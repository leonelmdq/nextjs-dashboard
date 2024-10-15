'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Planta from "@/components/utils/types/planta";
import Swal from 'sweetalert2';

const EditarPlanta: React.FC = () => {
    const [planta, setPlanta] = useState<Planta | null>(null);
    const [nombre, setNombre] = useState('');
    const [nombreCorto, setNombreCorto] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const params = useParams();

    const getPlanta = async (id: number) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/plantas/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const planta = data.data[0];
                    setPlanta(planta);
                    setNombre(planta.nombre);
                    setNombreCorto(planta.nombre_corto);
                    setLocalidad(planta.localidad);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
            return;
        }
        const plantaActualizada = { nombre, nombre_corto: nombreCorto, localidad };
        try {
            const response = await fetch(`${apiURL}/private/exportaciones/plantas/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(plantaActualizada),
            });
            if (response.ok) {
                setSuccess('Planta actualizada exitosamente.');
                Swal.fire(
                    'Modificado!',
                    'La planta ha sido modificada.',
                    'success'
                );
                router.push('/plantas');
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al actualizar la planta.');
            }
        } catch (error) {
            Swal.fire(
                'Error!',
                'Ocurrió un error.',
                'error'
            );
            console.error('An error occurred:', error);
            setError('Ocurrió un error. Por favor, intenta nuevamente.');
        }
    };

    useEffect(() => {
        if (params.id) {
            getPlanta(Number(params.id));
        }
    }, [params.id]);

    if (!planta) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-8 min-w-96">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Editar Planta</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-white-700">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="nombreCorto" className="block text-sm font-medium text-white-700">Nombre Corto</label>
                    <input
                        type="text"
                        id="nombreCorto"
                        value={nombreCorto}
                        onChange={(e) => setNombreCorto(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="localidad" className="block text-sm font-medium text-white-700">Localidad</label>
                    <input
                        type="text"
                        id="localidad"
                        value={localidad}
                        onChange={(e) => setLocalidad(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-outline w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-outline w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                    onClick={() => router.push('/plantas')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarPlanta;
