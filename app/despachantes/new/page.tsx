'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Swal from 'sweetalert2';

const NuevoDespachante: React.FC = () => {
    const [nombre, setNombre] = useState('');
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

        const despachante = { nombre };
        console.log(despachante)
        try {
            const response = await fetch(`${apiURL}/private/exportaciones/despachantes`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(despachante),
            });
            if (response.ok) {
                setSuccess('Despachante agregado exitosamente.');
                Swal.fire(
                    'Creado!',
                    'El nuevo despachante ha sido creado.',
                    'success'
                );
                router.push('/despachantes');
            } else if (response.status === 401) {
                setError('No autorizado. Verifica tus credenciales.');
                Swal.fire(
                    'Error!',
                    'No se pudo crear el despachante.',
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
                setError('Error al agregar el despachante.');
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
        <div className="p-8 min-w-96">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Agregar Nuevo Despachante</h1>
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
                <button
                    type="submit"
                    className="btn btn-outline w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-outline w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                    onClick={() => router.push('/despachantes')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default NuevoDespachante;
