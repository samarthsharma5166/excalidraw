"use client"
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { axiosInstance } from '../../../libs/helper/axiosInstances';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [action, setAction] = useState('login');

    const handleSubmit = async () => {

        const res = await axiosInstance.post("/signin",{
            email,
            password    
        })

        if(res.data.success){
            localStorage.setItem('token', res.data.token)   
            router.push('/')
        }
    };

    return (
        <Suspense fallback={<h1 className='text-center text-4xl '>Loading</h1>}>
            <div className="flex flex-col items-center bg-gray-500 justify-center min-h-screen gap-4 bg-redd-8008">
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
                <button
                    onClick={handleSubmit}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    {'Sign Up'}
                </button>
                <Link
                    href={'/sign-up'}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    {'Switch to Sign Up'}
                </Link>
            </div>
        </Suspense>
    );
}