'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Representante from "@/components/utils/types/representante";
import Swal from 'sweetalert2';


const EditarRepresentante: React.FC = () => {
    const [representante, setRepresentante] = useState<Representante | null>(null);
    const [nombre, setNombre] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [cuit, setCuit] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const params = useParams();

    const getRepresentante = async (id: number) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/representantes/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const representante = data.data[0];
                    setRepresentante(representante);
                    setNombre(representante.nombre ?? '');
                    setNombreCompleto(representante.nombre_completo ?? '');
                    setTelefono(representante.telefono ?? '');
                    setDomicilio(representante.domicilio ?? '');
                    setCuit(representante.cuit ?? '');
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

        const representanteActualizado = { nombre, nombre_completo: nombreCompleto, telefono, cuit, domicilio };

        try {
            const response = await fetch(`${apiURL}/private/exportaciones/representantes/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(representanteActualizado),
            });

            if (response.ok) {
                setSuccess('Representante actualizado exitosamente.');
                Swal.fire(
                    'Modificado!',
                    'El cliente ha sido modificado.',
                    'success'
                );
                router.push('/representantes');
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al actualizar el representante.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setError('Ocurrió un error. Por favor, intenta nuevamente.');
        }
    };

    useEffect(() => {
        if (params.id) {
            getRepresentante(Number(params.id));
        }
    }, [params.id]);

    if (!representante) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className=" text-xl font-semibold mb-4">Editar Representante</h1>
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
                    <label htmlFor="nombreCompleto" className="block text-sm font-medium text-white-700">Nombre Completo</label>
                    <input
                        type="text"
                        id="nombreCompleto"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
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
                    <label htmlFor="cuit" className="block text-sm font-medium text-white-700">Cuit</label>
                    <input
                        type="text"
                        id="cuit"
                        value={cuit}
                        onChange={(e) => setCuit(e.target.value)}
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
                    onClick={() => router.push('/representantes')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarRepresentante;
