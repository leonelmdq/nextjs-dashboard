'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/app/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = useAuth();
    const router = useRouter();
    const token = sessionStorage.getItem('token');
    useEffect(() => {
        if (token == null) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return <>{children}</>;
};

export default ProtectedRoute;
