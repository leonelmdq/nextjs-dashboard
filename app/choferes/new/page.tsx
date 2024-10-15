// pages/nuevo-chofer.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Swal from 'sweetalert2';

const NuevoChofer: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [dni, setDni] = useState('');
    const [telefono, setTelefono] = useState('');
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

        const chofer = { nombre, apellido, dni, telefono };

        try {
            const response = await fetch(`${apiURL}/private/exportaciones/choferes`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chofer),
            });
            if (response.ok) {
                setSuccess('Chofer agregado exitosamente.');
                Swal.fire(
                    'Creado!',
                    'El nuevo chofer ha sido creado.',
                    'success'
                );
                router.push('/choferes'); // Redirige a la página principal después de guardar
            } else if (response.status === 401) {
                Swal.fire(
                    'Error!',
                    'No se pudo crear el chofer.',
                    'error'
                );
                setError('No autorizado. Verifica tus credenciales.');
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al agregar el chofer.');
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
                <h1 className="text-xl font-semibold mb-4">Agregar Nuevo Chofer</h1>
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
                    <label htmlFor="apellido" className="block text-sm font-medium text-white-700">Apellido</label>
                    <input
                        type="text"
                        id="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="dni" className="block text-sm font-medium text-white-700">DNI</label>
                    <input
                        type="text"
                        id="dni"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="telefono" className="block text-sm font-medium text-white-700">Teléfono</label>
                    <input
                        type="text"
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
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
                    onClick={() => router.push('/choferes')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default NuevoChofer;
