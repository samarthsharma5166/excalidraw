'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { axiosInstance } from '../../../libs/helper/axiosInstances';
import Link from 'next/link';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [action, setAction] = useState('signup');
    const [username,setUsername] = useState('');

    const handleSubmit = async () => {
        const res = await axiosInstance.post("/signup", {
            email,
            password,
            username
        });
        console.log(res)
        
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-red-800">
            <h1 className="text-4xl text-white">{action === 'login' ? 'Login' : 'Sign Up'}</h1>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-white text-white placeholder:text-white outline-none bg-transparent"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border border-white text-white placeholder:text-white outline-none bg-transparent"
            />
            {action === 'signup' && (
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border border-white text-white placeholder:text-white outline-none bg-transparent"
                />
            )}
            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                {'Sign Up'}
            </button>
            <Link 
                href={'/sign-in'}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
            >
                {'Switch to Login'}
            </Link>
        </div>
    );
}