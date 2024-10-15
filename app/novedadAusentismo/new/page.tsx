'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';

import TipoAusentismo from "@/components/utils/types/tipoAusentismo";
import Nosocomio from "@/components/utils/types/nosocomio";
import Legajo from "@/components/utils/types/legajo";

import Swal from 'sweetalert2';
import moment from 'moment';

const NuevaNovedadAusentismo: React.FC = () => {
    const [fechaEvento, setFechaEvento] = useState('');
    const [profesional, setProfesional] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [diagnostico, setDiagnostico] = useState('');
    const [tipoAusentismo, setTipoAusentismo] = useState<TipoAusentismo[]>([]);
    const [nosocomios, setNosocomios] = useState<Nosocomio[]>([]);
    const [legajos, setLegajos] = useState<Legajo[]>([]);
    const [ausentismoId, setAusentismoId] = useState('');
    const [nosocomioId, setNosocomioId] = useState('');
    const [legajoId, setLegajoId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const getTipoAusentismo = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/rrhh/novedades_ausentismo_tipo`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setTipoAusentismo(data.data);
                } else {
                    console.error('Failed to fetch ausentismos');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const getNosocomios = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/rrhh/nosocomios`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setNosocomios(data.data);
                } else {
                    console.error('Failed to fetch nosocomios');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

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
        getTipoAusentismo();
        getLegajos();
        getNosocomios();
        setFechaEvento(moment().format('YYYY-MM-DD'));
        setFechaInicio(moment().format('YYYY-MM-DD'));
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
        const novedadAusentismo = { fecha_evento: fechaEvento, profesional, comentarios, fecha_inicio: fechaInicio, fecha_fin: fechaFin, diagnostico, legajo_id: legajoId, nosocomio_id:nosocomioId, ausentismo_id:ausentismoId };
        try {
            const response = await fetch(`${apiURL}/private/rrhh/novedades_ausentismo`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novedadAusentismo),
            });
            if (response.ok) {
                setSuccess('Novedad agregada exitosamente.');
                Swal.fire(
                    'Creada!',
                    'La nueva novedad ha sido creada.',
                    'success'
                );
                router.push('/novedadAusentismo');
            } else if (response.status === 401) {
                setError('No autorizado. Verifica tus credenciales.');
                Swal.fire(
                    'Error!',
                    'No se pudo crear la novedad',
                    'error'
                );
            } else {
                const data = await response.json();
                const errors = data.errors;
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al agregar la novedad.');
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
                <h1 className="text-xl font-semibold mb-2">Agregar Nueva Novedad Ausentismo</h1>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                <div className="mb-2">
                    <label htmlFor="fecha_evento" className="block text-sm font-medium text-white-700">Fecha Evento</label>
                    <input
                        type="date"
                        id="fecha_evento"
                        value={fechaEvento}
                        onChange={(e) => setFechaEvento(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profesional" className="block text-sm font-medium text-white-700">Profesional</label>
                    <input
                        type="text"
                        id="profesional"
                        value={profesional}
                        onChange={(e) => setProfesional(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
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
                    <label htmlFor="diagnostico" className="block text-sm font-medium text-white-700">Diagnostico</label>
                    <input
                        type="text"
                        id="diagnostico"
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="legajo_id" className="block text-sm font-medium text-white-700">Legajo</label>
                    <select
                        id="legajo_id"
                        value={legajoId}
                        onChange={(e) => setLegajoId(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Seleccionar Legajo</option>
                        {legajos.map((rep) => (
                            <option key={rep.id} value={rep.id}>
                                {rep.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="nosocomio_id" className="block text-sm font-medium text-white-700">Nosocomios</label>
                    <select
                        id="nosocomio_id"
                        value={nosocomioId}
                        onChange={(e) => setNosocomioId(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Seleccionar Nosocomio</option>
                        {nosocomios.map((rep) => (
                            <option key={rep.id} value={rep.id}>
                                {rep.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="ausentismo_id" className="block text-sm font-medium text-white-700">Ausentismo</label>
                    <select
                        id="ausentismo_id"
                        value={ausentismoId}
                        onChange={(e) => setAusentismoId(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Seleccionar Ausentismo</option>
                        {tipoAusentismo.map((rep) => (
                            <option key={rep.id} value={rep.id}>
                                {rep.motivo}
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
                    onClick={() => router.push('/novedadAusentismo')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default NuevaNovedadAusentismo;
