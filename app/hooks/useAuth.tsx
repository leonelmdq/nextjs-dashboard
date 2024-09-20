import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [router]);

    return isAuthenticated;
};

export default useAuth;
