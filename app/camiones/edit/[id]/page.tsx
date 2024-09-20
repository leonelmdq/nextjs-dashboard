'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiURL } from '@/app/lib/utils';
import Camion from "@/components/utils/types/camion";
import Swal from 'sweetalert2';


const EditarCamion: React.FC = () => {
    const [camion, setCamion] = useState<Camion | null>(null);
    const [marca, setMarca] = useState('');
    const [acoplado, setAcoplado] = useState(false);
    const [patente, setPatente] = useState('');
    const [marcaSemi, setMarcaSemi] = useState('');
    const [patenteSemi, setPatenteSemi] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const params = useParams();

    const getCamion = async (id: number) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/exportaciones/camiones/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const camion = data.data[0];
                    setCamion(camion);
                    setMarca(camion.marca);
                    setAcoplado(camion.acoplado == '1');
                    setPatente(camion.patente);
                    setMarcaSemi(camion.marca_semi);
                    setPatenteSemi(camion.patente_semi);
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

        const camionActualizado = { marca: marca, acoplado: acoplado, patente: patente, marca_semi: marcaSemi, patente_semi: patenteSemi };

        try {
            const response = await fetch(`${apiURL}/private/exportaciones/camiones/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(camionActualizado),
            });

            if (response.ok) {
                Swal.fire(
                    'Modificado!',
                    'El camion ha sido modificado.',
                    'success'
                );
                setSuccess('Camion actualizado exitosamente.');
                router.push('/camiones');
            } else {
                const data = await response.json();
                const errors = data.errors
                Swal.fire(
                    'Error!',
                    `${errors}`,
                    'error'
                );
                setError('Error al actualizar el camion.');
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
            getCamion(Number(params.id));
        }
    }, [params.id]);

    if (!camion) {
        return <p>Cargando...</p>;
    }
    const toggleSwitch = () => {
        setAcoplado(!acoplado);
    };

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit} className="bg-sky-600 text-white p-6 rounded shadow-md max-w-md mx-auto">
                <h1 className="text-xl font-semibold mb-4">Editar Camion</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                <div className="mb-4">
                    <label htmlFor="marca" className="block text-sm font-medium text-white-700">Marca</label>
                    <input
                        type="text"
                        id="marca"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="button"
                    onClick={toggleSwitch}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${acoplado ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform transform ${acoplado ? 'translate-x-6' : 'translate-x-0'
                            }`}
                    />
                </button>
                <div className="mb-4">
                    <label htmlFor="patente" className="block text-sm font-medium text-white-700">Patente</label>
                    <input
                        type="text"
                        id="patente"
                        value={patente}
                        onChange={(e) => setPatente(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="marca_semi" className="block text-sm font-medium text-white-700">Marca Semi</label>
                    <input
                        type="text"
                        id="marca_semi"
                        value={marcaSemi}
                        onChange={(e) => setMarcaSemi(e.target.value)}
                        className="text-black mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="patente_semi" className="block text-sm font-medium text-white-700">Patente Semi</label>
                    <input
                        type="text"
                        id="patente_semi"
                        value={patenteSemi}
                        onChange={(e) => setPatenteSemi(e.target.value)}
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
                    onClick={() => router.push('/camiones')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarCamion;
