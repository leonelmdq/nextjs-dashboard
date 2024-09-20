// pages/nuevo-chofer.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Swal from 'sweetalert2';

const NuevoVehiculo: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [dominio, setDominio] = useState('');
    const [legajo, setLegajo] = useState('');
    const [propietario, setPropietario] = useState('');
    const [asignado, setAsignado] = useState('');
    const [responsable, setResponsable] = useState('');
    const [poliza, setPoliza] = useState('');
    const [estado, setEstado] = useState('BAJA');
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

        const vehiculo = { nombre, tipo, dominio, legajo, propietario, asignado, responsable, poliza, estado };

        try {
            const response = await fetch(`${apiURL}/private/administracion/vehiculos`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehiculo),
            });
            if (response.ok) {
                setSuccess('Vehiculo agregado exitosamente.');
                Swal.fire(
                    'Creado!',
                    'El nuevo vehiculo ha sido creado.',
                    'success'
                );
                router.push('/vehiculos');
            } else if (response.status === 401) {
                Swal.fire(
                    'Error!',
                    'No se pudo crear el vehiculo.',
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
                setError('Error al agregar el vehiculo.');
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

    const toggleSwitch = () => {
        setEstado(estado == 'BAJA' ? 'ACTIVO' : 'BAJA');
    };

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Agregar Nuevo Vehiculo</h1>
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
                    <label htmlFor="propietario" className="block text-sm font-medium text-white-700">Propietario</label>
                    <input
                        type="text"
                        id="propietario"
                        value={propietario}
                        onChange={(e) => setPropietario(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="tipo" className="block text-sm font-medium text-white-700">Tipo</label>
                    <select
                        id="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Seleccionar tipo</option>
                        <option value="AUTO">AUTO</option>
                        <option value="MOTO">MOTO</option>
                        <option value="CAMION">CAMION</option>
                        <option value="EMBARCACION">EMBARCACION</option>
                        <option value="MAQUINARIA">MAQUINARIA</option>
                        <option value="CUATRICICLO">CUATRICICLO</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="asignado" className="block text-sm font-medium text-white-700">Asignado a </label>
                    <input
                        type="text"
                        id="asignado"
                        value={asignado}
                        onChange={(e) => setAsignado(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="dominio" className="block text-sm font-medium text-white-700">Dominio</label>
                    <input
                        type="text"
                        id="dominio"
                        value={dominio}
                        onChange={(e) => setDominio(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="responsable" className="block text-sm font-medium text-white-700">Responsable</label>
                    <input
                        type="text"
                        id="responsable"
                        value={responsable}
                        onChange={(e) => setResponsable(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="legajo" className="block text-sm font-medium text-white-700">Legajo</label>
                    <input
                        type="text"
                        id="legajo"
                        value={legajo}
                        onChange={(e) => setLegajo(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="poliza" className="block text-sm font-medium text-white-700">Poliza</label>
                    <input
                        type="text"
                        id="poliza"
                        value={poliza}
                        onChange={(e) => setPoliza(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className='pb-4'>
                    <label htmlFor="estado" className="block py-1 text-sm font-medium text-white-700">Estado</label>
                    <span className={`mr-2 ${estado != 'BAJA' ? 'text-sky-600' : 'text-white'}`}>BAJA</span>
                    <button
                        id='estado'
                        type="button"
                        onClick={toggleSwitch}
                        className={` w-12 h-6 rounded-full p-1 transition-colors ${estado == 'ACTIVO' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                    >
                        <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform transform ${estado == 'ACTIVO' ? 'translate-x-6' : 'translate-x-0'
                                }`}
                        />
                    </button>
                    <span className="ml-2">{estado == 'ACTIVO' ? 'ACTIVO' : ''}</span>
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
                    onClick={() => router.push('/vehiculos')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default NuevoVehiculo;
