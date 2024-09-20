'use client'
import { useState, FormEvent } from 'react';
import { apiURL } from '@/app/lib/utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiURL}/public/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('token', `Bearer ${data.data[0].token.token}`);
                sessionStorage.setItem('user', JSON.stringify(data.data[0].user));
                console.log('Login successful:', sessionStorage.getItem('user'));
                router.push('/home')
            } else {
                setError(data.errors);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-sky-700">
            <div className="container max-w-md w-full flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-6">
                    <Link href="/home">
                        <img src="/logo-full.png" alt="Logo" className="object-contain h-16 w-auto" />
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="form-group mb-4">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                            <input
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Email"
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-6">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                            <input
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                        Login
                    </button>

                    {error && <p className="error text-red-500 mt-4">{error}</p>}
                </form>
            </div>
        </div>

    );
}
