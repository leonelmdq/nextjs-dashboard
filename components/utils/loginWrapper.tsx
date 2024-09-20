const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = sessionStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    // Verificar si es un error 401
    if (response.status === 401) {
        // Redirigir al login si hay un 401
        window.location.href = '/login';
        return null;
    }

    return response;
};

export default apiFetch;