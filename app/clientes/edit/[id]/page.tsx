'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Cliente from "@/components/utils/types/cliente";
import Representante from "@/components/utils/types/representante";
import Swal from 'sweetalert2';

const EditarCliente: React.FC = () => {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [nombre, setNombre] = useState('');
    const [nombreFantasia, setNombreFantasia] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [pais, setPais] = useState('');
    const [representanteId, setRepresentanteId] = useState<number | "">("");
    const [representantes, setRepresentantes] = useState<Representante[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const params = useParams();

    const getCliente = async (id: number) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/clientes/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const cliente = data.data[0];
                    setCliente(cliente);
                    setNombre(cliente.nombre);
                    setNombreFantasia(cliente.nombre_fantasia);
                    setRazonSocial(cliente.razon_social);
                    setDomicilio(cliente.domicilio);
                    setLocalidad(cliente.localidad);
                    setCodigoPostal(cliente.codigo_postal);
                    setPais(cliente.pais);
                    setRepresentanteId(data.data[0].representante_id);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
            return;
        }

        const clienteActualizado = { nombre,nombre_fantasia: nombreFantasia, razon_social: razonSocial, domicilio, localidad, codigo_postal: codigoPostal, pais, representante_id:representanteId };

        try {
            const response = await fetch(`${apiURL}/private/exportaciones/clientes/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteActualizado),
            });

            if (response.ok) {
                setSuccess('Cliente actualizado exitosamente.');
                Swal.fire(
                    'Modificado!',
                    'El cliente ha sido modificado.',
                    'success'
                );
                router.push('/clientes');
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al actualizar el cliente.');
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
            getCliente(Number(params.id));
            getRepresentantes();
        }
    }, [params.id]);

    if (!cliente) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-8 min-w-96">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Editar Cliente</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="nombreFantasia" className="block text-sm font-medium text-gray-700">Nombre Fantasia</label>
                    <input
                        type="text"
                        id="nombreFantasia"
                        value={nombreFantasia}
                        onChange={(e) => setNombreFantasia(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700">Razon Social</label>
                    <input
                        type="text"
                        id="razonSocial"
                        value={razonSocial}
                        onChange={(e) => setRazonSocial(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="domicilio" className="block text-sm font-medium text-gray-700">Domicilio</label>
                    <input
                        type="text"
                        id="domicilio"
                        value={domicilio}
                        onChange={(e) => setDomicilio(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="localidad" className="block text-sm font-medium text-gray-700">Localidad</label>
                    <input
                        type="text"
                        id="localidad"
                        value={localidad}
                        onChange={(e) => setLocalidad(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700">Codigo Postal</label>
                    <input
                        type="text"
                        id="codigoPostal"
                        value={codigoPostal}
                        onChange={(e) => setCodigoPostal(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="pais" className="block text-sm font-medium text-gray-700">Pais</label>
                    <input
                        type="text"
                        id="pais"
                        value={pais}
                        onChange={(e) => setPais(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="representante" className="block text-sm font-medium text-gray-700">Representante</label>
                    <select
                        id="representante"
                        value={representanteId}
                        onChange={(e) => setRepresentanteId(Number(e.target.value))}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        {representantes.map((rep) => (
                            <option key={rep.id} value={rep.id}>
                                {rep.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Guardar
                </button>
                <button
                    type="button"
                    className="w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                    onClick={() => router.push('/clientes')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarCliente;
