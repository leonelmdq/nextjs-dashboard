'use client';

import React, { useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Swal from 'sweetalert2';

interface FormularioFeriadoProps {
    onFeriadoAdded: () => void;
}

const NuevoFeriado: React.FC<FormularioFeriadoProps> = ({ onFeriadoAdded }) => {
    const [fecha, setFecha] = useState('');
    const [motivo, setMotivo] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
            return;
        }

        const feriado = { fecha, motivo };
        try {
            const response = await fetch(`${apiURL}/private/configuracion/feriados`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feriado),
            });
            if (response.ok) {
                Swal.fire(
                    'Creado!',
                    'El nuevo feriado ha sido creado.',
                    'success'
                );
                setFecha('');
                setMotivo('');
                onFeriadoAdded();
            } else if (response.status === 401) {
                setError('No autorizado. Verifica tus credenciales.');
                Swal.fire(
                    'Error!',
                    'No se pudo crear el feriado.',
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
                setError('Error al agregar el feriado.');
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
        <div className="">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Agregar Nuevo Feriado</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <div className="mb-2">
                    <label htmlFor="fecha" className="block text-sm font-medium text-white-700">Fecha</label>
                    <input
                        type="date"
                        id="fecha"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="motivo" className="block text-sm font-medium text-white-700">Motivo</label>
                    <input
                        type="text"
                        id="motivo"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-outline w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition duration-200"
                >
                    Guardar
                </button>
            </form>
        </div>
    );
};

export default NuevoFeriado;
