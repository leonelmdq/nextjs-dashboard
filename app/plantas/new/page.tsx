'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Swal from 'sweetalert2';

const NuevaPlanta: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [nombreCorto, setNombreCorto] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
            return;
        }
        const planta = { nombre, nombre_corto: nombreCorto, localidad};
        console.log(planta)
        try {
            const response = await fetch(`${apiURL}/private/exportaciones/plantas`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(planta),
            });
            if (response.ok) {
                setSuccess('Planta agregada exitosamente.');
                Swal.fire(
                    'Creado!',
                    'La nueva planta ha sido creado.',
                    'success'
                );
                router.push('/plantas');
            } else if (response.status === 401) {
                setError('No autorizado. Verifica tus credenciales.');
                Swal.fire(
                    'Error!',
                    'No se pudo crear la planta.',
                    'error'
                );
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al agregar la planta.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            Swal.fire(
                'Error!',
                'Ocurrió un error.',
                'error'
            );
            setError('Ocurrió un error. Por favor, intenta nuevamente.');
        }
    };

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Agregar Nueva Planta</h1>
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

export default NuevaPlanta;
