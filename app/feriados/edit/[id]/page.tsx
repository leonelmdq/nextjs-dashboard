'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Feriado from "@/components/utils/types/feriado";
import Swal from 'sweetalert2';

const EditarFeriado: React.FC = () => {
    const [feriado, setFeriado] = useState<Feriado | null>(null);
    const [fecha, setFecha] = useState('');
    const [motivo, setMotivo] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const params = useParams();

    const getFeriado = async (fecha: string) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/configuracion/feriados/${fecha}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const feriado = data.data[0];
                    setFeriado(feriado);
                    setFecha(feriado.fecha);
                    setMotivo(feriado.motivo);
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

        const feriadoActualizado = { fecha, motivo };
        try {
            const response = await fetch(`${apiURL}/private/configuracion/feriados/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feriadoActualizado),
            });
            if (response.ok) {
                setSuccess('Feriado actualizado exitosamente.');
                Swal.fire(
                    'Modificado!',
                    'El feriado ha sido modificado.',
                    'success'
                );
                router.push('/feriados');
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al actualizar el feriado.');
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
        const fecha=params.id.toString()
        if (params.id) {
            getFeriado(fecha);
        }
    }, [fecha]);

    if (!feriado) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-8 min-w-96">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Editar Feriado</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                <div className="mb-4">
                    <label htmlFor="fecha" className="block text-sm font-medium text-white-700">Fecha</label>
                    <input
                        type="text"
                        id="fecha"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
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
                    className="btn btn-outline w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-outline w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                    onClick={() => router.push('/feriados')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarFeriado;
