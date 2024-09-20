'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline'; // Asegúrate de importar correctamente el ícono
import { apiURL } from '@/app/lib/utils'
import Link from 'next/link';

const LogoutButton = () => {
    const router = useRouter();
    const LinkIcon = ArrowRightStartOnRectangleIcon;

    const logout = async () => {
        try {
            const token = sessionStorage.getItem('token');

            if (token) {
                const response = await fetch(`${apiURL}/private/logout`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                    router.push('/');
                } else {
                    console.error('Failed to logout');
                }
            }

        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <Link onClick={logout} href="/" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
            <LinkIcon className="flex flex-col items-center justify-center text-center h-10 gap-y-2" />
            <p className="text-sm md:text-base">Logout</p>
        </Link>
    );
};

export default LogoutButton;
