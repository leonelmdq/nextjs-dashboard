'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Pallet from "@/components/utils/types/pallet";
import Swal from 'sweetalert2';


const EditarPallet: React.FC = () => {
    const [pallet, setPallet] = useState<Pallet | null>(null);
    const [nombre, setNombre] = useState('');
    const [certificado, setCertificado] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const params = useParams();

    const getPallet = async (id: number) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/pallets/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const pallet = data.data[0];
                    setPallet(pallet);
                    setNombre(pallet.nombre);
                    setCertificado(pallet.certificado);
                    setFechaVencimiento(pallet.fecha_vencimiento);
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

        const palletActualizado = { nombre, certificado, fecha_vencimiento: fechaVencimiento};

        try {
            const response = await fetch(`${apiURL}/private/exportaciones/pallets/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(palletActualizado),
            });

            if (response.ok) {
                Swal.fire(
                    'Modificado!',
                    'El pallet ha sido modificado.',
                    'success'
                );
                setSuccess('Pallet actualizado exitosamente.');
                router.push('/pallets');
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al actualizar el pallet.');
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
            getPallet(Number(params.id));
        }
    }, [params.id]);

    if (!pallet) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Editar Pallet</h1>
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

export default EditarPallet;
