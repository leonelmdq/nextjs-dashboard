'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Legajo from "@/components/utils/types/legajo";
import Departamento from "@/components/utils/types/departamento";
import Swal from 'sweetalert2';

const EditarLegajo: React.FC = () => {
    const [legajo, setLegajo] = useState<Legajo | null>(null);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [departamentoId, setDepartamentoId] = useState<number | "">("");
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState('');
    const [piso, setPiso] = useState('');
    const [depto, setDepto] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [provincia, setProvincia] = useState('');
    const [pais, setPais] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [cuil, setCuil] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [fechaAntiguedad, setFechaAntiguedad] = useState('');
    const [fechaEgreso, setFechaEgreso] = useState('');
    const [tipoLiquidacion, setTipoLiquidacion] = useState('HORA');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const params = useParams();

    const getLegajo = async (id: number) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
    
            const [legajoData, fichaData] = await Promise.all([
                fetchLegajoData(id, token),
                fetchLegajoFicha(id, token)
            ]);
    
            if (legajoData) {
                handleLegajoData(legajoData);
            }
    
            if (fichaData) {
                handleLegajoFichaData(fichaData);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    
    const fetchLegajoData = async (id: number, token: string) => {
        const response = await fetch(`${apiURL}/private/rrhh/legajos/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
        });
    
        if (response.ok) {
            const data = await response.json();
            return data.data[0];
        } else {
            console.error('Failed to fetch legajo data');
            return null;
        }
    };
    
    const fetchLegajoFicha = async (id: number, token: string) => {
        const responseFicha = await fetch(`${apiURL}/private/rrhh/legajos/${id}/ficha`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
        });
    
        if (responseFicha.ok) {
            const dataFicha = await responseFicha.json();
            return dataFicha.data[0].ficha;
        } else {
            console.error('Failed to fetch ficha data');
            return null;
        }
    };
    
    const handleLegajoData = (legajo: any) => {
        setLegajo(legajo);
        setNombre(legajo.nombre);
        setApellido(legajo.apellido);
        setDepartamentoId(legajo.departamento_id);
    };
    
    const handleLegajoFichaData = (legajoFicha: any) => {
        setId(legajoFicha.legajo_id ?? '');
        setCalle(legajoFicha.calle ?? '');
        setNumero(legajoFicha.numero ?? '');
        setPiso(legajoFicha.piso ?? '');
        setDepto(legajoFicha.depto ?? '');
        setLocalidad(legajoFicha.localidad ?? '');
        setProvincia(legajoFicha.provincia ?? '');
        setPais(legajoFicha.pais ?? '');
        setTelefono(legajoFicha.telefono ?? '');
        setEmail(legajoFicha.email ?? '');
        setFechaNacimiento(legajoFicha.fecha_nacimiento);
        setCuil(legajoFicha.cuil ?? '');
        setFechaIngreso(legajoFicha.fecha_ingreso);
        setFechaAntiguedad(legajoFicha.fecha_antiguedad);
        setFechaEgreso(legajoFicha.fecha_egreso ?? '');
        setTipoLiquidacion(legajoFicha.tipo_liquidacion);
    };
    
    const getRepresentantes = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/rrhh/departamentos`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDepartamentos(data.data);
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


        const legajoActualizado = { nombre, apellido, departamento_id: departamentoId, fecha_nacimiento: fechaNacimiento, cuil, fecha_ingreso: fechaIngreso, fecha_antiguedad: fechaAntiguedad, tipo_liquidacion: tipoLiquidacion, fecha_egreso: fechaEgreso, telefono, email, calle, numero, localidad, provincia, pais, depto, piso };
        const sanitizedData = Object.fromEntries(
            Object.entries(legajoActualizado).map(([key, value]) => [key, value === '' ? null : value])
        ) as unknown as FormData;
        try {
            const response = await fetch(`${apiURL}/private/rrhh/legajos/${params.id}/ficha`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sanitizedData),
            });

            if (response.ok) {
                setSuccess('Legajo actualizado exitosamente.');
                Swal.fire(
                    'Modificado!',
                    'El legajo ha sido modificado.',
                    'success'
                );
                router.push('/legajos');
            } else {
                console.log(response)
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al actualizar el legajo.');
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
            getLegajo(Number(params.id));
            getRepresentantes();
        }
    }, [params.id]);

    if (!legajo) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-black p-6 rounded shadow-md max-w-6xl mx-auto">
                <h1 className="text-xl font-semibold mb-4 text-white">Editar Legajo N°{id}</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                <div className=" grid grid-cols-4 gap-4">
                    <div className="mb-4">
                        <label htmlFor="nombre" className="block text-sm font-medium text-white">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="apellido" className="block text-sm font-medium text-white">Apellido</label>
                        <input
                            type="text"
                            id="apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-white">Nacimiento</label>
                        <input
                            type="text"
                            id="fecha_nacimiento"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="cuil" className="block text-sm font-medium text-white">Cuil</label>
                        <input
                            type="text"
                            id="cuil"
                            value={cuil}
                            onChange={(e) => setCuil(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fecha_ingreso" className="block text-sm font-medium text-white">Ingreso</label>
                        <input
                            type="text"
                            id="fecha_ingreso"
                            value={fechaIngreso}
                            onChange={(e) => setFechaIngreso(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fecha_antiguedad" className="block text-sm font-medium text-white">Antiguedad</label>
                        <input
                            type="text"
                            id="fecha_antiguedad"
                            value={fechaAntiguedad}
                            onChange={(e) => setFechaAntiguedad(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tipo_liquidacion" className="block text-sm font-medium text-white">Liquidacion</label>
                        <select
                            id="tipo_liquidacion"
                            value={tipoLiquidacion}
                            onChange={(e) => setTipoLiquidacion(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        >
                            <option key={1} value='HORA'>
                                {'HORA'}
                            </option>
                            <option key={2} value='MENSUAL'>
                                {'MENSUAL'}
                            </option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="departamento_id" className="block text-sm font-medium text-white">Departamento</label>
                        <select
                            id="departamento_id"
                            value={departamentoId}
                            onChange={(e) => setDepartamentoId(Number(e.target.value))}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        >
                            {departamentos.map((rep) => (
                                <option key={rep.id} value={rep.id}>
                                    {rep.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fecha_egreso" className="block text-sm font-medium text-white">Egreso</label>
                        <input
                            type="text"
                            id="fecha_egreso"
                            value={fechaEgreso}
                            onChange={(e) => setFechaEgreso(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="telefono" className="block text-sm font-medium text-white">Telefono</label>
                        <input
                            type="text"
                            id="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="calle" className="block text-sm font-medium text-white">Calle</label>
                        <input
                            type="text"
                            id="calle"
                            value={calle}
                            onChange={(e) => setCalle(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="numero" className="block text-sm font-medium text-white">Numero</label>
                        <input
                            type="text"
                            id="numero"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="piso" className="block text-sm font-medium text-white">Piso</label>
                        <input
                            type="text"
                            id="piso"
                            value={piso}
                            onChange={(e) => setPiso(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="depto" className="block text-sm font-medium text-white">Depto</label>
                        <input
                            type="text"
                            id="depto"
                            value={depto}
                            onChange={(e) => setDepto(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="localidad" className="block text-sm font-medium text-white">Localidad</label>
                        <input
                            type="text"
                            id="localidad"
                            value={localidad}
                            onChange={(e) => setLocalidad(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="provincia" className="block text-sm font-medium text-white">Provincia</label>
                        <input
                            type="text"
                            id="provincia"
                            value={provincia}
                            onChange={(e) => setProvincia(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="pais" className="block text-sm font-medium text-white">Pais</label>
                        <input
                            type="text"
                            id="pais"
                            value={pais}
                            onChange={(e) => setPais(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-5'>
                    <button
                        type="submit"
                        className="btn btn-outline max-w-xl bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                        onClick={() => router.push('/legajos')}
                    >
                        Cancelar
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditarLegajo;
