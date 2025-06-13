'use client';

import { useState, useEffect } from 'react';

export default function CreateUser() {
  const [formData, setFormData] = useState({
    username: '',
    wallet: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const wallet = localStorage.getItem('walletAddress');
    if (wallet) {
      const snakeNames = ['cobra', 'viper', 'python', 'anaconda', 'rattler', 'boa', 'krait', 'mamba'];
      const randomSnake = snakeNames[Math.floor(Math.random() * snakeNames.length)];
      const shortHash = wallet.slice(-4);
      const generatedUsername = `${randomSnake}_${shortHash}`;

      setFormData({
        username: generatedUsername,
        wallet,
        email: '',
        password: '',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('User created!');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white dark:bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5"
      >
        <h1 className="text-2xl font-semibold text-black dark:text-white text-center">
          Create your account
        </h1>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            readOnly
            className="w-full px-3 py-2 bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md text-sm opacity-70 cursor-not-allowed"
          />
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
