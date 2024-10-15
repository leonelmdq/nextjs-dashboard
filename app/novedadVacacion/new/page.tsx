'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';

import Legajo from "@/components/utils/types/legajo";

import Swal from 'sweetalert2';
import moment from 'moment';

const NuevaNovedadVacacion: React.FC = () => {
    const [comentarios, setComentarios] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [legajos, setLegajos] = useState<Legajo[]>([]);
    const [legajoId, setLegajoId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();


    const getLegajos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/rrhh/legajos/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setLegajos(data.data);
                } else {
                    console.error('Failed to fetch legajos');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        getLegajos();
        setFechaInicio(moment().startOf('week').add(1, 'week').add(1, 'day').format('YYYY-MM-DD'));
        setFechaFin(moment().startOf('week').add(1, 'week').add(1, 'day').add(2, 'weeks').format('YYYY-MM-DD'));
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

        const novedadVacacion = { comentarios, fecha_inicio: fechaInicio, fecha_fin: fechaFin, legajo_id: legajoId };
        try {
            const response = await fetch(`${apiURL}/private/rrhh/novedades_vacaciones`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novedadVacacion),
            });
            if (response.ok) {
                setSuccess('Vacacion agregada exitosamente.');
                Swal.fire(
                    'Creado!',
                    'La nueva vacacion ha sido creado.',
                    'success'
                );
                router.push('/novedadVacacion');
            } else if (response.status === 401) {
                setError('No autorizado. Verifica tus credenciales.');
                Swal.fire(
                    'Error!',
                    'No se pudo crear la vacacion.',
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
                setError('Error al agregar la vacacion.');
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
        <div className="p-2 min-w-96">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-2">Agregar Nuevo Novedad Vacacion</h1>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                <div className="mb-4">
                    <label htmlFor="legajo_id" className="block text-sm font-medium text-white-700">Legajo</label>
                    <select
                        id="legajo_id"
                        value={legajoId}
                        onChange={(e) => setLegajoId(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Seleccionar legajo</option>
                        {legajos.map((rep) => (
                            <option key={rep.id} value={rep.id}>
                                {rep.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label htmlFor="fecha_inicio" className="block text-sm font-medium text-white-700">Fecha Inicio</label>
                    <input
                        type="date"
                        id="fecha_inicio"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="fecha_fin" className="block text-sm font-medium text-white-700">Fecha Fin</label>
                    <input
                        type="date"
                        id="fecha_fin"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="comentarios" className="block text-sm font-medium text-white-700">Comentario</label>
                    <textarea
                        id="comentarios"
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        rows={2}
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
                    onClick={() => router.push('/novedadVacacion')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default NuevaNovedadVacacion;
