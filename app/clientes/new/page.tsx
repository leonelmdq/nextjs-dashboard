'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Representante from "@/components/utils/types/representante";
import Swal from 'sweetalert2';

const NuevoCliente: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [nombreFantasia, setNombreFantasia] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [pais, setPais] = useState('');
    const [representantes, setRepresentantes] = useState<Representante[]>([]);
    const [representanteId, setRepresentanteId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const getRepresentantes = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/representantes`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setRepresentantes(data.data);
                } else {
                    console.error('Failed to fetch representantes');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        getRepresentantes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');


        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
            return;
        }

        const cliente = { nombre, nombre_fantasia: nombreFantasia,razon_social: razonSocial, domicilio, localidad, codigo_postal: codigoPostal, pais, representante_id: representanteId };
        console.log(cliente)
        try {
            const response = await fetch(`${apiURL}/private/exportaciones/clientes`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente),
            });
            if (response.ok) {
                setSuccess('Cliente agregado exitosamente.');
                Swal.fire(
                    'Creado!',
                    'El nuevo cliente ha sido creado.',
                    'success'
                );
                router.push('/clientes');
            } else if (response.status === 401) {
                setError('No autorizado. Verifica tus credenciales.');
                Swal.fire(
                    'Error!',
                    'No se pudo crear el cliente.',
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
                setError('Error al agregar el cliente.');
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
                <h1 className="text-xl font-semibold mb-4">Agregar Nuevo Cliente</h1>
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
                    <label htmlFor="nombreFantasia" className="block text-sm font-medium text-white-700">Nombre Fanstasia</label>
                    <input
                        type="text"
                        id="nombre_fantasia"
                        value={nombreFantasia}
                        onChange={(e) => setNombreFantasia(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="razon_social" className="block text-sm font-medium text-white-700">Razon Social</label>
                    <input
                        type="text"
                        id="razon_social"
                        value={razonSocial}
                        onChange={(e) => setRazonSocial(e.target.value)}
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
                <div className="mb-4">
                    <label htmlFor="pais" className="block text-sm font-medium text-white-700">Pais</label>
                    <input
                        type="text"
                        id="pais"
                        value={pais}
                        onChange={(e) => setPais(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="representante" className="block text-sm font-medium text-white-700">Representante</label>
                    <select
                        id="representante"
                        value={representanteId}
                        onChange={(e) => setRepresentanteId(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Seleccionar representante</option>
                        {representantes.map((rep) => (
                            <option key={rep.id} value={rep.id}>
                                {rep.nombre}
                            </option>
                        ))}
                    </select>
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
                    onClick={() => router.push('/clientes')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default NuevoCliente;
