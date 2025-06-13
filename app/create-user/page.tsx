'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateUser() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '',
        wallet: '',
        email: '',
        password: '',
    });

    const snakeNames = ['cobra', 'viper', 'python', 'anaconda', 'rattler', 'boa', 'krait', 'mamba'];

    const generateUsername = (wallet: string) => {
        const randomSnake = snakeNames[Math.floor(Math.random() * snakeNames.length)];
        const shortHash = wallet.slice(-4);
        return `${randomSnake}_${shortHash}`;
    };

    useEffect(() => {
        const wallet = localStorage.getItem('walletAddress');
        if (wallet) {
            setFormData((prev) => ({
                ...prev,
                wallet,
                username: generateUsername(wallet),
            }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegenerateUsername = () => {
        const wallet = formData.wallet;
        if (wallet) {
            const newUsername = generateUsername(wallet);
            setFormData((prev) => ({
                ...prev,
                username: newUsername,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                walletId: formData.wallet, // ✅ correct field
                email: formData.email,
                password: formData.password,
                username: formData.username,
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Register API failed:', errorText);
            alert('Failed to register. Check console.');
            return;
        }

        const data = await res.json();
        console.log('✅ Register success:', data);
        alert('User created!');
        router.push('/home'); // Redirect to home or another page after successful registration
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-white dark:bg-black px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
                <h1 className="text-2xl font-semibold text-black dark:text-white text-center">
                    Create your account
                </h1>

                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Username</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            readOnly
                            className="flex-1 px-3 py-2 bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md text-sm opacity-70 cursor-not-allowed"
                        />
                        <button
                            type="button"
                            onClick={handleRegenerateUsername}
                            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded hover:opacity-90"
                        >
                            Change
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Wallet Address</label>
                    <div className="w-full px-3 py-2 bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md text-sm font-mono">
                        {formData.wallet
                            ? `${formData.wallet.slice(0, 6)}...${formData.wallet.slice(-4)}`
                            : 'Not connected'}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md text-sm"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-black text-white dark:bg-white dark:text-black rounded-md text-sm font-medium hover:opacity-90 transition"
                >
                    Create Account
                </button>
            </form>
        </main>
    );
}
