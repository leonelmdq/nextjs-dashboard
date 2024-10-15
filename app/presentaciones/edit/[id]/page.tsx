'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Presentacion from "@/components/utils/types/presentacion";
import Swal from 'sweetalert2';

const EditarPresentacion: React.FC = () => {
    const [presentacion, setPresentacion] = useState<Presentacion | null>(null);
    const [nombre, setNombre] = useState('');
    const [kilos, setKilos] = useState('');
    const [cantidadPallet, setCantidadPallet] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const params = useParams();

    const getPresentacion = async (id: number) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/presentaciones/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const presentacion = data.data[0];
                    setPresentacion(presentacion);
                    setNombre(presentacion.nombre);
                    setKilos(presentacion.kilos);
                    setCantidadPallet(presentacion.cantidad_x_pallet);
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
        const presentacionActualizada = { nombre, kilos, cantidad_x_pallet: cantidadPallet };
        try {
            const response = await fetch(`${apiURL}/private/exportaciones/presentaciones/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(presentacionActualizada),
            });
            if (response.ok) {
                setSuccess('Presentacion actualizada exitosamente.');
                Swal.fire(
                    'Modificado!',
                    'La presentacion ha sido modificada.',
                    'success'
                );
                router.push('/presentaciones');
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al actualizar la presentacion.');
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
            getPresentacion(Number(params.id));
        }
    }, [params.id]);

    if (!presentacion) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-8 min-w-96">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Editar Presentacion</h1>
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
                    <label htmlFor="kilos" className="block text-sm font-medium text-white-700">Kilos</label>
                    <input
                        type="text"
                        id="kilos"
                        value={kilos}
                        onChange={(e) => setKilos(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="cantidadPallet" className="block text-sm font-medium text-white-700">Cantidad Pallet</label>
                    <input
                        type="text"
                        id="cantidadPallet"
                        value={cantidadPallet}
                        onChange={(e) => setCantidadPallet(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-white-300 rounded"
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
                    onClick={() => router.push('/presentaciones')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarPresentacion;
