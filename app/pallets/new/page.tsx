'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Swal from 'sweetalert2';

const NuevoPallet: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [certificado, setCertificado] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');
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

        const pallet = {nombre, certificado , fecha_vencimiento: fechaVencimiento};

        try {
            const response = await fetch(`${apiURL}/private/exportaciones/pallets`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pallet),
            });
            if (response.ok) {
                Swal.fire(
                    'Creado!',
                    'El nuevo pallet ha sido creado.',
                    'success'
                );
                setSuccess('Pallet agregado exitosamente.');

                router.push('/pallets');
            } else if (response.status === 401) {
                Swal.fire(
                    'Error!',
                    'No se pudo crear el pallet.',
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
                setError('Error al agregar el pallet.');
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

    return (
        <div className="p-8 min-w-96">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Agregar Nuevo Pallet</h1>
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
                    <label htmlFor="certificado" className="block text-sm font-medium text-white-700">Certificado</label>
                    <input
                        type="text"
                        id="certificado"
                        value={certificado}
                        onChange={(e) => setCertificado(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-white-700">Fecha Vencimiento</label>
                    <input
                        type="text"
                        id="fechaVencimiento"
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.target.value)}
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
                    onClick={() => router.push('/pallets')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default NuevoPallet;
