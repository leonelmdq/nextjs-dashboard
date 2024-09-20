import React, { useState } from 'react';

interface PaginatedTableProps<T> {
    data: T[];
    itemsPerPage: number;
    renderRow: (item: T, index: number) => JSX.Element;
    headers: string[];
}

function PaginatedTable<T>({ data, itemsPerPage, renderRow, headers }: Readonly<PaginatedTableProps<T>>) {
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-4 py-2">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => renderRow(item, index))}
                </tbody>
            </table>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={data.length}
                paginate={paginate}
            />
        </div>
    );
}

interface PaginationProps {
    itemsPerPage: number;
    totalItems: number;
    paginate: (pageNumber: number) => void;
}

function Pagination({ itemsPerPage, totalItems, paginate }: Readonly<PaginationProps>) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="inline-flex -space-x-px">
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default PaginatedTable;
