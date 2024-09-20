// src/components/Logo.tsx
import React from 'react';
import Link from "next/link";

const Logo = () => {
    return (
        <div className=''>
            <Link href="/home">
                <img src="/logo-full.png" alt="Logo" className='object-contain' />
            </Link>
        </div>
    );
};

export default Logo;
