import React from 'react';

const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

const DateToday = () => {
    const today = new Date();
    const formattedDate = formatDate(today);
    const weekNumber = getWeekNumber(today);

    return (
        <div className='p-8'>
            <div className="max-w-md max-h-80 bg-blue-100 p-4 rounded shadow-md text-center flex flex-col justify-center">
                <h1 className="text-lg font-semibold">{formattedDate}</h1>
                <p className="text-sm text-gray-600">Semana Numero: {weekNumber}</p>
            </div>
        </div>

    );
};

export default DateToday;
