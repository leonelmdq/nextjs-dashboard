import React, { useState } from 'react';
import moment from 'moment';
import Fichada from "@/components/utils/types/fichada";

interface EditableRowProps {
    fichada: Fichada;
    onChange: (id: number, updatedFichada: Partial<Fichada>) => void;
}

const EditableRow: React.FC<EditableRowProps> = ({ fichada, onChange }) => {
    const handleChange = (field: keyof Fichada, value: string) => {
        onChange(fichada.id, { [field]: field === 'fecha' ? new Date(value) : value });
    };

    return (
        <tr>
            <td>{moment(fichada.fecha).format('dddd')}</td>
            <td>
                <input
                    type="date"
                    value={moment(fichada.fecha).format('YYYY-MM-DD')}
                    onChange={(e) => handleChange('fecha', e.target.value)}
                />
            </td>
            <td>
                <input
                    type="time"
                    value={moment(fichada.fecha).format('HH:mm')}
                    onChange={(e) => handleChange('fecha', moment(fichada.fecha).format('YYYY-MM-DD') + ' ' + e.target.value)}
                />
            </td>
            <td>
                <select
                    value={fichada.tipo_registro}
                    onChange={(e) => handleChange('tipo_registro', e.target.value)}
                >
                    <option value="0">Ingreso</option>
                    <option value="1">Salida</option>
                </select>
            </td>
        </tr>
    );
};

interface EditableTableProps {
    initialFichadas: Fichada[];
    onSave: (updatedFichadas: Fichada[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ initialFichadas, onSave }) => {
    const [fichadas, setFichadas] = useState<Fichada[]>(initialFichadas);

    const handleRowChange = (id: number, updatedFichada: Partial<Fichada>) => {
        setFichadas((prevFichadas) =>
            prevFichadas.map((fichada) =>
                fichada.id === id ? { ...fichada, ...updatedFichada } : fichada
            )
        );
    };

    const handleSave = () => {
        onSave(fichadas);
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Día</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo de Registro</th>
                    </tr>
                </thead>
                <tbody>
                    {fichadas.map((fichada) => (
                        <EditableRow key={fichada.id} fichada={fichada} onChange={handleRowChange} />
                    ))}
                </tbody>
            </table>
            <button onClick={handleSave} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                Guardar
            </button>
        </>
    );
};

export default EditableTable;
