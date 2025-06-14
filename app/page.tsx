'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  
  type LuteConstructor = new (appName: string) => {
  connect: (network: string) => Promise<string[]>;
};

  const [address, setAddress] = useState<string | null>(null);
  const [isFirefox, setIsFirefox] = useState(false);
  const [Lute, setLute] = useState<LuteConstructor | null>(null);

  const router = useRouter();

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsFirefox(ua.includes('firefox'));

    import('lute-connect')
      .then((mod) => setLute(() => mod.default))
      .catch((err) => {
        console.error('Failed to load lute-connect:', err);
      });
  }, []);

const handleConnect = async () => {
  if (!Lute) {
    alert('LuteConnect not ready yet');
    return;
  }

  try {
    const lute = new Lute('MyApp');
    const accounts = await lute.connect('mainnet-v1.0');

    if (accounts && accounts.length > 0) {
      const walletAddress = accounts[0];
      setAddress(walletAddress);
      localStorage.setItem('walletAddress', walletAddress);

      // ✅ Send login request
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletId: walletAddress }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.success) {
        console.log('✅ Login successful');
        router.push('/home');
      } else if (loginRes.status === 404) {
        // Wallet not found → redirect to create-user
        console.log('🚫 Wallet not found. Redirecting to create-user...');
        setTimeout(() => {
          router.push('/create-user');
        }, 1000);
      } else {
        console.error('Login failed:', loginData.message);
        alert('Login failed: ' + loginData.message);
      }
    } else {
      alert('No account found in Lute Wallet.');
    }
  } catch (err: unknown) {
    console.error('Lute connection failed:', err);

    const isChrome =
      navigator.userAgent.includes('Chrome') &&
      !navigator.userAgent.includes('Edg') &&
      !navigator.userAgent.includes('OPR');

    if (isChrome) {
      const goToDownload = confirm(
        'Lute Wallet extension might not be installed.\nDo you want to go to the install page?'
      );
      if (goToDownload) {
        window.open('https://lute.app/', '_blank');
      }
    } else {
      alert(
        `Connection failed: ${
          typeof err === 'object' && err !== null && 'message' in err
            ? (err as { message?: string }).message
            : String(err)
        }`
      );
    }
  }
};




  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black gap-4">
      {isFirefox ? (
        <p className="text-red-600 dark:text-red-400 text-center px-4">
          ⚠️ Lute Wallet extension is not available on Firefox. Please use Chrome.
        </p>
      ) : (
        <>
          <button
            onClick={handleConnect}
            className="rounded-full border border-dashed border-black dark:border-white bg-white dark:bg-black text-black dark:text-white px-6 py-3 text-base sm:text-lg font-bold transition-all hover:scale-105 hover:rotate-[-1deg] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black shadow-lg"
          >
            {address
              ? `✅ Connected: ${address.slice(0, 6)}...`
              : 'Connect Lute Wallet'}
          </button>

          {address && (
            <p className="text-black dark:text-white font-mono text-center">
              Wallet Address: {address}
            </p>
          )}
        </>
      )}
    </div>
  );
}
