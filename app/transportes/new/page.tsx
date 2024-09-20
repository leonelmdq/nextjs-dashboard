'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Swal from 'sweetalert2';

const NuevoTransporte: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [ata, setAta] = useState(false);
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

        const transporte = { nombre, domicilio, localidad, codigo_postal:codigoPostal, ata };
        try {
            const response = await fetch(`${apiURL}/private/exportaciones/transport`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transporte),
            });
            if (response.ok) {
                Swal.fire(
                    'Creado!',
                    'El nuevo transporte ha sido creado.',
                    'success'
                );
                setSuccess('Transporte agregado exitosamente.');

                router.push('/transportes'); // Redirige a la página principal después de guardar
            } else if (response.status === 401) {
                Swal.fire(
                    'Error!',
                    'No se pudo crear el transporte.',
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
                setError('Error al agregar el transporte.');
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

    const toggleSwitch = () => {
        setAta(!ata);
    };

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Agregar Nuevo Transporte</h1>
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
                <div className="mb-4">
                    <label htmlFor="domicilio" className="block text-sm font-medium text-white-700">Domicilio</label>
                    <input
                        type="text"
                        id="domicilio"
                        value={domicilio}
                        onChange={(e) => setDomicilio(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="codigo_postal" className="block text-sm font-medium text-white-700">Codigo Postal</label>
                    <input
                        type="text"
                        id="codigo_postal"
                        value={codigoPostal}
                        onChange={(e) => setCodigoPostal(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className='pb-4'>
                    <label htmlFor="ata" className="block py-1 text-sm font-medium text-white-700">Ata</label>
                    <button
                        id='ata'
                        type="button"
                        onClick={toggleSwitch}
                        className={`text-black w-12 h-6 rounded-full p-1 transition-colors ${ata ? 'bg-sky-800' : 'bg-gray-300'
                            }`}
                    >
                        <div
                            className={`text-black w-4 h-4 rounded-full bg-white transition-transform transform ${ata ? 'translate-x-6' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-outline text-black w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-outline text-black w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                    onClick={() => router.push('/transportes')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default NuevoTransporte;
