'use client';

import React, { useEffect, useState } from 'react';
import { apiURL } from '@/app/lib/utils';
import Navbar from "@/components/navigation/navbar";
import Fichada from "@/components/utils/types/fichada";
import Legajo from "@/components/utils/types/legajo";
import DetalleFichada from "@/components/utils/types/detalleFichada";
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
const Fichadas: React.FC = () => {
    const [fichadas, setFichadas] = useState<Fichada[]>([]);
    const [desde, setDesde] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'));
    const [hasta, setHasta] = useState<string>(moment().endOf('month').format('YYYY-MM-DD'));
    const [legajos, setLegajos] = useState<Legajo[]>([]);
    const [legajoId, setLegajoId] = useState('');
    const [detallado, setDetallado] = useState<DetalleFichada[]>([]);
    const [nextId, setNextId] = useState(1);


    const getLegajos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`${apiURL}/private/rrhh/legajos`, {
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
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const obtenerNombreDia = (fecha: string): string => {
        return moment(fecha, 'YYYY-MM-DD').format('dddd');
    };

    const separarFechaYHora = (fechaHora: string) => {
        const fecha = moment(fechaHora).format('YYYY-MM-DD');
        const hora = moment(fechaHora).format('HH:mm');

        return { fecha, hora };
    };

    function calcularHorasTrabajadas(entrada: string, salida: string): string {
        const horaEntrada = moment(entrada, 'HH:mm');
        const horaSalida = moment(salida, 'HH:mm');
        const duracion = moment.duration(horaSalida.diff(horaEntrada));
        const horas = Math.floor(duracion.asHours());
        const minutos = duracion.minutes();

        return `${horas}h ${minutos}m`;
    }



    const getFichadas = async (id: string, desde: string, hasta: string) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                await fetch(`${apiURL}/private/rrhh/fichadas/importar/origen/fichero`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ desde, hasta, sobreescribir: true, legajo_id: id }),
                });

                const response = await fetch(`${apiURL}/private/rrhh/fichadas/consultar/detalle/periodo/desde/${desde}/hasta/${hasta}/legajo/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFichadas(data.data);
                    console.log(fichadas);
                } else {
                    console.error('Failed to fetch data');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const procesarFichadas = async (fichadas: Fichada[]) => {
        // Ordenar las fichadas por fecha
        fichadas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        const resultado: DetalleFichada[] = [];
        const ingresos: Fichada[] = [];
        const salidas: Fichada[] = [];
        let id = nextId;
        // Separar ingresos y salidas
        fichadas.forEach((fichada) => {
            if (fichada.tipo_registro == '0') {
                ingresos.push(fichada);
            } else if (fichada.tipo_registro == '1') {
                salidas.push(fichada);
            }
        });
        console.log(ingresos);
        console.log(salidas);

        // Emparejar ingresos con salidas
        ingresos.forEach((entrada) => {
            const salida = salidas.find((s) => moment(s.fecha).isSame(entrada.fecha, 'day') && moment(s.fecha).isAfter(entrada.fecha));
            if (salida) {
                const { fecha: fechaEntrada, hora: horaEntrada } = separarFechaYHora(entrada.fecha.toString());
                const { hora: horaSalida } = separarFechaYHora(salida.fecha.toString());
                const dia = obtenerNombreDia(entrada.fecha.toString());
                const horasTrabajadas = calcularHorasTrabajadas(horaEntrada, horaSalida);

                resultado.push({
                    id: id++,
                    dia,
                    fecha: fechaEntrada,
                    ingreso: horaEntrada,
                    salida: horaSalida,
                    horasTrabajadas,
                });
                // Eliminar la salida emparejada para evitar emparejamientos duplicados
                salidas.splice(salidas.indexOf(salida), 1);
            } else {
                const { fecha: fechaEntrada, hora: horaEntrada } = separarFechaYHora(entrada.fecha.toString());
                const dia = obtenerNombreDia(entrada.fecha.toString());

                resultado.push({
                    id: id++,
                    dia,
                    fecha: fechaEntrada,
                    ingreso: horaEntrada,
                    salida: null,
                    horasTrabajadas: null,
                });
            }
        });
        console.log(resultado);
        setNextId(id);
        return resultado;
    }

    const handleSubmit = async () => {
        getFichadas(legajoId, desde, hasta);
    };

    const handleFiltradas = async () => {
        setDetallado(await procesarFichadas(fichadas));
    };

    useEffect(() => {
        getLegajos();
    }, []);

    const handleInputChange = (id: number, field: keyof DetalleFichada, value: string) => {
        setDetallado(prevFichadas => {
            return prevFichadas.map(fichada => {
                if (fichada.id === id) {
                    // Calcula las horas trabajadas si ingreso y salida están definidos
                    let horasTrabajadas = fichada.horasTrabajadas;
                    if (field === 'ingreso' || field === 'salida') {
                        if (fichada.ingreso && fichada.salida) {
                            horasTrabajadas = calcularHorasTrabajadas(fichada.ingreso, fichada.salida);
                        }
                    }
                    return {
                        ...fichada,
                        [field]: value,
                        horasTrabajadas,
                    };
                }
                return fichada;
            });
        });
    };

    return (
        <div>
            <Navbar />
            <div className='p-8'>
                <h1 className="text-4xl font-bold text-center text-white mt-8 mb-4">
                    Fichadas Registradas
                </h1>
                <div className="flex gap-4 mb-4">
                    <div className="">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="desde">
                            Desde
                        </label>
                        <input
                            type="date"
                            id="desde"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            className="shadow appearance-none border rounded min-w-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="hasta">
                            Hasta
                        </label>
                        <input
                            type="date"
                            id="hasta"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            className="shadow appearance-none border rounded min-w-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <select
                        id="legajo"
                        value={legajoId}
                        onChange={(e) => setLegajoId(e.target.value)}
                        className="mt-1 p-2 w-1/6 border border-gray-300 rounded"
                        required
                    >
                        <option value="">Seleccionar Legajo</option>
                        {legajos.map((rep) => (
                            <option key={rep.id} value={rep.id}>
                                ({rep.id}){rep.apellido} {rep.nombre}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                    >
                        Consultar Fichadas
                    </button>
                    <button
                        onClick={handleFiltradas}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                    >
                        Fichadas Filtradas
                    </button>
                </div>

                <table className='min-w-full rounded-lg bg-sky-600 text-white'>
                    <thead>
                        <tr>
                            <th className='py-2 px-4 border-b text-center' >Id </th>
                            <th className='py-2 px-4 border-b text-center' >Dia </th>
                            <th className='py-2 px-4 border-b text-center' >Fecha</th>
                            <th className='py-2 px-4 border-b text-center'>Ingreso</th>
                            <th className='py-2 px-4 border-b text-center'>Salida</th>
                            <th className='py-2 px-4 border-b text-center'>Horas Trabajadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detallado.map((fichada, index) => (
                            <tr key={fichada.id} className={`hover:bg-sky-700 ${index === detallado.length - 1 ? '' : 'border-b'}`}>
                                <td className='py-2 px-4 text-center'>{fichada.id}</td>
                                <td className='py-2 px-4 text-center'>{fichada.dia}</td>
                                <td className='py-2 px-4 text-center'>{moment(fichada.fecha).format('DD-MM-YYYY')}</td>
                                <td>
                                    <input
                                        type="time"
                                        value={fichada.ingreso ?? ''}
                                        onChange={e => handleInputChange(fichada.id, 'ingreso', e.target.value)}
                                        className="border p-1 bg-sky-600"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="time"
                                        value={fichada.salida ?? ''}
                                        onChange={e => handleInputChange(fichada.id, 'salida', e.target.value)}
                                        className="border p-1 bg-sky-600"
                                    />
                                </td>
                                <td className='py-2 px-4 text-center'>{fichada.horasTrabajadas}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Fichadas;
