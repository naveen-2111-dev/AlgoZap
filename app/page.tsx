'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [isFirefox, setIsFirefox] = useState(false);
  const [Lute, setLute] = useState<any>(null);
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
        localStorage.setItem('walletAddress', walletAddress); // ✅ Save to localStorage
        console.log('Connected Wallet Address:', walletAddress);

        setTimeout(() => {
          router.push('/create-user');
        }, 1000);
      } else {
        alert('No account found in Lute Wallet.');
      }
    } catch (err: any) {
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
        alert(`Connection failed: ${err.message || err}`);
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
