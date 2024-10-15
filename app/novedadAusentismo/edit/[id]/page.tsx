'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Legajo from "@/components/utils/types/legajo";
import Nosocomio from "@/components/utils/types/nosocomio";
import TipoAusentismo from "@/components/utils/types/tipoAusentismo";
import Swal from 'sweetalert2';
import moment from 'moment';

const EditarNovedad: React.FC = () => {
    const [legajos, setLegajos] = useState<Legajo[]>([]);
    const [legajoId, setLegajoId] = useState('');
    const [fechaEvento, setFechaEvento] = useState('');
    const [profesional, setProfesional] = useState('');
    const [nosocomioId, setNosocomioId] = useState<number | "">("");
    const [nosocomios, setNosocomios] = useState<Nosocomio[]>([]);
    const [comentarios, setComentarios] = useState('');
    const [ausentismoId, setAusentismoId] = useState<number | "">("");
    const [ausentismos, setAusentismos] = useState<TipoAusentismo[]>([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [diagnostico, setDiagnostico] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const params = useParams();

    const getNovedad = async (id: number) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/rrhh/novedades_ausentismo/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const ausentismo = data.data[0];
                    setLegajoId(ausentismo.legajo_id);
                    setFechaEvento(ausentismo.fecha_evento);
                    setFechaInicio(moment(ausentismo.fecha_inicio).format('YYYY-MM-DD'));
                    setFechaFin(moment(ausentismo.fecha_fin).format('YYYY-MM-DD'));
                    setProfesional(ausentismo.profesional);
                    setNosocomioId(data.data[0].nosocomio_id);
                    setAusentismoId(data.data[0].ausentismo_id);
                    setComentarios(ausentismo.comentarios);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

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
                    setAusentismos(data.data);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
            return;
        }
        const ausentismoActualizado = { fecha_evento: fechaEvento, profesional, comentarios, fecha_inicio: fechaInicio, fecha_fin: fechaFin, diagnostico, legajo_id: legajoId, nosocomio_id: nosocomioId, ausentismo_id: ausentismoId };
        console.log(ausentismoActualizado);
        const sanitizedData = Object.fromEntries(
            Object.entries(ausentismoActualizado).map(([key, value]) => [key, value === '' ? null : value])
        ) as unknown as FormData;
        try {
            const response = await fetch(`${apiURL}/private/rrhh/novedades_ausentismo/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sanitizedData),
            });
            if (response.ok) {
                setSuccess('Ausentismo actualizado correctamente.');
                Swal.fire(
                    'Modificado!',
                    'El ausentismo ha sido modificado.',
                    'success'
                );
                router.push('/novedadAusentismo');
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                console.error('Failed to update novedad');
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
        if (params.id) {
            getNovedad(Number(params.id));
            getTipoAusentismo();
            getLegajos();
            getNosocomios();
        }
    }, [params.id]);

    return (
        <div className="p-8 min-w-96">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-3xl mx-auto">
                <h1 className="text-xl font-semibold mb-2">Editar Novedad</h1>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                {success && <p className="text-green-600 mb-2">{success}</p>}
                <div className=" grid grid-cols-1 gap-4">
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
                    <div className="mb-2">
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
                    <div className="mb-2">
                        <label htmlFor="profesional" className="block text-sm font-medium text-white-700">Profesional</label>
                        <input
                            type="text"
                            id="profesional"
                            value={profesional}
                            onChange={(e) => setProfesional(e.target.value)}
                            className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="nosocomio_id" className="block text-sm font-medium text-white-700">Nosocomio</label>
                        <select
                            id="nosocomio_id"
                            value={nosocomioId}
                            onChange={(e) => setNosocomioId(Number(e.target.value))}
                            className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        >
                            {nosocomios.map((rep) => (
                                <option key={rep.id} value={rep.id}>
                                    {rep.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="comentarios" className="block text-sm font-medium text-white-700">Comentario</label>
                        <input
                            type="text"
                            id="comentarios"
                            value={comentarios}
                            onChange={(e) => setComentarios(e.target.value)}
                            className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="ausentismo_id" className="block text-sm font-medium text-white-700">Ausentismo</label>
                        <select
                            id="ausentismo_id"
                            value={ausentismoId}
                            onChange={(e) => setAusentismoId(Number(e.target.value))}
                            className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        >
                            {ausentismos.map((rep) => (
                                <option key={rep.id} value={rep.id}>
                                    {rep.motivo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='grid grid-cols-2 gap-5'>
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
                    </div>
                    <div className="mb-2">
                        <label htmlFor="diagnostico" className="block text-sm font-medium text-white-700">Diagnostico</label>
                        <input
                            type="text"
                            id="diagnostico"
                            value={diagnostico}
                            onChange={(e) => setDiagnostico(e.target.value)}
                            className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-5'>
                    <button
                        type="button"
                        className="btn btn-outline w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                        onClick={() => router.push('/novedadAusentismo')}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-outline max-w-xl bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarNovedad;
